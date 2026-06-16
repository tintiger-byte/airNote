import { API } from '../constants';
import { AlarmItem, RealtimeDust, CaiRawItem, DustLevelType } from '../types';

/**
 * CORS 우회 프록시 경로
 *   개발: vite.config.ts server.proxy
 *   배포: vercel.json rewrites
 */
const ALARM_PROXY = '/api/dust';   // → UlfptcaAlarmInqireSvc
const CAI_PROXY   = '/api/cai';    // → RltmKhaiInfoSvc

// ─── 유틸 ──────────────────────────────────────────────────────────────────

/** CAI 등급 숫자 → DustLevelType */
function gradeToLevel(grade: string): DustLevelType {
  switch (grade) {
    case '1': return 'good';
    case '2': return 'normal';
    case '3': return 'bad';
    case '4': return 'very_bad';
    default:  return 'normal';
  }
}

/** CAI 수치 → DustLevelType (등급 없을 때 fallback) */
function caiToLevel(val: number): DustLevelType {
  if (val <= 50)  return 'good';
  if (val <= 100) return 'normal';
  if (val <= 250) return 'bad';
  return 'very_bad';
}

// ─── CAI 실시간 조회 ────────────────────────────────────────────────────────

/**
 * 통합대기환경지수(CAI) 실시간 조회
 * 오퍼레이션: getMsrstnKhaiRltmDnsty
 * @param stationName 측정소명 (지역 구 단위, 예: "강남구", "종로구")
 */
export async function fetchRealtimeDust(stationName: string): Promise<RealtimeDust | null> {
  const params = new URLSearchParams({
    serviceKey: API.KEY,
    returnType: 'json',
    numOfRows:  '1',
    pageNo:     '1',
    stationName,
    dataTerm:   'DAILY',
    ver:        '1.0',
  });

  const url = `${CAI_PROXY}${API.CAI_ENDPOINT}?${params.toString()}`;
  console.info(`[AirNote] CAI API 요청 → 측정소: ${stationName}`);

  try {
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const json = await res.json();
    const header = json?.response?.header;
    if (header?.resultCode !== '200' && header?.resultCode !== '00') {
      throw new Error(`API [${header?.resultCode}]: ${header?.resultMsg}`);
    }

    const rawItems = json?.response?.body?.items?.item;
    if (!rawItems) return null;

    const arr: CaiRawItem[] = Array.isArray(rawItems) ? rawItems : [rawItems];
    // 가장 최근 데이터 (첫 번째 항목)
    const latest = arr[0];
    if (!latest) return null;

    const caiNum = parseInt(latest.caiValue, 10);
    const isValid = !isNaN(caiNum);

    return {
      stationName: latest.stationName,
      dataTime:    latest.dataTime,
      caiValue:    isValid ? caiNum : 0,
      level:       isValid
        ? (latest.caiGrade ? gradeToLevel(latest.caiGrade) : caiToLevel(caiNum))
        : 'normal',
      mainPollutant: latest.caiItem || '-',
      isMock: false,
    };
  } catch (err: any) {
    console.warn('[AirNote] CAI API 실패:', err.message);
    return null;
  }
}

// ─── 경보 발령 현황 조회 ────────────────────────────────────────────────────

function toAlarmItem(it: Record<string, any>): AlarmItem {
  return {
    sn:           String(it.sn          ?? ''),
    districtName: String(it.districtName ?? ''),
    moveName:     String(it.moveName     ?? ''),
    itemCode:     (it.itemCode === 'PM25' ? 'PM25' : 'PM10') as 'PM10' | 'PM25',
    issueGbn:     (it.issueGbn  === '경보' ? '경보' : '주의보') as '주의보' | '경보',
    issueVal:     String(it.issueVal  ?? ''),
    issueDate:    String(it.issueDate ?? ''),
    issueTime:    String(it.issueTime ?? ''),
    clearVal:     it.clearVal  != null ? String(it.clearVal)  : null,
    clearDate:    it.clearDate != null ? String(it.clearDate) : null,
    clearTime:    it.clearTime != null ? String(it.clearTime) : null,
    dataDate:     String(it.dataDate  ?? ''),
  };
}

async function fetchAlarmMonth(year: string, month: string): Promise<AlarmItem[]> {
  const params = new URLSearchParams({
    serviceKey: API.KEY,
    returnType: 'json',
    numOfRows:  '100',
    pageNo:     '1',
    year,
    month,
  });

  const url = `${ALARM_PROXY}${API.ALARM_ENDPOINT}?${params.toString()}`;
  console.info(`[AirNote] 경보 API 요청 → ${year}-${month}`);

  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const json = await res.json();
  const header = json?.response?.header;
  if (header?.resultCode !== '00') {
    throw new Error(`API [${header?.resultCode}]: ${header?.resultMsg}`);
  }

  const rawItems = json?.response?.body?.items;
  if (!rawItems) return [];

  const arr: any[] = Array.isArray(rawItems) ? rawItems : [rawItems];
  return arr.map(toAlarmItem);
}

export async function fetchDustAlarms(): Promise<AlarmItem[] | null> {
  try {
    const now   = new Date();
    const year  = String(now.getFullYear());
    const month = String(now.getMonth() + 1).padStart(2, '0');

    const thisMonth = await fetchAlarmMonth(year, month);

    // 이번 달 데이터 없으면 지난 달 조회
    if (thisMonth.length === 0) {
      const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const pYear  = String(prevDate.getFullYear());
      const pMonth = String(prevDate.getMonth() + 1).padStart(2, '0');
      const prevMonth = await fetchAlarmMonth(pYear, pMonth);
      console.info(`[AirNote] 경보 데이터 ${prevMonth.length}건 (${pYear}-${pMonth})`);
      return prevMonth;
    }

    console.info(`[AirNote] 경보 데이터 ${thisMonth.length}건`);
    return thisMonth;
  } catch (err: any) {
    console.warn('[AirNote] 경보 API 실패 → 목업 사용:', err.message);
    return null;
  }
}

export default fetchDustAlarms;
