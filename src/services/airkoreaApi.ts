import { API } from '../constants';
import { AlarmItem } from '../types';

/**
 * 한국환경공단_에어코리아_미세먼지 경보 발령 현황 API
 * Endpoint: https://apis.data.go.kr/B552584/UlfptcaAlarmInqireSvc/getUlfptcaAlarmInfo
 *
 * - 개발 환경: Vite 프록시 (/api/dust) 경유 → CORS 우회
 * - 배포 환경: Vercel rewrites (/api/dust) 경유 → CORS 우회
 */

// 개발/배포 공통 프록시 경로 (vite.config + vercel.json 에서 설정)
const PROXY_BASE = '/api/dust';

function buildUrl(year: string, month: string): string {
  const params = new URLSearchParams({
    serviceKey: API.KEY,
    returnType: 'json',
    numOfRows: '100',
    pageNo: '1',
    year,
    month,
  });
  return `${PROXY_BASE}${API.ALARM_ENDPOINT}?${params.toString()}`;
}

/** API 응답 items 배열에서 AlarmItem 배열로 변환 */
function parseItems(items: any[]): AlarmItem[] {
  return items.map((it) => ({
    districtName: it.districtName ?? it.DISTRICT_NAME ?? '',
    moveName:     it.moveName     ?? it.MOVE_NAME     ?? '',
    itemCode:     (it.itemCode    ?? it.ITEM_CODE     ?? 'PM10') as 'PM10' | 'PM25',
    issueGbn:     (it.issueGbn    ?? it.ISSUE_GBN     ?? '주의보') as '주의보' | '경보',
    issueVal:     String(it.issueVal ?? it.ISSUE_VAL ?? ''),
    issueDate:    it.issueDate    ?? it.ISSUE_DATE    ?? '',
    issueTime:    it.issueTime    ?? it.ISSUE_TIME    ?? '',
    clearDate:    it.clearDate    ?? it.CLEAR_DATE    ?? null,
    clearTime:    it.clearTime    ?? it.CLEAR_TIME    ?? null,
  }));
}

export async function fetchDustAlarms(): Promise<AlarmItem[] | null> {
  const now = new Date();
  const year  = String(now.getFullYear());
  const month = String(now.getMonth() + 1).padStart(2, '0');

  const url = buildUrl(year, month);
  console.info('[AirNote] 미세먼지 경보 API 요청:', url);

  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status} ${res.statusText}`);
    }

    const json = await res.json();

    // 응답 구조 검증
    const header = json?.response?.header;
    const resultCode = header?.resultCode;

    if (resultCode !== '00') {
      throw new Error(
        `API 오류 [${resultCode ?? 'unknown'}]: ${header?.resultMsg ?? '알 수 없는 오류'}`
      );
    }

    const body = json?.response?.body;
    const rawItems = body?.items;

    // items 가 null/undefined 이면 발령 없음으로 처리
    if (!rawItems) {
      console.info('[AirNote] 현재 발령 중인 경보 없음 (items null)');
      return [];
    }

    // items 는 배열 또는 단일 객체일 수 있음
    const itemArray: any[] = Array.isArray(rawItems) ? rawItems : [rawItems];
    const alarms = parseItems(itemArray);

    console.info(`[AirNote] 경보 ${alarms.length}건 수신 완료`);
    return alarms;

  } catch (err: any) {
    console.warn('[AirNote] 경보 API 오류 → 목업 사용:', err.message);
    return null;
  }
}

export default fetchDustAlarms;
