import React from 'react';
import styled, { css } from 'styled-components';
import { useApp } from '../../context/AppContext';

const StyledToast = styled.div<{ $show: boolean }>`
  position: fixed;
  bottom: calc(${({ theme }) => theme.dimensions.navHeight} + 16px);
  left: 50%;
  transform: translateX(-50%) translateY(20px);
  background: rgba(30, 35, 42, 0.95);
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 500;
  z-index: 300;
  opacity: 0;
  pointer-events: none;
  transition: all 0.3s ease;
  white-space: nowrap;
  backdrop-filter: blur(12px);
  color: ${({ theme }) => theme.colors.textPrimary};

  ${({ $show }) =>
    $show &&
    css`
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    `}
`;

export function Toast() {
  const { toastMessage } = useApp();

  return (
    <StyledToast $show={!!toastMessage}>
      {toastMessage}
    </StyledToast>
  );
}

export default Toast;
