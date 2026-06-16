import React from 'react';
import styled from 'styled-components';
import { Card, Btn, SectionTitle } from '../../styles/commonComponents';
import { DiaryEntry } from '../../types';
import { CONDITION_EMOJI } from '../../constants';

const SummaryCard = styled(Card)`
  margin-bottom: 16px;
`;

const ContentRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
`;

const Emoji = styled.div`
  font-size: 36px;
`;

const Title = styled.div`
  font-weight: 700;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Description = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

interface DiarySummaryProps {
  diary: DiaryEntry | null;
  onWriteClick: () => void;
}

export function DiarySummary({ diary, onWriteClick }: DiarySummaryProps) {
  const getConditionLabel = (val: string) => {
    return { great: '최고', good: '좋음', normal: '보통', bad: '나쁨', sick: '아픔' }[val] || '보통';
  };

  const emoji = diary ? CONDITION_EMOJI[diary.condition] : '😐';
  const titleText = diary ? getConditionLabel(diary.condition) : '기록 없음';
  const descText = diary
    ? (diary.symptoms.length ? diary.symptoms.join(', ') : '증상 없음')
    : '오늘 건강 기록을 작성해보세요';

  return (
    <>
      <SectionTitle>오늘의 건강 기록</SectionTitle>
      <SummaryCard>
        <ContentRow>
          <Emoji>{emoji}</Emoji>
          <div>
            <Title>{titleText}</Title>
            <Description>{descText}</Description>
          </div>
        </ContentRow>
        <Btn $variant="primary" $size="sm" onClick={onWriteClick}>
          📓 {diary ? '다이어리 수정하기' : '다이어리 작성하기'}
        </Btn>
      </SummaryCard>
    </>
  );
}

export default DiarySummary;
