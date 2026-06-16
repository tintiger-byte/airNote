import { LevelMetaType, AlarmItem, DiaryEntry } from '../types';

export const API = {
  KEY: '8e391968cfe3c7cf17fd2a34a31606b65f2b235c7a79b8642b3f3987f2e30f3d',
  // 미세먼지 경보 발령 현황 API
  ALARM_BASE: 'https://apis.data.go.kr/B552584/UlfptcaAlarmInqireSvc',
  ALARM_ENDPOINT: '/getUlfptcaAlarmInfo',
  // 통합대기환경지수(CAI) 실시간 조회 API
  CAI_BASE: 'https://apis.data.go.kr/B552584/RltmKhaiInfoSvc',
  CAI_ENDPOINT: '/getMsrstnKhaiRltmDnsty',
};

export const MOCK_ALARMS: AlarmItem[] = [
  { sn: '1', districtName: '서울', moveName: '중부권역', itemCode: 'PM10', issueGbn: '주의보', issueVal: '98',  issueDate: '2026-06-15', issueTime: '09:00', clearDate: null,         clearTime: null,    clearVal: null, dataDate: '2026-06-15' },
  { sn: '2', districtName: '경기', moveName: '북부권역', itemCode: 'PM10', issueGbn: '주의보', issueVal: '112', issueDate: '2026-06-15', issueTime: '08:00', clearDate: null,         clearTime: null,    clearVal: null, dataDate: '2026-06-15' },
  { sn: '3', districtName: '인천', moveName: '서부권역', itemCode: 'PM25', issueGbn: '경보',   issueVal: '76',  issueDate: '2026-06-14', issueTime: '22:00', clearDate: '2026-06-15', clearTime: '11:00', clearVal: '32', dataDate: '2026-06-14' },
];

export const MOCK_DUST: Record<string, { pm10: number; pm25: number; level: 'good' | 'normal' | 'bad' | 'very_bad' }> = {
  '서울 강남구': { pm10: 87, pm25: 42, level: 'bad' },
  '서울 서초구': { pm10: 62, pm25: 31, level: 'normal' },
  '경기 수원시': { pm10: 24, pm25: 11, level: 'good' },
  '서울 송파구': { pm10: 35, pm25: 18, level: 'good' },
};

export const LEVEL_META: LevelMetaType = {
  good:     { label: '좋음',   emoji: '😊', badge: 'badge-good',     cardBg: 'dust-bg-good',     color: 'var(--color-good)' },
  normal:   { label: '보통',   emoji: '🌤️', badge: 'badge-normal',   cardBg: 'dust-bg-normal',   color: 'var(--color-normal)' },
  bad:      { label: '나쁨',   emoji: '😷', badge: 'badge-bad',      cardBg: 'dust-bg-bad',      color: 'var(--color-bad)' },
  very_bad: { label: '매우나쁨', emoji: '🚨', badge: 'badge-very-bad', cardBg: 'dust-bg-very-bad', color: 'var(--color-very-bad)' },
};

export const CONDITION_EMOJI: Record<string, string> = {
  great: '😄', good: '😊', normal: '😐', bad: '😟', sick: '🤒'
};

export const MOCK_DIARY: DiaryEntry[] = [
  { date: '2026-06-14', condition: 'good',   symptoms: ['기침'],              outdoor: true,  mask: true,  memo: '미세먼지가 어제보다 나아졌다.' },
  { date: '2026-06-13', condition: 'bad',    symptoms: ['기침', '두통', '눈 따가움'], outdoor: true,  mask: true,  memo: '미세먼지 나쁨. 마스크 착용.' },
  { date: '2026-06-12', condition: 'normal', symptoms: [],                    outdoor: false, mask: false, memo: '' },
  { date: '2026-06-11', condition: 'great',  symptoms: [],                    outdoor: true,  mask: false, memo: '맑은 날씨! 기분 최고.' },
  { date: '2026-06-10', condition: 'sick',   symptoms: ['기침', '코막힘', '피로감'],  outdoor: false, mask: false, memo: '감기인지 미세먼지인지 모르겠음.' },
  { date: '2026-06-09', condition: 'good',   symptoms: ['목 따가움'],           outdoor: true,  mask: true,  memo: '' },
  { date: '2026-06-08', condition: 'normal', symptoms: [],                    outdoor: false, mask: false, memo: '' },
];

export const PROVINCE_MAP: [string, string][] = [
  ['서울', '서울'], ['경기', '경기'], ['인천', '인천'], ['강원', '강원'],
  ['충청북', '충북'], ['충북', '충북'], ['충청남', '충남'], ['충남', '충남'],
  ['대전', '대전'], ['세종', '세종'], ['전라북', '전북'], ['전북', '전북'],
  ['전라남', '전남'], ['전남', '전남'], ['광주', '광주'], ['경상북', '경북'],
  ['경북', '경북'], ['경상남', '경남'], ['경남', '경남'], ['부산', '부산'],
  ['대구', '대구'], ['울산', '울산'], ['제주', '제주'],
];
