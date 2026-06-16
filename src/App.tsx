import React from 'react';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import { GlobalStyle } from './styles/globalStyles';
import { AppProvider, useApp } from './context/AppContext';
import { AppContainer, ScreenWrapper } from './styles/commonComponents';

// Pages
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import DiaryPage from './pages/DiaryPage';
import GroupPage from './pages/GroupPage';
import HistoryPage from './pages/HistoryPage';

// Common
import BottomNav from './components/common/BottomNav';
import Toast from './components/common/Toast';

function MainApp() {
  const { currentScreen, isLoggedIn } = useApp();

  if (!isLoggedIn) {
    return (
      <AppContainer>
        <LoginPage />
        <Toast />
      </AppContainer>
    );
  }

  return (
    <AppContainer>
      <ScreenWrapper $isActive={currentScreen === 'home'}>
        <HomePage />
      </ScreenWrapper>
      <ScreenWrapper $isActive={currentScreen === 'diary'}>
        <DiaryPage />
      </ScreenWrapper>
      <ScreenWrapper $isActive={currentScreen === 'group'}>
        <GroupPage />
      </ScreenWrapper>
      <ScreenWrapper $isActive={currentScreen === 'history'}>
        <HistoryPage />
      </ScreenWrapper>
      <BottomNav />
      <Toast />
    </AppContainer>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <AppProvider>
        <MainApp />
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
