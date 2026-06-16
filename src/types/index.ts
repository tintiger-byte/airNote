export type ConditionType = 'great' | 'good' | 'normal' | 'bad' | 'sick';

export type DustLevelType = 'good' | 'normal' | 'bad' | 'very_bad';

/** 통합대기환경지수(CAI) API 원본 응답 아이템 */
export interface CaiRawItem {
  stationCode: string;
  stationName: string;
  mangName: string;
  dataTime: string;   // "2026-06-16 16:00"
  caiValue: string;   // 통합대기환경지수 (0~500, "-" 시 미측정)
  caiGrade: string;   // "1"=좋음 "2"=보통 "3"=나쁨 "4"=매우나쁨
  caiItem: string;    // 주요 오염물질 (예: "오존", "미세먼지")
}

/** 앱에서 사용하는 실시간 대기질 데이터 */
export interface RealtimeDust {
  stationName: string;
  dataTime: string;
  caiValue: number;         // CAI 지수
  level: DustLevelType;     // 등급
  mainPollutant: string;    // 주 오염물질
  isMock: boolean;
}

export interface LocationData {
  display: string;
  province: string;
  district: string;
  lat: number;
  lng: number;
  cachedAt?: number;
}

export interface DiaryEntry {
  date: string;
  condition: ConditionType;
  symptoms: string[];
  outdoor: boolean;
  mask: boolean;
  memo: string;
}

export interface AlarmItem {
  sn: string;
  districtName: string;
  moveName: string;
  itemCode: 'PM10' | 'PM25';
  issueGbn: '주의보' | '경보';
  issueVal: string;
  issueDate: string;
  issueTime: string;
  clearDate: string | null;
  clearTime: string | null;
  clearVal: string | null;   // 해제 시 농도
  dataDate: string;          // 데이터 기준 날짜
}

export interface LevelMetaItem {
  label: string;
  emoji: string;
  badge: string;
  cardBg: string;
  color: string;
}

export type LevelMetaType = Record<DustLevelType, LevelMetaItem>;
