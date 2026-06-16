import { createGlobalStyle } from 'styled-components';
import type { ThemeType } from './theme';

export const GlobalStyle = createGlobalStyle`
  /* ========== Reset & Base ========== */
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body, #root {
    height: 100%;
    width: 100%;
    font-family: 'Noto Sans KR', sans-serif;
    background: ${({ theme }) => theme.colors.bgPrimary};
    color: ${({ theme }) => theme.colors.textPrimary};
    overflow: hidden;
    -webkit-font-smoothing: antialiased;
  }

  #root {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  /* Responsive Centering for Desktop */
  @media (min-width: 431px) {
    body {
      background: #060809;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
    }
  }

  /* Scrollbar hide helper */
  .no-scrollbar {
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }
`;
