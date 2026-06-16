export const theme = {
  colors: {
    bgPrimary: '#0D1117',
    bgSecondary: '#161B22',
    bgCard: 'rgba(22, 27, 34, 0.85)',
    bgGlass: 'rgba(255, 255, 255, 0.05)',

    good: '#4FC3F7',
    normal: '#A5D6A7',
    bad: '#FFB74D',
    veryBad: '#EF5350',

    textPrimary: '#E6EDF3',
    textSecondary: '#8B949E',
    textMuted: '#484F58',

    border: 'rgba(255, 255, 255, 0.08)',
  },
  radius: {
    sm: '12px',
    md: '18px',
    lg: '24px',
    xl: '32px',
  },
  shadow: {
    card: '0 8px 32px rgba(0, 0, 0, 0.4)',
    glowBlue: '0 0 24px rgba(79, 195, 247, 0.3)',
    glowBad: '0 0 24px rgba(239, 83, 80, 0.3)',
  },
  dimensions: {
    navHeight: '72px',
    headerHeight: '60px',
  },
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
};

export type ThemeType = typeof theme;
