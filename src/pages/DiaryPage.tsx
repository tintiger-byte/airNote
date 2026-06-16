import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useApp } from '../context/AppContext';
import { useDiaryStorage } from '../hooks/useDiaryStorage';
import type { ConditionType } from '../types';
import { getTodayStr, formatDate } from '../utils/dateUtils';

// Components
import Header from '../components/common/Header';
import { ScreenContent, Btn } from '../styles/commonComponents';
import ConditionSelector from '../components/diary/ConditionSelector';
import SymptomGrid from '../components/diary/SymptomGrid';
import ActivityToggle from '../components/diary/ActivityToggle';
import MemoInput from '../components/diary/MemoInput';

const DateSubText = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export function DiaryPage() {
  const { navigate, showToast } = useApp();
  const { diaries, saveDiary } = useDiaryStorage();
  const todayStr = getTodayStr();

  const [condition, setCondition] = useState<ConditionType>('normal');
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [outdoor, setOutdoor] = useState<boolean>(false);
  const [mask, setMask] = useState<boolean>(true);
  const [memo, setMemo] = useState<string>('');

  // Pre-populate today's values if a record exists
  useEffect(() => {
    const todayDiary = diaries[todayStr];
    if (todayDiary) {
      setCondition(todayDiary.condition);
      setSymptoms(todayDiary.symptoms);
      setOutdoor(todayDiary.outdoor);
      setMask(todayDiary.mask);
      setMemo(todayDiary.memo);
    } else {
      setCondition('normal');
      setSymptoms([]);
      setOutdoor(false);
      setMask(true);
      setMemo('');
    }
  }, [diaries, todayStr]);

  const handleSaveClick = () => {
    saveDiary({
      date: todayStr,
      condition,
      symptoms,
      outdoor,
      mask,
      memo,
    });
    showToast('💾 건강 다이어리가 저장되었습니다');
    navigate('home');
  };

  return (
    <>
      <Header title="건강 다이어리" rightSlot={<DateSubText>{formatDate(todayStr)}</DateSubText>} />
      <ScreenContent>
        <ConditionSelector selectedCondition={condition} onChange={setCondition} />
        <SymptomGrid selectedSymptoms={symptoms} onChange={setSymptoms} />
        <ActivityToggle
          outdoor={outdoor}
          mask={mask}
          onOutdoorChange={setOutdoor}
          onMaskChange={setMask}
        />
        <MemoInput value={memo} onChange={setMemo} />
        <Btn $variant="primary" onClick={handleSaveClick} style={{ marginTop: '10px' }}>
          💾 기록 저장하기
        </Btn>
      </ScreenContent>
    </>
  );
}

export default DiaryPage;
