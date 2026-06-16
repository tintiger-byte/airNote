import React from 'react';
import styled, { css } from 'styled-components';
import { Card, SectionTitle } from '../../styles/commonComponents';
import { DiaryEntry } from '../../types';

const CalCard = styled(Card)`
  margin-bottom: 16px;
`;

const CalNav = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const CalNavBtn = styled.button`
  background: ${({ theme }) => theme.colors.bgGlass};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textPrimary};
  border-radius: 8px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 16px;
  transition: ${({ theme }) => theme.transition};

  &:hover {
    background: ${({ theme }) => theme.colors.border};
  }
`;

const MonthLabel = styled.div`
  font-weight: 700;
  font-size: 16px;
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 20px;
`;

const CalDayLabel = styled.div`
  text-align: center;
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: 600;
  padding: 4px 0;
`;

const CalDay = styled.div<{ $isToday?: boolean; $hasRecord?: boolean; $condition?: string }>`
  aspect-ratio: 1;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: ${({ theme }) => theme.transition};
  position: relative;
  color: ${({ theme }) => theme.colors.textPrimary};

  &:hover {
    background: ${({ theme }) => theme.colors.bgGlass};
  }

  ${({ $isToday, theme }) =>
    $isToday &&
    css`
      font-weight: 900;
      color: ${theme.colors.good};
    `}

  ${({ $hasRecord, $condition, theme }) =>
    $hasRecord &&
    css`
      &::after {
        content: '';
        position: absolute;
        bottom: 2px;
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: ${() => {
          if ($condition === 'great' || $condition === 'good') return theme.colors.good;
          if ($condition === 'normal') return theme.colors.normal;
          if ($condition === 'bad') return theme.colors.bad;
          return theme.colors.veryBad;
        }};
      }
    `}
`;

const EmptyDay = styled.div`
  aspect-ratio: 1;
  cursor: default;
`;

interface CalendarProps {
  year: number;
  month: number;
  diaries: Record<string, DiaryEntry>;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onDayClick: (dateStr: string, hasRecord: boolean, condition?: string) => void;
}

export function Calendar({
  year,
  month,
  diaries,
  onPrevMonth,
  onNextMonth,
  onDayClick,
}: CalendarProps) {
  const label = `${year}년 ${month + 1}월`;

  const getDaysInMonth = (y: number, m: number) => {
    return new Date(y, m + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (y: number, m: number) => {
    return new Date(y, m, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const today = new Date();

  // Create list of day elements
  const dayElements = [];

  // Add empty spaces for previous month's padding
  for (let i = 0; i < firstDay; i++) {
    dayElements.push(<EmptyDay key={`empty-${i}`} />);
  }

  // Add calendar days
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const isToday =
      today.getFullYear() === year && today.getMonth() === month && today.getDate() === d;
    const record = diaries[dateStr];

    dayElements.push(
      <CalDay
        key={`day-${d}`}
        $isToday={isToday}
        $hasRecord={!!record}
        $condition={record?.condition}
        onClick={() => onDayClick(dateStr, !!record, record?.condition)}
      >
        {d}
      </CalDay>
    );
  }

  const weekLabels = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <>
      <SectionTitle>월간 캘린더</SectionTitle>
      <CalCard>
        <CalNav>
          <CalNavBtn onClick={onPrevMonth}>‹</CalNavBtn>
          <MonthLabel>{label}</MonthLabel>
          <CalNavBtn onClick={onNextMonth}>›</CalNavBtn>
        </CalNav>
        <CalendarGrid>
          {weekLabels.map((w, idx) => (
            <CalDayLabel key={idx}>{w}</CalDayLabel>
          ))}
        </CalendarGrid>
        <CalendarGrid>{dayElements}</CalendarGrid>
      </CalCard>
    </>
  );
}

export default Calendar;
