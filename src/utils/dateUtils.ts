export function getTodayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function formatDate(str: string): string {
  const [y, m, d] = str.split('-');
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const day = days[new Date(str).getDay()];
  return `${y}년 ${parseInt(m)}월 ${parseInt(d)}일 (${day})`;
}
