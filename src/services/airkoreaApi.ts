import { API } from '../constants';
import { AlarmItem } from '../types';

/**
 * 한국환경공단_에어코리아_미세먼지 경보 발령 현황 API
 *
 * Endpoint : https://apis.data.go.kr/B552584/UlfptcaAlarmInqireSvc/getUlfptcaAlarmInfo
 * 실제 응답 필드 (curl 확인):
 *   sn, districtName, moveName, itemCode, issueGbn,
 *   issueVal, issueDate, issueTime,
 *   clearVal, clearDate, clearTime,
 *   dataDate
 *
 * ※ 쿼리의 year/month 기준으로 해당 월 내 데이터를 반환.
 *    이번 달 데이터가 없으면 빈 배열 반환됨.
 *
 * CORS 우회:
 *   - 개발: vite.config.ts server.proxy (/api/dust → apis.data.go.kr/...)
 *   - 배포: vercel.json rewrites (/api/dust → apis.data.go.kr/...)
 */

const PROXY_PATH = '/api/dust';

/** 실제 API JSON item → AlarmItem 변환 */
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

/**
 * 이번 달 + 지난 달 데이터를 모두 조회해 합칩니다.
 * (이번 달에 아직 경보가 없을 수 있으므로 이전 달도 포함)
 */
async function fetchMonth(year: string, month: string): Promise<AlarmItem[]> {
  const params = new URLSearchParams({
    serviceKey: API.KEY,
    returnType: 'json',
    numOfRows:  '100',
    pageNo:     '1',
    year,
    month,
  });

  const url = `${PROXY_PATH}${API.ALARM_ENDPOINT}?${params.toString()}`;
  console.info(`[AirNote] API 요청 → ${year}-${month}`);

  const res = await fetch(url, { headers: { Accept: 'application/json' } });

  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);

  const json = await res.json();
  const header = json?.response?.header;

  if (header?.resultCode !== '00') {
    throw new Error(`API Error [${header?.resultCode}]: ${header?.resultMsg}`);
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

    // 이번 달 데이터 조회
    const thisMonth = await fetchMonth(year, month);

    // 이번 달 데이터가 없으면 지난 달도 조회
    let prevMonth: AlarmItem[] = [];
    if (thisMonth.length === 0) {
      const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const pYear  = String(prevDate.getFullYear());
      const pMonth = String(prevDate.getMonth() + 1).padStart(2, '0');
      prevMonth = await fetchMonth(pYear, pMonth);
    }

    const combined = [...thisMonth, ...prevMonth];
    console.info(`[AirNote] 경보 데이터 총 ${combined.length}건`);
    return combined;

  } catch (err: any) {
    console.warn('[AirNote] 경보 API 실패 → 목업 사용:', err.message);
    return null;
  }
}

export default fetchDustAlarms;
