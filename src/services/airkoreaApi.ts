import { API } from '../constants';
import { AlarmItem } from '../types';

export async function fetchDustAlarms(): Promise<AlarmItem[] | null> {
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
  } catch (err: any) {
    console.warn('[DustMate] 경보 API 오류, 목업 사용:', err.message);
    return null;
  }
}
export default fetchDustAlarms;
