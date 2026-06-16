import React, { ReactNode, MouseEvent } from 'react';
import styled, { css } from 'styled-components';

const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(6px);
  z-index: 200;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s;

  ${({ $isOpen }) =>
    $isOpen &&
    css`
      opacity: 1;
      pointer-events: all;
    `}
`;

const ModalSheet = styled.div<{ $isOpen: boolean }>`
  width: 100%;
  max-width: 430px;
  background: ${({ theme }) => theme.colors.bgSecondary};
  border-radius: ${({ theme }) => theme.radius.xl} ${({ theme }) => theme.radius.xl} 0 0;
  padding: 24px;
  transform: translateY(100%);
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  border-top: 1px solid ${({ theme }) => theme.colors.border};

  ${({ $isOpen }) =>
    $isOpen &&
    css`
      transform: translateY(0);
    `}
`;

const ModalHandle = styled.div`
  width: 36px;
  height: 4px;
  background: ${({ theme }) => theme.colors.textMuted};
  border-radius: 2px;
  margin: 0 auto 20px;
`;

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, children }: ModalProps) {
  const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <ModalOverlay $isOpen={isOpen} onClick={handleOverlayClick}>
      <ModalSheet $isOpen={isOpen}>
        <ModalHandle />
        {children}
      </ModalSheet>
    </ModalOverlay>
  );
}

export default Modal;
