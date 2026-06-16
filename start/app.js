/* =============================================
   DustMate — app.js
   한국환경공단 에어코리아 API 연동
   ============================================= */

// ========== API 설정 ==========
const API = {
  KEY: '8e391968cfe3c7cf17fd2a34a31606b65f2b235c7a79b8642b3f3987f2e30f3d',
  BASE: 'https://apis.data.go.kr/B552584/UlfptcaAlarmInqireSvc',
  ALARM_ENDPOINT: '/getUlfptcaAlarmInfo',
};

// 에어코리아 경보 조회
async function fetchDustAlarms() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const url = `${API.BASE}${API.ALARM_ENDPOINT}?serviceKey=${API.KEY}&returnType=json&numOfRows=100&pageNo=1&year=${year}&month=${month}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const json = await res.json();
    const code = json?.response?.header?.resultCode;
    if (code !== '00') throw new Error('API Error: ' + json?.response?.header?.resultMsg);
    return json.response.body.items || [];
  } catch (err) {
    console.warn('[AirNote] 경보 API 오류, 목업 사용:', err.message);
    return null; // null 반환 시 목업 데이터 사용
  }
}

// 목업 경보 데이터 (API 실패 fallback)
const MOCK_ALARMS = [
  { districtName: '서울', moveName: '중부권역', itemCode: 'PM10', issueGbn: '주의보', issueVal: '98', issueDate: '2026-06-15', issueTime: '09:00', clearDate: null, clearTime: null },
  { districtName: '경기', moveName: '북부권역', itemCode: 'PM10', issueGbn: '주의보', issueVal: '112', issueDate: '2026-06-15', issueTime: '08:00', clearDate: null, clearTime: null },
  { districtName: '인천', moveName: '서부권역', itemCode: 'PM25', issueGbn: '경보', issueVal: '76', issueDate: '2026-06-14', issueTime: '22:00', clearDate: '2026-06-15', clearTime: '11:00' },
];

// ========== 목업 데이터 ==========
const MOCK_DUST = {
  '서울 강남구': { pm10: 87, pm25: 42, level: 'bad' },
  '서울 서초구': { pm10: 62, pm25: 31, level: 'normal' },
  '경기 수원시': { pm10: 24, pm25: 11, level: 'good' },
  '서울 송파구': { pm10: 35, pm25: 18, level: 'good' },
};

const LEVEL_META = {
  good:     { label: '좋음',   emoji: '😊', badge: 'badge-good',     cardBg: 'dust-bg-good',     color: 'var(--color-good)' },
  normal:   { label: '보통',   emoji: '🌤️', badge: 'badge-normal',   cardBg: 'dust-bg-normal',   color: 'var(--color-normal)' },
  bad:      { label: '나쁨',   emoji: '😷', badge: 'badge-bad',      cardBg: 'dust-bg-bad',      color: 'var(--color-bad)' },
  very_bad: { label: '매우나쁨', emoji: '🚨', badge: 'badge-very-bad', cardBg: 'dust-bg-very-bad', color: 'var(--color-very-bad)' },
};

const CONDITION_EMOJI = {
  great: '😄', good: '😊', normal: '😐', bad: '😟', sick: '🤒'
};

// 목업 다이어리 기록 (히스토리 화면용)
const MOCK_DIARY = [
  { date: '2026-06-14', condition: 'good',   symptoms: ['기침'],              outdoor: true,  mask: true,  memo: '미세먼지가 어제보다 나아졌다.' },
  { date: '2026-06-13', condition: 'bad',    symptoms: ['기침', '두통', '눈 따가움'], outdoor: true,  mask: true,  memo: '미세먼지 나쁨. 마스크 착용.' },
  { date: '2026-06-12', condition: 'normal', symptoms: [],                    outdoor: false, mask: false, memo: '' },
  { date: '2026-06-11', condition: 'great',  symptoms: [],                    outdoor: true,  mask: false, memo: '맑은 날씨! 기분 최고.' },
  { date: '2026-06-10', condition: 'sick',   symptoms: ['기침', '코막힘', '피로감'],  outdoor: false, mask: false, memo: '감기인지 미세먼지인지 모르겠음.' },
  { date: '2026-06-09', condition: 'good',   symptoms: ['목 따가움'],           outdoor: true,  mask: true,  memo: '' },
  { date: '2026-06-08', condition: 'normal', symptoms: [],                    outdoor: false, mask: false, memo: '' },
];

// ========== 앱 상태 ==========
const state = {
  currentScreen: 'login',
  selectedCondition: 'normal',
  selectedSymptoms: [],
  calYear: new Date().getFullYear(),
  calMonth: new Date().getMonth(),
  isLoggedIn: false,
  location: null,  // { display, province, district, lat, lng }
};

// ========== 위치 기반 ==========

// 한국 행정구역 → 경보 API districtName 매핑
const PROVINCE_MAP = [
  ['서울', '서울'], ['경기', '경기'], ['인천', '인천'], ['강원', '강원'],
  ['충청북', '충북'], ['충북', '충북'], ['충청남', '충남'], ['충남', '충남'],
  ['대전', '대전'], ['세종', '세종'], ['전라북', '전북'], ['전북', '전북'],
  ['전라남', '전남'], ['전남', '전남'], ['광주', '광주'], ['경상북', '경북'],
  ['경북', '경북'], ['경상남', '경남'], ['경남', '경남'], ['부산', '부산'],
  ['대구', '대구'], ['울산', '울산'], ['제주', '제주'],
];

function extractProvince(stateName) {
  for (const [key, val] of PROVINCE_MAP) {
    if (stateName.includes(key)) return val;
  }
  return stateName.replace(/(특별시|광역시|특별자치시|도|특별자치도)$/, '');
}

async function reverseGeocode(lat, lng) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=ko`;
    const res = await fetch(url, { headers: { 'User-Agent': 'DustMate/1.0' } });
    if (!res.ok) throw new Error('Nominatim HTTP ' + res.status);
    const data = await res.json();
    const addr = data.address || {};

    // 시도 (province level) — 경보 API 필터링용
    const rawState = addr.province || addr.state || '';
    const province = extractProvince(rawState);

    // 구/시/군 (district level) — 헤더 표시용
    const district = addr.city_district || addr.borough || addr.suburb ||
                     addr.town || addr.county || addr.city || '';

    // 표시용 문자열
    const display = district ? `${province} ${district}` : province || '현재 위치';

    return { display, province, district, lat, lng };
  } catch (err) {
    console.warn('[AirNote] 역지오코딩 오류:', err.message);
    return { display: '위치 확인 실패', province: '', district: '', lat, lng };
  }
}

async function initLocation() {
  const regionEl = document.getElementById('home-region');
  const subEl = document.getElementById('home-region-sub');
  if (!regionEl) return;

  // 위치 권한 요청 중 표시
  regionEl.textContent = '위치 확인 중...';
  if (subEl) subEl.textContent = 'GPS 연결 중';

  // 이미 위치 정보가 있으면 재활용 (5분 이내)
  if (state.location && state.location.cachedAt && Date.now() - state.location.cachedAt < 300000) {
    regionEl.textContent = state.location.display;
    if (subEl) subEl.textContent = '현재 위치';
    loadAlarmSection();
    return;
  }

  if (!navigator.geolocation) {
    regionEl.textContent = '위치 미지원';
    if (subEl) subEl.textContent = '브라우저 미지원';
    loadAlarmSection();
    return;
  }

  try {
    const pos = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        timeout: 10000,
        maximumAge: 300000,
        enableHighAccuracy: false,
      });
    });

    const { latitude: lat, longitude: lng } = pos.coords;
    const locData = await reverseGeocode(lat, lng);
    state.location = { ...locData, cachedAt: Date.now() };

    regionEl.textContent = state.location.display;
    if (subEl) subEl.textContent = '현재 위치 · 실시간';

    // PM 수치 카드도 지역에 맞게 업데이트
    updateDustCard();
    loadAlarmSection();

  } catch (err) {
    console.warn('[AirNote] 위치 오류:', err.code, err.message);
    const errMsg = err.code === 1 ? '위치 권한 거부됨' : '위치 확인 실패';
    regionEl.textContent = errMsg;
    if (subEl) subEl.textContent = '권한 설정 후 새로고침';
    showToast('📍 위치 권한을 허용하면 내 지역 경보를 볼 수 있어요');
    loadAlarmSection();
  }
}

function updateDustCard() {
  const province = state.location?.province || '';
  // province 기반 MOCK_DUST 매칭 (실제 API 연동 전까지)
  const regionKey = Object.keys(MOCK_DUST).find(k => k.includes(province)) || '서울 강남구';
  const dust = MOCK_DUST[regionKey];
  const meta = LEVEL_META[dust.level];

  document.getElementById('home-dust-card').className = 'dust-main-card ' + meta.cardBg;
  document.getElementById('home-pm10-val').textContent = dust.pm10;
  document.getElementById('home-pm10-val').className = 'dust-value level-' + dust.level.replace('_', '-');
  document.querySelector('.dust-status').textContent = meta.emoji + ' ' + meta.label;
  document.querySelector('.dust-status').className = 'dust-status level-' + dust.level.replace('_', '-');
  document.getElementById('home-level-badge').textContent = meta.label;
  document.getElementById('home-level-badge').className = 'badge ' + meta.badge;
  document.getElementById('home-pm10').textContent = dust.pm10;
  document.getElementById('home-pm25').textContent = dust.pm25;

  // PM 카드 단계별 색상 적용
  applyPmCardLevel('pm-card-pm10', dust.pm10, 'pm10');
  applyPmCardLevel('pm-card-pm25', dust.pm25, 'pm25');
}

// PM 수치 → 등급 변환
function getPmLevel(value, type) {
  if (type === 'pm10') {
    if (value <= 30)  return 'good';
    if (value <= 80)  return 'normal';
    if (value <= 150) return 'bad';
    return 'very-bad';
  } else { // pm25
    if (value <= 15) return 'good';
    if (value <= 35) return 'normal';
    if (value <= 75) return 'bad';
    return 'very-bad';
  }
}

const PM_LEVEL_META = {
  'good':     { label: '좋음',    emoji: '🌈', numClass: 'level-good' },
  'normal':   { label: '보통',    emoji: '🌤️', numClass: 'level-normal' },
  'bad':      { label: '나쁨',    emoji: '😷', numClass: 'level-bad' },
  'very-bad': { label: '매우나쁨', emoji: '🚨', numClass: 'level-very-bad' },
};

function applyPmCardLevel(cardId, value, type) {
  const card = document.getElementById(cardId);
  if (!card) return;
  const level = getPmLevel(value, type);
  const m = PM_LEVEL_META[level];

  // 기존 pm-level-* 클래스 제거 후 새로 추가
  card.classList.remove('pm-level-good', 'pm-level-normal', 'pm-level-bad', 'pm-level-very-bad');
  card.classList.add('pm-level-' + level);

  // 숫자 색상
  const numEl = card.querySelector('.pm-num');
  if (numEl) numEl.className = 'pm-num ' + m.numClass;

  // 레벨 태그 업데이트
  let tagEl = card.querySelector('.pm-level-tag');
  if (!tagEl) {
    tagEl = document.createElement('div');
    tagEl.className = 'pm-level-tag';
    card.appendChild(tagEl);
  }
  tagEl.textContent = m.emoji + ' ' + m.label;
}

// ========== 화면 라우팅 ==========
function navigate(screenId) {
  const prev = document.querySelector('.screen.active');
  const next = document.getElementById('screen-' + screenId);
  if (!next || prev === next) return;

  if (prev) {
    prev.classList.add('slide-out');
    setTimeout(() => prev.classList.remove('active', 'slide-out'), 350);
  }

  next.classList.add('active');

  // 하단 네비 활성 상태 갱신
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.screen === screenId);
  });

  // 화면별 초기화 훅
  if (screenId === 'diary') initDiaryScreen();
  if (screenId === 'history') initHistoryScreen();
  if (screenId === 'home') updateHomeScreen();

  state.currentScreen = screenId;
}

// ========== 로그인 ==========
function loginDemo() {
  state.isLoggedIn = true;

  const loginScreen = document.getElementById('screen-login');
  loginScreen.style.transition = 'opacity 0.4s ease';
  loginScreen.style.opacity = '0';
  setTimeout(() => {
    loginScreen.classList.remove('active');
    loginScreen.style.opacity = '';
    loginScreen.style.transition = '';
    document.getElementById('bottom-nav').style.display = 'flex';
    navigate('home');
  }, 400);
}

// ========== 홈 화면 업데이트 ==========
function updateHomeScreen() {
  // 초기 PM 수치 표시 (목업)
  updateDustCard();

  // 오늘 다이어리 요약
  const today = getTodayStr();
  const diary = getDiaryFromStorage(today);
  const summaryEl = document.getElementById('home-diary-summary');
  const emojiEl = document.getElementById('home-condition-emoji');

  if (diary) {
    emojiEl.textContent = CONDITION_EMOJI[diary.condition] || '😐';
    summaryEl.querySelector('div > div:first-child').textContent = getConditionLabel(diary.condition);
    summaryEl.querySelector('div > div:last-child').textContent =
      diary.symptoms.length ? diary.symptoms.join(', ') : '증상 없음';
  }

  // GPS 위치 획득 → 경보 현황 로드
  initLocation();
}

// ========== 경보 현황 렌더링 ==========
async function loadAlarmSection() {
  const section = document.getElementById('home-alarm-section');
  if (!section) return;

  section.innerHTML = `
    <div style="display:flex;align-items:center;gap:8px;padding:16px;color:var(--text-muted);font-size:13px">
      <div class="api-spinner"></div> 경보 현황 불러오는 중...
    </div>`;

  const items = await fetchDustAlarms();
  const data = items || MOCK_ALARMS;
  const isMock = items === null;
  const today = getTodayStr();

  // 전체 발령 중인 경보
  const allActive = data.filter(it => !it.clearDate || it.clearDate >= today);

  // 내 지역 경보 vs 전국 경보 분리
  const myProvince = state.location?.province || '';
  const myActive = myProvince ? allActive.filter(it => it.districtName === myProvince) : [];
  const otherActive = myProvince ? allActive.filter(it => it.districtName !== myProvince) : allActive;

  // 해제된 경보 (최근 순, 내 지역 우선)
  const cleared = data.filter(it => it.clearDate && it.clearDate < today)
    .sort((a, b) => (b.clearDate + b.clearTime).localeCompare(a.clearDate + a.clearTime))
    .slice(0, 3);

  const locationBadge = myProvince
    ? `<span style="font-size:10px;background:rgba(79,195,247,0.1);color:var(--color-good);border:1px solid rgba(79,195,247,0.2);padding:2px 8px;border-radius:8px;margin-left:6px">📍 ${myProvince}</span>`
    : '';
  const mockBadge = isMock
    ? `<span style="font-size:10px;background:rgba(255,183,77,0.15);color:var(--color-bad);border:1px solid rgba(255,183,77,0.3);padding:2px 8px;border-radius:8px;margin-left:6px">샘플</span>`
    : `<span style="font-size:10px;background:rgba(79,195,247,0.1);color:var(--color-good);border:1px solid rgba(79,195,247,0.2);padding:2px 8px;border-radius:8px;margin-left:6px">실시간</span>`;

  let html = `<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;flex-wrap:wrap;gap:6px">
    <div style="display:flex;align-items:center;flex-wrap:wrap;gap:4px">
      <span style="font-size:13px;font-weight:700;color:var(--text-secondary)">⚠️ 경보 발령 현황</span>
      ${locationBadge}${mockBadge}
    </div>
    <div style="font-size:11px;color:var(--text-muted)">${today}</div>
  </div>`;

  function alarmRow(it, highlight = false) {
    const isWarning = it.issueGbn === '경보';
    const color = isWarning ? 'var(--color-very-bad)' : 'var(--color-bad)';
    const bgColor = isWarning ? 'rgba(239,83,80,0.1)' : 'rgba(255,183,77,0.1)';
    const borderColor = isWarning ? 'rgba(239,83,80,0.3)' : 'rgba(255,183,77,0.3)';
    const icon = it.itemCode === 'PM25' ? '🔬' : '🌫️';
    const itemLabel = it.itemCode === 'PM25' ? '초미세먼지' : '미세먼지';
    const myTag = highlight ? `<span style="font-size:10px;background:rgba(79,195,247,0.15);color:var(--color-good);padding:1px 6px;border-radius:6px">내 지역</span>` : '';
    return `<div style="display:flex;align-items:center;gap:10px;padding:10px 12px;background:${bgColor};border:1px solid ${borderColor};border-radius:12px;margin-bottom:8px${highlight ? ';box-shadow:0 0 0 2px rgba(79,195,247,0.25)' : ''}">
      <div style="font-size:20px">${icon}</div>
      <div style="flex:1;min-width:0">
        <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:2px">
          <span style="font-weight:700;font-size:13px;color:${color}">${it.districtName}</span>
          <span style="font-size:12px;color:var(--text-secondary)">${it.moveName}</span>
          ${myTag}
        </div>
        <div style="font-size:11px;color:var(--text-muted)">${itemLabel} · 발령 ${it.issueDate} ${it.issueTime} · ${it.issueVal}㎍/㎥</div>
      </div>
      <span style="font-size:11px;font-weight:700;color:${color};background:${bgColor};border:1px solid ${borderColor};padding:3px 8px;border-radius:8px;white-space:nowrap;flex-shrink:0">${it.issueGbn}</span>
    </div>`;
  }

  // 내 지역 경보 (상단 강조)
  if (myActive.length > 0) {
    html += `<div style="font-size:11px;font-weight:700;color:var(--color-good);margin-bottom:8px;letter-spacing:0.05em">📍 내 지역 (${myProvince})</div>`;
    myActive.forEach(it => { html += alarmRow(it, true); });
    if (otherActive.length > 0) {
      html += `<div style="font-size:11px;font-weight:700;color:var(--text-muted);margin:12px 0 8px;letter-spacing:0.05em">🗺️ 전국 경보</div>`;
    }
  } else if (myProvince && allActive.length > 0) {
    html += `<div style="text-align:center;padding:12px;background:rgba(79,195,247,0.06);border:1px solid rgba(79,195,247,0.15);border-radius:12px;margin-bottom:12px;font-size:13px;color:var(--color-good)">✅ ${myProvince} 지역은 현재 경보 없음</div>`;
    html += `<div style="font-size:11px;font-weight:700;color:var(--text-muted);margin-bottom:8px;letter-spacing:0.05em">🗺️ 전국 경보</div>`;
  }

  // 전국 경보 (또는 위치 미확인 시 전체)
  if (allActive.length === 0) {
    html += `<div style="text-align:center;padding:24px 0;color:var(--text-muted);font-size:13px">✅ 현재 발령 중인 경보가 없습니다</div>`;
  } else {
    const showList = myProvince ? otherActive : allActive;
    showList.slice(0, 6).forEach(it => { html += alarmRow(it, false); });
    if (showList.length > 6) {
      html += `<div style="text-align:center;font-size:12px;color:var(--text-muted);padding:8px 0">외 ${showList.length - 6}건 더보기</div>`;
    }
  }

  // 최근 해제 경보
  if (cleared.length > 0) {
    html += `<div style="font-size:11px;color:var(--text-muted);margin:14px 0 8px;font-weight:600">— 최근 해제된 경보</div>`;
    cleared.forEach(it => {
      const icon = it.itemCode === 'PM25' ? '🔬' : '🌫️';
      const itemLabel = it.itemCode === 'PM25' ? '초미세먼지' : '미세먼지';
      html += `<div style="display:flex;align-items:center;gap:10px;padding:8px 12px;background:var(--bg-glass);border:1px solid var(--border-color);border-radius:12px;margin-bottom:6px;opacity:0.6">
        <div style="font-size:16px">${icon}</div>
        <div style="flex:1;min-width:0">
          <div style="font-size:12px;font-weight:600;color:var(--text-secondary)">${it.districtName} ${it.moveName}</div>
          <div style="font-size:10px;color:var(--text-muted)">${itemLabel} · 해제 ${it.clearDate} ${it.clearTime}</div>
        </div>
        <span style="font-size:10px;color:var(--text-muted)">해제</span>
      </div>`;
    });
  }

  section.innerHTML = html;
}

// ========== 다이어리 화면 초기화 ==========
function initDiaryScreen() {
  const today = getTodayStr();
  const dateEl = document.getElementById('diary-date');
  dateEl.textContent = formatDate(today);

  // 기존 저장된 기록 불러오기
  const saved = getDiaryFromStorage(today);
  if (saved) {
    selectConditionByVal(saved.condition);
    state.selectedSymptoms = [...saved.symptoms];
    document.querySelectorAll('.symptom-chip').forEach(btn => {
      btn.classList.toggle('selected', state.selectedSymptoms.includes(btn.dataset.symptom));
    });
    document.getElementById('toggle-outdoor').checked = saved.outdoor;
    document.getElementById('toggle-mask').checked = saved.mask;
    document.getElementById('diary-memo').value = saved.memo || '';
  }
}

function selectCondition(btn) {
  document.querySelectorAll('.condition-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  state.selectedCondition = btn.dataset.val;
}

function selectConditionByVal(val) {
  document.querySelectorAll('.condition-btn').forEach(b => {
    b.classList.toggle('selected', b.dataset.val === val);
  });
  state.selectedCondition = val;
}

function toggleSymptom(btn) {
  const symptom = btn.dataset.symptom;
  btn.classList.toggle('selected');
  if (btn.classList.contains('selected')) {
    if (!state.selectedSymptoms.includes(symptom)) state.selectedSymptoms.push(symptom);
  } else {
    state.selectedSymptoms = state.selectedSymptoms.filter(s => s !== symptom);
  }
}

function saveDiary() {
  const today = getTodayStr();
  const entry = {
    date: today,
    condition: state.selectedCondition,
    symptoms: [...state.selectedSymptoms],
    outdoor: document.getElementById('toggle-outdoor').checked,
    mask: document.getElementById('toggle-mask').checked,
    memo: document.getElementById('diary-memo').value.trim(),
  };

  // localStorage에 저장
  const all = getAllDiaries();
  all[today] = entry;
  localStorage.setItem('dm_diaries', JSON.stringify(all));

  showToast('✅ 오늘의 기록이 저장되었습니다!');
  setTimeout(() => navigate('home'), 800);
}

// ========== 히스토리 화면 초기화 ==========
function initHistoryScreen() {
  renderCalendar();
  renderHistoryList();
}

function renderCalendar() {
  const year = state.calYear;
  const month = state.calMonth;
  const label = `${year}년 ${month + 1}월`;
  document.getElementById('cal-month-label').textContent = label;

  const grid = document.getElementById('cal-grid');
  grid.innerHTML = '';

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const diaries = getAllDiaries();

  // 빈 칸
  for (let i = 0; i < firstDay; i++) {
    const cell = document.createElement('div');
    cell.className = 'cal-day empty';
    grid.appendChild(cell);
  }

  // 날짜 칸
  for (let d = 1; d <= daysInMonth; d++) {
    const cell = document.createElement('div');
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === d;
    const record = diaries[dateStr];

    cell.className = 'cal-day';
    if (isToday) cell.classList.add('today');
    if (record) {
      cell.classList.add('has-record', 'cond-' + (record.condition === 'great' ? 'good' : record.condition));
    }
    cell.textContent = d;
    cell.onclick = () => showToast(record ? `${dateStr}: ${getConditionLabel(record.condition)}` : `${dateStr}: 기록 없음`);
    grid.appendChild(cell);
  }
}

function changeMonth(dir) {
  state.calMonth += dir;
  if (state.calMonth < 0)  { state.calMonth = 11; state.calYear--; }
  if (state.calMonth > 11) { state.calMonth = 0;  state.calYear++; }
  renderCalendar();
}

function renderHistoryList() {
  const listEl = document.getElementById('history-list');
  const all = getAllDiaries();

  // 저장된 항목 + 목업 항목 병합
  const mockMap = {};
  MOCK_DIARY.forEach(d => { mockMap[d.date] = d; });
  const merged = { ...mockMap, ...all };

  const sorted = Object.keys(merged).sort((a, b) => b.localeCompare(a)).slice(0, 10);

  if (sorted.length === 0) {
    listEl.innerHTML = '<div class="empty-state"><div class="empty-icon">📭</div><p>아직 기록이 없습니다</p></div>';
    return;
  }

  listEl.innerHTML = sorted.map(date => {
    const r = merged[date];
    const emoji = CONDITION_EMOJI[r.condition] || '😐';
    const symptoms = r.symptoms && r.symptoms.length ? r.symptoms.join(', ') : '증상 없음';
    const outdoor = r.outdoor ? '외출 ✓' : '실내';
    return `
      <div class="card" style="margin-bottom:10px;cursor:pointer">
        <div style="display:flex;align-items:center;gap:12px">
          <div style="font-size:32px">${emoji}</div>
          <div style="flex:1">
            <div style="display:flex;justify-content:space-between;margin-bottom:4px">
              <span style="font-weight:700">${formatDate(date)}</span>
              <span class="badge ${getBadgeClass(r.condition)}">${getConditionLabel(r.condition)}</span>
            </div>
            <div style="font-size:12px;color:var(--text-secondary)">${symptoms} · ${outdoor}</div>
            ${r.memo ? `<div style="font-size:12px;color:var(--text-muted);margin-top:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${r.memo}</div>` : ''}
          </div>
        </div>
      </div>`;
  }).join('');
}

// ========== 그룹 기능 ==========
function selectGroupEmoji(btn, emoji) {
  document.querySelectorAll('#modal-create-group .condition-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  btn._emoji = emoji;
}

function createGroup() {
  const name = document.getElementById('new-group-name').value.trim();
  if (!name) { showToast('그룹 이름을 입력해주세요'); return; }
  closeModal('modal-create-group');
  showToast(`✅ "${name}" 그룹이 생성되었습니다!`);
  document.getElementById('new-group-name').value = '';
}

function copyInviteLink() {
  const link = 'https://dustmate.app/invite?ref=dm_' + Math.random().toString(36).slice(2, 8);
  navigator.clipboard.writeText(link).then(() => {
    showToast('🔗 초대 링크가 복사되었습니다!');
  }).catch(() => {
    showToast('🔗 링크: ' + link);
  });
}

// ========== 모달 ==========
function openModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('open');
}
function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('open');
}
function closeModalOnOverlay(event, id) {
  if (event.target === event.currentTarget) closeModal(id);
}

// ========== 토스트 ==========
let toastTimer = null;
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2500);
}

// ========== 유틸 ==========
function getTodayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function formatDate(str) {
  const [y, m, d] = str.split('-');
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const day = days[new Date(str).getDay()];
  return `${y}년 ${parseInt(m)}월 ${parseInt(d)}일 (${day})`;
}

function getAllDiaries() {
  try { return JSON.parse(localStorage.getItem('dm_diaries') || '{}'); }
  catch { return {}; }
}
function getDiaryFromStorage(date) {
  return getAllDiaries()[date] || null;
}

function getConditionLabel(val) {
  return { great: '최고', good: '좋음', normal: '보통', bad: '나쁨', sick: '아픔' }[val] || '보통';
}

function getBadgeClass(condition) {
  return {
    great: 'badge-good', good: 'badge-normal', normal: 'badge-normal', bad: 'badge-bad', sick: 'badge-very-bad'
  }[condition] || 'badge-normal';
}

// ========== 초기화 ==========
document.addEventListener('DOMContentLoaded', () => {
  // 하단 네비는 로그인 전에는 숨김 — 항상 로그인 화면에서 시작
  document.getElementById('bottom-nav').style.display = 'none';

  // 다이어리 날짜 초기화
  const dateEl = document.getElementById('diary-date');
  if (dateEl) dateEl.textContent = formatDate(getTodayStr());
});

