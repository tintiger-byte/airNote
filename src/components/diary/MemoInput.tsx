import React from 'react';
import styled from 'styled-components';
import { SectionTitle, TextAreaField, InputGroup } from '../../styles/commonComponents';

interface MemoInputProps {
  value: string;
  onChange: (val: string) => void;
}

export function MemoInput({ value, onChange }: MemoInputProps) {
  return (
    <>
      <SectionTitle>메모</SectionTitle>
      <InputGroup>
        <TextAreaField
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="오늘 건강 상태에 대해 자유롭게 기록하세요..."
        />
      </InputGroup>
    </>
  );
}

export default MemoInput;
