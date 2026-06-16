import React from 'react';
import styled from 'styled-components';
import { Card } from '../../styles/commonComponents';

const WeatherCard = styled(Card)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
  padding: 16px;
  margin-bottom: 16px;
`;

const WeatherItem = styled.div`
  text-align: center;
  padding: 0 12px;

  &:not(:first-child) {
    border-left: 1px solid ${({ theme }) => theme.colors.border};
  }
`;

const Icon = styled.div`
  font-size: 22px;
`;

const Value = styled.div`
  font-size: 20px;
  font-weight: 700;
  margin: 4px 0;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Label = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

interface WeatherBarProps {
  temp?: number;
  humidity?: number;
  windSpeed?: number;
}

export function WeatherBar({ temp = 24, humidity = 58, windSpeed = 3 }: WeatherBarProps) {
  return (
    <WeatherCard>
      <WeatherItem>
        <Icon>🌡️</Icon>
        <Value>{temp}°</Value>
        <Label>기온</Label>
      </WeatherItem>
      <WeatherItem>
        <Icon>💧</Icon>
        <Value>{humidity}%</Value>
        <Label>습도</Label>
      </WeatherItem>
      <WeatherItem>
        <Icon>💨</Icon>
        <Value>{windSpeed}m/s</Value>
        <Label>풍속</Label>
      </WeatherItem>
    </WeatherCard>
  );
}

export default WeatherBar;
