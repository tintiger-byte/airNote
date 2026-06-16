import { useState, useEffect, useCallback } from 'react';
import { fetchRealtimeDust } from '../services/airkoreaApi';
import type { RealtimeDust, DustLevelType } from '../types';

/** CAI 기반 mock 데이터 */
const MOCK_DUST: RealtimeDust = {
  stationName: '강남구',
  dataTime: new Date().toISOString().slice(0, 16).replace('T', ' '),
  caiValue: 72,
  level: 'normal',
  mainPollutant: '오존',
  isMock: true,
};

/**
 * CAI 지수(0~500) → PM10 환산 표시값
 * 실제 PM10이 아니라 CAI를 PM10 단위로 환산해 기존 UI에서 활용
 */
export function caiToPm10Display(cai: number): number {
  // CAI 기준: 0~50=좋음(PM10 0~30), 51~100=보통(31~80), 101~250=나쁨(81~150), 251+=매우나쁨(151+)
  if (cai <= 50)  return Math.round((cai / 50) * 30);
  if (cai <= 100) return Math.round(30 + ((cai - 50) / 50) * 50);
  if (cai <= 250) return Math.round(80 + ((cai - 100) / 150) * 70);
  return Math.round(150 + ((cai - 250) / 250) * 100);
}

export function useRealtimeDust(district: string | null) {
  const [dust, setDust] = useState<RealtimeDust | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async (stationName: string) => {
    setLoading(true);
    try {
      const result = await fetchRealtimeDust(stationName);
      if (result) {
        setDust(result);
      } else {
        // fallback: mock
        setDust({ ...MOCK_DUST, stationName, isMock: true });
      }
    } catch {
      setDust({ ...MOCK_DUST, stationName, isMock: true });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!district) {
      setDust({ ...MOCK_DUST, isMock: true });
      return;
    }
    load(district);
  }, [district, load]);

  return { dust, loading };
}
