import React from 'react';
import styled, { css } from 'styled-components';
import { SectionTitle } from '../../styles/commonComponents';
import { ConditionType } from '../../types';

const ConditionRow = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
`;

const ConditionBtn = styled.button<{ $isSelected: boolean }>`
  flex: 1;
  aspect-ratio: 1;
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.bgGlass};
  font-size: 28px;
  cursor: pointer;
  transition: ${({ theme }) => theme.transition};
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    border-color: ${({ theme }) => theme.colors.good};
    transform: scale(1.08);
  }

  ${({ $isSelected, theme }) =>
    $isSelected &&
    css`
      border-color: ${theme.colors.good};
      background: rgba(79, 195, 247, 0.15);
      transform: scale(1.08);
    `}
`;

interface ConditionSelectorProps {
  selectedCondition: ConditionType;
  onChange: (val: ConditionType) => void;
}

export function ConditionSelector({ selectedCondition, onChange }: ConditionSelectorProps) {
  const options: { val: ConditionType; title: string; emoji: string }[] = [
    { val: 'great', title: '최고', emoji: '😄' },
    { val: 'good', title: '좋음', emoji: '😊' },
    { val: 'normal', title: '보통', emoji: '😐' },
    { val: 'bad', title: '나쁨', emoji: '😟' },
    { val: 'sick', title: '아픔', emoji: '🤒' },
  ];

  return (
    <>
      <SectionTitle>오늘 컨디션은 어떠세요?</SectionTitle>
      <ConditionRow>
        {options.map((opt) => (
          <ConditionBtn
            key={opt.val}
            type="button"
            $isSelected={selectedCondition === opt.val}
            onClick={() => onChange(opt.val)}
            title={opt.title}
          >
            {opt.emoji}
          </ConditionBtn>
        ))}
      </ConditionRow>
    </>
  );
}

export default ConditionSelector;
