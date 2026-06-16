import React from 'react';
import styled, { css } from 'styled-components';
import { Card, SectionTitle, Spinner } from '../../styles/commonComponents';
import { AlarmItem, LocationData } from '../../types';
import { getTodayStr } from '../../utils/dateUtils';

const AlarmCard = styled(Card)`
  margin-bottom: 16px;
  min-height: 60px;
`;

const LoaderWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 13px;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
  flex-wrap: wrap;
  gap: 6px;
`;

const BadgeSpan = styled.span<{ $isWarning?: boolean; $isMock?: boolean; $isLocation?: boolean }>`
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 8px;
  margin-left: 6px;

  ${({ $isLocation, theme }) =>
    $isLocation &&
    css`
      background: rgba(79, 195, 247, 0.1);
      color: ${theme.colors.good};
      border: 1px solid rgba(79, 195, 247, 0.2);
    `}

  ${({ $isMock, theme }) =>
    $isMock &&
    css`
      background: rgba(255, 183, 77, 0.15);
      color: ${theme.colors.bad};
      border: 1px solid rgba(255, 183, 77, 0.3);
    `}

  ${({ $isMock, theme }) =>
    $isMock === false &&
    css`
      background: rgba(79, 195, 247, 0.1);
      color: ${theme.colors.good};
      border: 1px solid rgba(79, 195, 247, 0.2);
    `}
`;

const AlarmRow = styled.div<{ $isWarning: boolean; $highlight: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 12px;
  margin-bottom: 8px;

  ${({ $isWarning, theme }) =>
    $isWarning
      ? css`
          background: rgba(239, 83, 80, 0.1);
          border: 1px solid rgba(239, 83, 80, 0.3);
        `
      : css`
          background: rgba(255, 183, 77, 0.1);
          border: 1px solid rgba(255, 183, 77, 0.3);
        `}

  ${({ $highlight, theme }) =>
    $highlight &&
    css`
      box-shadow: 0 0 0 2px ${theme.colors.good};
    `}
`;

const ClearedRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: ${({ theme }) => theme.colors.bgGlass};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  margin-bottom: 6px;
  opacity: 0.6;
`;

const DistrictText = styled.span<{ $isWarning: boolean }>`
  font-weight: 700;
  font-size: 13px;
  color: ${({ $isWarning, theme }) => ($isWarning ? theme.colors.veryBad : theme.colors.bad)};
`;

const IssueBadge = styled.span<{ $isWarning: boolean }>`
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 8px;
  white-space: nowrap;
  flex-shrink: 0;

  ${({ $isWarning, theme }) =>
    $isWarning
      ? css`
          color: ${theme.colors.veryBad};
          background: rgba(239, 83, 80, 0.1);
          border: 1px solid rgba(239, 83, 80, 0.3);
        `
      : css`
          color: ${theme.colors.bad};
          background: rgba(255, 183, 77, 0.1);
          border: 1px solid rgba(255, 183, 77, 0.3);
        `}
`;

interface AlarmSectionProps {
  location: LocationData | null;
  alarms: AlarmItem[] | null;
  isMock: boolean;
  loading: boolean;
}

export function AlarmSection({ location, alarms, isMock, loading }: AlarmSectionProps) {
  if (loading) {
    return (
      <>
        <SectionTitle style={{ marginTop: '24px' }}>경보 발령 현황</SectionTitle>
        <AlarmCard>
          <LoaderWrapper>
            <Spinner /> 데이터를 불러오는 중...
          </LoaderWrapper>
        </AlarmCard>
      </>
    );
  }

  const data = alarms || [];
  const today = getTodayStr();
  const myProvince = location?.province || '';

  // Active alarms (no clearDate or clearDate is today/future)
  const allActive = data.filter((it) => !it.clearDate || it.clearDate >= today);

  // Separate active alarms by location
  const myActive = myProvince ? allActive.filter((it) => it.districtName === myProvince) : [];
  const otherActive = myProvince ? allActive.filter((it) => it.districtName !== myProvince) : allActive;

  // Recently cleared alarms (cleared before today, sorted, limit to 3)
  const cleared = data
    .filter((it) => it.clearDate && it.clearDate < today)
    .sort((a, b) => {
      const aTime = `${a.clearDate} ${a.clearTime}`;
      const bTime = `${b.clearDate} ${b.clearTime}`;
      return bTime.localeCompare(aTime);
    })
    .slice(0, 3);

  return (
    <>
      <SectionTitle style={{ marginTop: '24px' }}>경보 발령 현황</SectionTitle>
      <AlarmCard>
        <HeaderRow>
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '4px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)' }}>
              ⚠️ 경보 발령 현황
            </span>
            {myProvince && (
              <BadgeSpan $isLocation={true}>📍 {myProvince}</BadgeSpan>
            )}
            <BadgeSpan $isMock={isMock}>{isMock ? '샘플' : '실시간'}</BadgeSpan>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{today}</div>
        </HeaderRow>

        {/* My region active warnings */}
        {myActive.length > 0 && (
          <>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-good)', marginBottom: '8px', letterSpacing: '0.05em' }}>
              📍 내 지역 ({myProvince})
            </div>
            {myActive.map((it, idx) => {
              const isWarning = it.issueGbn === '경보';
              return (
                <AlarmRow key={`my-${idx}`} $isWarning={isWarning} $highlight={true}>
                  <div style={{ fontSize: '20px' }}>{it.itemCode === 'PM25' ? '🔬' : '🌫️'}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '2px' }}>
                      <DistrictText $isWarning={isWarning}>{it.districtName}</DistrictText>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{it.moveName}</span>
                      <span style={{ fontSize: '10px', background: 'rgba(79, 195, 247, 0.15)', color: 'var(--color-good)', padding: '1px 6px', borderRadius: '6px' }}>
                        내 지역
                      </span>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {it.itemCode === 'PM25' ? '초미세먼지' : '미세먼지'} · 발령 {it.issueDate} {it.issueTime} · {it.issueVal}㎍/㎥
                    </div>
                  </div>
                  <IssueBadge $isWarning={isWarning}>{it.issueGbn}</IssueBadge>
                </AlarmRow>
              );
            })}
            {otherActive.length > 0 && (
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', margin: '12px 0 8px', letterSpacing: '0.05em' }}>
                🗺️ 전국 경보
              </div>
            )}
          </>
        )}

        {/* Clean region message */}
        {myProvince && myActive.length === 0 && allActive.length > 0 && (
          <>
            <div style={{ textAlign: 'center', padding: '12px', background: 'rgba(79, 195, 247, 0.06)', border: '1px solid rgba(79, 195, 247, 0.15)', borderRadius: '12px', marginBottom: '12px', fontSize: '13px', color: 'var(--color-good)' }}>
              ✅ {myProvince} 지역은 현재 경보 없음
            </div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', letterSpacing: '0.05em' }}>
              🗺️ 전국 경보
            </div>
          </>
        )}

        {/* Active alarms list */}
        {allActive.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)', fontSize: '13px' }}>
            ✅ 현재 발령 중인 경보가 없습니다
          </div>
        ) : (
          <>
            {(myProvince ? otherActive : allActive).slice(0, 6).map((it, idx) => {
              const isWarning = it.issueGbn === '경보';
              return (
                <AlarmRow key={`all-${idx}`} $isWarning={isWarning} $highlight={false}>
                  <div style={{ fontSize: '20px' }}>{it.itemCode === 'PM25' ? '🔬' : '🌫️'}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '2px' }}>
                      <DistrictText $isWarning={isWarning}>{it.districtName}</DistrictText>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{it.moveName}</span>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {it.itemCode === 'PM25' ? '초미세먼지' : '미세먼지'} · 발령 {it.issueDate} {it.issueTime} · {it.issueVal}㎍/㎥
                    </div>
                  </div>
                  <IssueBadge $isWarning={isWarning}>{it.issueGbn}</IssueBadge>
                </AlarmRow>
              );
            })}
            {(myProvince ? otherActive : allActive).length > 6 && (
              <div style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)', padding: '8px 0' }}>
                외 {(myProvince ? otherActive : allActive).length - 6}건 더보기
              </div>
            )}
          </>
        )}

        {/* Cleared alarms list */}
        {cleared.length > 0 && (
          <>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '14px 0 8px', fontWeight: 600 }}>
              — 최근 해제된 경보
            </div>
            {cleared.map((it, idx) => (
              <ClearedRow key={`cleared-${idx}`}>
                <div style={{ fontSize: '16px' }}>{it.itemCode === 'PM25' ? '🔬' : '🌫️'}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    {it.districtName} {it.moveName}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                    {it.itemCode === 'PM25' ? '초미세먼지' : '미세먼지'} · 해제 {it.clearDate} {it.clearTime}
                  </div>
                </div>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>해제</span>
              </ClearedRow>
            ))}
          </>
        )}
      </AlarmCard>
    </>
  );
}

export default AlarmSection;
