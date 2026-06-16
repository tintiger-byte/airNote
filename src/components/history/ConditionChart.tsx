import React from 'react';
import styled from 'styled-components';
import { Card, SectionTitle } from '../../styles/commonComponents';
import { DiaryEntry, ConditionType } from '../../types';
import { CONDITION_EMOJI } from '../../constants';

const ChartCard = styled(Card)`
  margin-bottom: 16px;
`;

const BarRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const EmojiSpan = styled.span`
  font-size: 20px;
  width: 30px;
  display: inline-block;
`;

const BarContainer = styled.div`
  flex: 1;
  height: 16px;
  background: ${({ theme }) => theme.colors.bgGlass};
  border-radius: 8px;
  overflow: hidden;
`;

const Bar = styled.div<{ $width: number; $colorName: 'good' | 'normal' | 'bad' | 'veryBad' }>`
  height: 100%;
  border-radius: 8px;
  width: ${({ $width }) => $width}%;
  background: ${({ theme, $colorName }) => theme.colors[$colorName]};
  transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
`;

const BarVal = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textSecondary};
  width: 40px;
  text-align: right;
`;

interface ConditionChartProps {
  diaries: Record<string, DiaryEntry>;
}

export function ConditionChart({ diaries }: ConditionChartProps) {
  // Calculate occurrences of each condition in past 30 days
  const counts: Record<ConditionType, number> = {
    great: 0,
    good: 0,
    normal: 0,
    bad: 0,
    sick: 0,
  };

  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);

  Object.entries(diaries).forEach(([dateStr, entry]) => {
    const entryDate = new Date(dateStr);
    if (entryDate >= thirtyDaysAgo && entryDate <= today) {
      if (counts[entry.condition] !== undefined) {
        counts[entry.condition]++;
      }
    }
  });

  const maxCount = Math.max(...Object.values(counts));

  const orderedConditions: { key: ConditionType; colorName: 'good' | 'normal' | 'bad' | 'veryBad' }[] = [
    { key: 'great', colorName: 'good' },
    { key: 'good', colorName: 'good' },
    { key: 'normal', colorName: 'normal' },
    { key: 'bad', colorName: 'bad' },
    { key: 'sick', colorName: 'veryBad' },
  ];

  return (
    <>
      <SectionTitle>최근 컨디션 통계 (30일)</SectionTitle>
      <ChartCard>
        {orderedConditions.map(({ key, colorName }) => {
          const count = counts[key];
          const pct = maxCount > 0 ? (count / maxCount) * 100 : 0;
          return (
            <BarRow key={key}>
              <EmojiSpan>{CONDITION_EMOJI[key]}</EmojiSpan>
              <BarContainer>
                <Bar
                  $width={pct}
                  $colorName={colorName}
                />
              </BarContainer>
              <BarVal>{count}일</BarVal>
            </BarRow>
          );
        })}
      </ChartCard>
    </>
  );
}

export default ConditionChart;
