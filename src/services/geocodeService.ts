import { PROVINCE_MAP } from '../constants';
import { LocationData } from '../types';

export function extractProvince(stateName: string): string {
  for (const [key, val] of PROVINCE_MAP) {
    if (stateName.includes(key)) return val;
  }
  return stateName.replace(/(특별시|광역시|특별자치시|도|특별자치도)$/, '');
}

export async function reverseGeocode(lat: number, lng: number): Promise<LocationData> {
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
  } catch (err: any) {
    console.warn('[DustMate] 역지오코딩 오류:', err.message);
    return { display: '위치 확인 실패', province: '', district: '', lat, lng };
  }
}
