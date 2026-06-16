import styled, { css } from 'styled-components';
import { spin } from './animations';

export const AppContainer = styled.div`
  width: 100%;
  max-width: 430px;
  height: 100dvh;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.bgPrimary};
  box-shadow: 0 0 60px rgba(0, 0, 0, 0.8);
`;

export const ScreenWrapper = styled.section<{ $isActive: boolean }>`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.bgPrimary};
  opacity: ${({ $isActive }) => ($isActive ? 1 : 0)};
  pointer-events: ${({ $isActive }) => ($isActive ? 'all' : 'none')};
  transform: ${({ $isActive }) => ($isActive ? 'translateY(0)' : 'translateY(16px)')};
  transition: opacity 0.35s ease, transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  padding-bottom: ${({ theme }) => theme.dimensions.navHeight};
  overflow: hidden;
`;

export const ScreenContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px 16px calc(${({ theme }) => theme.dimensions.navHeight} + 16px);
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const Card = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 20px;
  backdrop-filter: blur(12px);
  box-shadow: ${({ theme }) => theme.shadow.card};
  transition: ${({ theme }) => theme.transition};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
  }
`;

export type BadgeVariant = 'good' | 'normal' | 'bad' | 'very_bad' | 'very-bad';

export const Badge = styled.span<{ $variant: BadgeVariant }>`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;

  ${({ $variant, theme }) => {
    switch ($variant) {
      case 'good':
        return css`
          background: rgba(79, 195, 247, 0.15);
          color: ${theme.colors.good};
        `;
      case 'normal':
        return css`
          background: rgba(165, 214, 167, 0.15);
          color: ${theme.colors.normal};
        `;
      case 'bad':
        return css`
          background: rgba(255, 183, 77, 0.2);
          color: ${theme.colors.bad};
        `;
      case 'very_bad':
      case 'very-bad':
        return css`
          background: rgba(239, 83, 80, 0.2);
          color: ${theme.colors.veryBad};
        `;
      default:
        return css`
          background: ${theme.colors.bgGlass};
          color: ${theme.colors.textSecondary};
        `;
    }
  }}
`;

export type BtnVariant = 'primary' | 'outline' | 'danger' | 'kakao';
export type BtnSize = 'sm' | 'md';

export const Btn = styled.button<{ $variant?: BtnVariant; $size?: BtnSize }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: ${({ $size }) => ($size === 'sm' ? '9px 16px' : '14px 24px')};
  border: none;
  border-radius: ${({ $size, theme }) => ($size === 'sm' ? '10px' : theme.radius.sm)};
  font-family: 'Noto Sans KR', sans-serif;
  font-size: ${({ $size }) => ($size === 'sm' ? '13px' : '15px')};
  font-weight: 700;
  cursor: pointer;
  transition: ${({ theme }) => theme.transition};
  text-decoration: none;
  width: ${({ $size }) => ($size === 'sm' ? 'auto' : '100%')};

  ${({ $variant, theme }) => {
    switch ($variant) {
      case 'primary':
        return css`
          background: linear-gradient(135deg, #4fc3f7, #0288d1);
          color: #fff;
          box-shadow: 0 4px 20px rgba(79, 195, 247, 0.4);
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 28px rgba(79, 195, 247, 0.5);
          }
        `;
      case 'kakao':
        return css`
          background: #fee500;
          color: #191919;
          &:hover {
            transform: translateY(-2px);
            background: #ffd700;
          }
        `;
      case 'outline':
        return css`
          background: transparent;
          border: 1px solid ${theme.colors.border};
          color: ${theme.colors.textSecondary};
          &:hover {
            border-color: ${theme.colors.good};
            color: ${theme.colors.good};
          }
        `;
      case 'danger':
        return css`
          background: linear-gradient(135deg, #ef5350, #c62828);
          color: #fff;
          &:hover {
            transform: translateY(-2px);
          }
        `;
      default:
        return css`
          background: ${theme.colors.bgGlass};
          color: ${theme.colors.textPrimary};
        `;
    }
  }}
`;

export const InputGroup = styled.div`
  margin-bottom: 14px;
`;

export const InputLabel = styled.label`
  display: block;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 6px;
  font-weight: 500;
`;

export const InputField = styled.input`
  width: 100%;
  padding: 14px 16px;
  background: ${({ theme }) => theme.colors.bgGlass};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 15px;
  transition: ${({ theme }) => theme.transition};
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.colors.good};
    box-shadow: 0 0 0 3px rgba(79, 195, 247, 0.15);
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

export const TextAreaField = styled.textarea`
  width: 100%;
  padding: 14px 16px;
  background: ${({ theme }) => theme.colors.bgGlass};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 15px;
  transition: ${({ theme }) => theme.transition};
  outline: none;
  resize: none;
  min-height: 100px;

  &:focus {
    border-color: ${({ theme }) => theme.colors.good};
    box-shadow: 0 0 0 3px rgba(79, 195, 247, 0.15);
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

export const SectionTitle = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 12px;
  margin-top: 24px;

  &:first-child {
    margin-top: 0;
  }
`;

export const Divider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.border};
  margin: 16px 0;
`;

export const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  background: ${({ theme }) => theme.colors.bgGlass};
  border: 1px solid ${({ theme }) => theme.colors.border};
  flex-shrink: 0;
`;

export const Spinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-top-color: ${({ theme }) => theme.colors.good};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
  flex-shrink: 0;
`;
