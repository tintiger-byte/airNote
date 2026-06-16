import React from 'react';
import styled, { css } from 'styled-components';
import { LEVEL_META } from '../../constants';
import { floatAnimation } from '../../styles/animations';
import { Badge, BadgeVariant, Divider } from '../../styles/commonComponents';

const StyledCard = styled.div<{ $level: string }>`
  border-radius: ${({ theme }) => theme.radius.xl};
  padding: 28px;
  margin-bottom: 16px;
  position: relative;
  overflow: hidden;
  min-height: 200px;
  background: inherit;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  ${({ $level, theme }) => {
    switch ($level) {
      case 'good':
        return css`
          background: linear-gradient(135deg, #0d2137, #0a3d5c);
          box-shadow: ${theme.shadow.glowBlue};
        `;
      case 'normal':
        return css`
          background: linear-gradient(135deg, #0d2318, #1b5e20);
        `;
      case 'bad':
        return css`
          background: linear-gradient(135deg, #2d1b00, #6d4c00);
        `;
      case 'very_bad':
      case 'very-bad':
        return css`
          background: linear-gradient(135deg, #2d0000, #7c0000);
          box-shadow: ${theme.shadow.glowBad};
        `;
      default:
        return css`
          background: ${theme.colors.bgSecondary};
        `;
    }
  }}
`;

const DustLabel = styled.div`
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 4px;
`;

const DustValueWrapper = styled.div`
  display: flex;
  align-items: baseline;
  gap: 6px;
`;

const DustValue = styled.div<{ $level: string }>`
  font-size: 72px;
  font-weight: 900;
  line-height: 1;

  color: ${({ $level, theme }) => {
    if ($level === 'good') return theme.colors.good;
    if ($level === 'normal') return theme.colors.normal;
    if ($level === 'bad') return theme.colors.bad;
    return theme.colors.veryBad;
  }};
`;

const DustUnit = styled.div`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: 400;
`;

const DustStatus = styled.div<{ $level: string }>`
  font-size: 22px;
  font-weight: 700;
  margin-top: 8px;

  color: ${({ $level, theme }) => {
    if ($level === 'good') return theme.colors.good;
    if ($level === 'normal') return theme.colors.normal;
    if ($level === 'bad') return theme.colors.bad;
    return theme.colors.veryBad;
  }};
`;

const FloatEmoji = styled.div`
  font-size: 48px;
  text-align: right;
  ${floatAnimation}
`;

const MetaRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 4px;
`;

const CaiBadge = styled.span<{ $isMock: boolean }>`
  font-size: 10px;
  padding: 2px 7px;
  border-radius: 8px;
  background: ${({ $isMock }) =>
    $isMock ? 'rgba(255,183,77,0.15)' : 'rgba(79,195,247,0.15)'};
  color: ${({ $isMock }) => ($isMock ? '#ffb74d' : '#4fc3f7')};
  border: 1px solid ${({ $isMock }) =>
    $isMock ? 'rgba(255,183,77,0.3)' : 'rgba(79,195,247,0.25)'};
`;

interface DustMainCardProps {
  pm10: number;
  level: 'good' | 'normal' | 'bad' | 'very_bad';
  caiValue?: number;
  mainPollutant?: string;
  dataTime?: string;
  isMock?: boolean;
}

export function DustMainCard({
  pm10,
  level,
  caiValue,
  mainPollutant,
  dataTime,
  isMock = true,
}: DustMainCardProps) {
  const meta = LEVEL_META[level] || LEVEL_META.good;

  const getTipMessage = (lvl: string) => {
    if (lvl === 'good')     return '🌳 공기가 깨끗하고 상쾌한 날입니다';
    if (lvl === 'normal')   return '🌤️ 야외 활동하기에 무난한 날씨입니다';
    if (lvl === 'bad')      return '⚠️ 외출 시 마스크 착용을 권장합니다';
    return '🚨 가급적 외출을 자제하고 실내에 머무르세요';
  };

  return (
    <StyledCard $level={level}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <DustLabel>
            통합대기환경지수 (CAI)
            {caiValue !== undefined && (
              <span style={{ marginLeft: 6, fontWeight: 700, color: '#fff', opacity: 0.8 }}>
                {caiValue}
              </span>
            )}
          </DustLabel>
          <DustValueWrapper>
            <DustValue $level={level}>{pm10}</DustValue>
            <DustUnit>㎍/㎥</DustUnit>
          </DustValueWrapper>
          <DustStatus $level={level}>
            {meta.emoji} {meta.label}
          </DustStatus>
        </div>
        <div style={{ textAlign: 'right' }}>
          <FloatEmoji>🌫️</FloatEmoji>
          <Badge $variant={level as BadgeVariant}>{meta.label}</Badge>
        </div>
      </div>
      <div>
        <Divider style={{ margin: '16px 0', opacity: 0.3 }} />
        <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>
          {getTipMessage(level)}
        </div>
        <MetaRow>
          <span>
            {mainPollutant ? `주 오염물질: ${mainPollutant}` : ''}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {dataTime && <span>{dataTime} 기준</span>}
            <CaiBadge $isMock={isMock}>{isMock ? '샘플' : '실시간'}</CaiBadge>
          </div>
        </MetaRow>
      </div>
    </StyledCard>
  );
}

export default DustMainCard;
