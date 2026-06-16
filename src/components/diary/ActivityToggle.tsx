import React from 'react';
import styled from 'styled-components';
import { Card, SectionTitle } from '../../styles/commonComponents';

const ToggleCard = styled(Card)`
  padding: 0 20px;
  margin-bottom: 16px;
`;

const ToggleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

const ToggleLabel = styled.div`
  font-size: 15px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const ToggleSub = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: 2px;
`;

const ToggleSwitch = styled.label`
  position: relative;
  width: 50px;
  height: 28px;
  flex-shrink: 0;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }
`;

const ToggleSlider = styled.span`
  position: absolute;
  inset: 0;
  background: ${({ theme }) => theme.colors.bgGlass};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 28px;
  cursor: pointer;
  transition: ${({ theme }) => theme.transition};

  &::before {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    left: 3px;
    top: 3px;
    background: ${({ theme }) => theme.colors.textMuted};
    border-radius: 50%;
    transition: ${({ theme }) => theme.transition};
  }

  input:checked + & {
    background: ${({ theme }) => theme.colors.good};
    border-color: ${({ theme }) => theme.colors.good};
  }

  input:checked + &::before {
    transform: translateX(22px);
    background: #fff;
  }
`;

interface ActivityToggleProps {
  outdoor: boolean;
  mask: boolean;
  onOutdoorChange: (val: boolean) => void;
  onMaskChange: (val: boolean) => void;
}

export function ActivityToggle({
  outdoor,
  mask,
  onOutdoorChange,
  onMaskChange,
}: ActivityToggleProps) {
  return (
    <>
      <SectionTitle>오늘 활동</SectionTitle>
      <ToggleCard>
        <ToggleRow>
          <div>
            <ToggleLabel>외출했나요?</ToggleLabel>
            <ToggleSub>오늘 야외 활동 여부</ToggleSub>
          </div>
          <ToggleSwitch>
            <input
              type="checkbox"
              checked={outdoor}
              onChange={(e) => onOutdoorChange(e.target.checked)}
            />
            <ToggleSlider />
          </ToggleSwitch>
        </ToggleRow>
        <ToggleRow>
          <div>
            <ToggleLabel>마스크 착용</ToggleLabel>
            <ToggleSub>외출 시 마스크 착용 여부</ToggleSub>
          </div>
          <ToggleSwitch>
            <input
              type="checkbox"
              checked={mask}
              onChange={(e) => onMaskChange(e.target.checked)}
            />
            <ToggleSlider />
          </ToggleSwitch>
        </ToggleRow>
      </ToggleCard>
    </>
  );
}

export default ActivityToggle;
