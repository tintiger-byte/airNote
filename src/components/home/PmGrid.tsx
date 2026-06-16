import React from 'react';
import styled from 'styled-components';
import { LEVEL_META } from '../../constants';

const GridWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 16px;
`;

const PmCard = styled.div`
  background: ${({ theme }) => theme.colors.bgGlass};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: 16px;
`;

const PmType = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: 500;
  margin-bottom: 6px;
`;

const PmNum = styled.div<{ $color: string }>`
  font-size: 28px;
  font-weight: 900;
  color: ${({ $color }) => $color};
`;

const PmUnit = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

interface PmGridProps {
  pm10: number;
  pm25: number;
}

export function PmGrid({ pm10, pm25 }: PmGridProps) {
  // Simple Korean air quality standards
  const getPm10Status = (val: number): 'good' | 'normal' | 'bad' | 'very_bad' => {
    if (val <= 30) return 'good';
    if (val <= 80) return 'normal';
    if (val <= 150) return 'bad';
    return 'very_bad';
  };

  const getPm25Status = (val: number): 'good' | 'normal' | 'bad' | 'very_bad' => {
    if (val <= 15) return 'good';
    if (val <= 35) return 'normal';
    if (val <= 75) return 'bad';
    return 'very_bad';
  };

  const pm10Level = getPm10Status(pm10);
  const pm25Level = getPm25Status(pm25);

  const pm10Meta = LEVEL_META[pm10Level];
  const pm25Meta = LEVEL_META[pm25Level];

  return (
    <GridWrapper>
      <PmCard>
        <PmType>미세먼지 PM10</PmType>
        <PmNum $color={pm10Meta.color}>{pm10}</PmNum>
        <PmUnit>
          ㎍/㎥ · <span style={{ color: pm10Meta.color }}>{pm10Meta.label}</span>
        </PmUnit>
      </PmCard>
      <PmCard>
        <PmType>초미세먼지 PM2.5</PmType>
        <PmNum $color={pm25Meta.color}>{pm25}</PmNum>
        <PmUnit>
          ㎍/㎥ · <span style={{ color: pm25Meta.color }}>{pm25Meta.label}</span>
        </PmUnit>
      </PmCard>
    </GridWrapper>
  );
}

export default PmGrid;
