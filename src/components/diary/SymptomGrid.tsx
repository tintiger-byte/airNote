import React from 'react';
import styled, { css } from 'styled-components';
import { SectionTitle } from '../../styles/commonComponents';

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 16px;
`;

const SymptomChip = styled.button<{ $isSelected: boolean }>`
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.bgGlass};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 13px;
  font-family: 'Noto Sans KR', sans-serif;
  cursor: pointer;
  transition: ${({ theme }) => theme.transition};
  text-align: center;
  font-weight: 500;

  &:hover {
    border-color: ${({ theme }) => theme.colors.good};
  }

  ${({ $isSelected, theme }) =>
    $isSelected &&
    css`
      border-color: ${theme.colors.bad};
      background: rgba(255, 183, 77, 0.12);
      color: ${theme.colors.bad};
    `}
`;

interface SymptomGridProps {
  selectedSymptoms: string[];
  onChange: (symptoms: string[]) => void;
}

export function SymptomGrid({ selectedSymptoms, onChange }: SymptomGridProps) {
  const options = [
    { label: '😷 기침', value: '기침' },
    { label: '🤕 두통', value: '두통' },
    { label: '👁️ 눈 따가움', value: '눈 따가움' },
    { label: '🗣️ 목 따가움', value: '목 따가움' },
    { label: '👃 코막힘', value: '코막힘' },
    { label: '😴 피로감', value: '피로감' },
  ];

  const handleToggle = (val: string) => {
    if (selectedSymptoms.includes(val)) {
      onChange(selectedSymptoms.filter((s) => s !== val));
    } else {
      onChange([...selectedSymptoms, val]);
    }
  };

  return (
    <>
      <SectionTitle>증상 체크 (복수 선택)</SectionTitle>
      <Grid>
        {options.map((opt) => (
          <SymptomChip
            key={opt.value}
            type="button"
            $isSelected={selectedSymptoms.includes(opt.value)}
            onClick={() => handleToggle(opt.value)}
          >
            {opt.label}
          </SymptomChip>
        ))}
      </Grid>
    </>
  );
}

export default SymptomGrid;
