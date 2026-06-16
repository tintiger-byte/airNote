import React from 'react';
import styled, { css } from 'styled-components';
import { useApp, ScreenType } from '../../context/AppContext';

const StyledNav = styled.nav`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: ${({ theme }) => theme.dimensions.navHeight};
  display: flex;
  background: rgba(13, 17, 23, 0.95);
  backdrop-filter: blur(20px);
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  z-index: 100;
`;

const NavBtn = styled.button<{ $isActive: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  border: none;
  background: transparent;
  color: ${({ theme, $isActive }) => ($isActive ? theme.colors.good : theme.colors.textMuted)};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition};
  position: relative;

  &:hover {
    color: ${({ theme }) => theme.colors.textSecondary};
  }

  .nav-icon {
    font-size: 22px;
    line-height: 1;
  }

  .nav-label {
    font-size: 10px;
    font-weight: 500;
    font-family: 'Noto Sans KR', sans-serif;
  }

  ${({ $isActive, theme }) =>
    $isActive &&
    css`
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 32px;
        height: 2px;
        background: ${theme.colors.good};
        border-radius: 0 0 4px 4px;
      }
    `}
`;

export function BottomNav() {
  const { currentScreen, navigate } = useApp();

  const tabs: { screen: ScreenType; icon: string; label: string }[] = [
    { screen: 'home', icon: '🏠', label: '홈' },
    { screen: 'diary', icon: '📓', label: '다이어리' },
    { screen: 'group', icon: '👥', label: '그룹' },
    { screen: 'history', icon: '📊', label: '히스토리' },
  ];

  return (
    <StyledNav>
      {tabs.map((tab) => (
        <NavBtn
          key={tab.screen}
          $isActive={currentScreen === tab.screen}
          onClick={() => navigate(tab.screen)}
        >
          <span className="nav-icon">{tab.icon}</span>
          <span className="nav-label">{tab.label}</span>
        </NavBtn>
      ))}
    </StyledNav>
  );
}

export default BottomNav;
