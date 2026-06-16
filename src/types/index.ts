export type ConditionType = 'great' | 'good' | 'normal' | 'bad' | 'sick';

export type DustLevelType = 'good' | 'normal' | 'bad' | 'very_bad';

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
