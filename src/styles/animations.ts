import { keyframes, css } from 'styled-components';

export const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
`;

export const pulseGlow = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
`;

export const spin = keyframes`
  to { transform: rotate(360deg); }
`;

export const floatAnimation = css`
  animation: ${float} 3s ease-in-out infinite;
`;

export const pulseAnimation = css`
  animation: ${pulseGlow} 2s ease-in-out infinite;
`;

export const spinAnimation = css`
  animation: ${spin} 0.8s linear infinite;
`;
