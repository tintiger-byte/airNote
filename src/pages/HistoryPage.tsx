import { useApp } from '../context/AppContext';
import { useDiaryStorage } from '../hooks/useDiaryStorage';

// Components
import Header from '../components/common/Header';
import { ScreenContent } from '../styles/commonComponents';
import Calendar from '../components/history/Calendar';
import ConditionChart from '../components/history/ConditionChart';

export function HistoryPage() {
  const { showToast, calYear, calMonth, setCalYear, setCalMonth } = useApp();
  const { diaries } = useDiaryStorage();

  const handlePrevMonth = () => {
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear(calYear - 1);
    } else {
      setCalMonth(calMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (calMonth === 11) {
      setCalMonth(0);
      setCalYear(calYear + 1);
    } else {
      setCalMonth(calMonth + 1);
    }
  };

  const handleDayClick = (dateStr: string, hasRecord: boolean, condition?: string) => {
    if (!hasRecord || !condition) {
      showToast(`📍 ${dateStr}: 기록된 건강 일기가 없습니다.`);
      return;
    }
    const label =
      {
        great: '😄 최고',
        good: '😊 좋음',
        normal: '😐 보통',
        bad: '😟 나쁨',
        sick: '🤒 아픔',
      }[condition] || '보통';
    showToast(`📅 ${dateStr} 컨디션: ${label}`);
  };

  return (
    <>
      <Header title="기록 히스토리" />
      <ScreenContent>
        <Calendar
          year={calYear}
          month={calMonth}
          diaries={diaries}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onDayClick={handleDayClick}
        />
        <ConditionChart diaries={diaries} />
      </ScreenContent>
    </>
  );
}

export default HistoryPage;
