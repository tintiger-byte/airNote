import { useEffect } from 'react';
import styled from 'styled-components';
import { useApp } from '../context/AppContext';
import { useLocation } from '../hooks/useLocation';
import { useDustAlarms } from '../hooks/useDustAlarms';
import { useDiaryStorage } from '../hooks/useDiaryStorage';
import { useRealtimeDust, caiToPm10Display } from '../hooks/useRealtimeDust';
import { getTodayStr } from '../utils/dateUtils';

// Components
import Header from '../components/common/Header';
import { ScreenContent, Spinner } from '../styles/commonComponents';
import DustMainCard from '../components/home/DustMainCard';
import PmGrid from '../components/home/PmGrid';
import WeatherBar from '../components/home/WeatherBar';
import DiarySummary from '../components/home/DiarySummary';
import AlarmSection from '../components/home/AlarmSection';
import GroupMiniView from '../components/home/GroupMiniView';

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LocationText = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const SubText = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const RefreshBtn = styled.button`
  background: none;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 5px 8px;
  font-size: 14px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.textSecondary};
  transition: all 0.2s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.good};
    color: ${({ theme }) => theme.colors.good};
  }
`;

const NotifBtn = styled.button`
  background: none;
  border: none;
  font-size: 22px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.textPrimary};
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
  }
`;

const DataBadge = styled.span<{ $isMock: boolean }>`
  font-size: 10px;
  padding: 2px 7px;
  border-radius: 8px;
  margin-left: 6px;
  background: ${({ $isMock }) =>
    $isMock ? 'rgba(255,183,77,0.15)' : 'rgba(79,195,247,0.12)'};
  color: ${({ $isMock }) => ($isMock ? '#ffb74d' : '#4fc3f7')};
  border: 1px solid ${({ $isMock }) =>
    $isMock ? 'rgba(255,183,77,0.3)' : 'rgba(79,195,247,0.25)'};
`;

export function HomePage() {
  const { navigate, showToast, location: appLocation, setLocation: setAppLocation } = useApp();
  const { location, loading: locLoading, fetchLocation } = useLocation();
  const { alarms, isMock: alarmIsMock, loading: alarmLoading } = useDustAlarms();
  const { diaries } = useDiaryStorage();

  // 실시간 CAI 데이터 (지역 district 기준)
  const { dust, loading: dustLoading } = useRealtimeDust(appLocation?.district ?? null);

  // Sync location hook → AppContext
  useEffect(() => {
    if (location) setAppLocation(location);
  }, [location, setAppLocation]);

  // 최초 위치 조회
  useEffect(() => {
    if (!appLocation) {
      fetchLocation().then((loc) => {
        if (!loc) {
          showToast('⚠️ 위치 정보를 가져오지 못했습니다. 기본 위치(서울 강남구)로 표시합니다.');
          setAppLocation({
            province: '서울', district: '강남구', display: '서울 강남구',
            lat: 37.4979, lng: 127.0276, cachedAt: Date.now(),
          });
        }
      });
    }
  }, [appLocation, fetchLocation, setAppLocation, showToast]);

  const handleRefresh = async () => {
    showToast('🔄 내 위치 정보를 갱신하는 중...');
    const loc = await fetchLocation(true);
    if (loc) {
      showToast(`📍 위치 갱신 완료: ${loc.display}`);
    } else {
      showToast('⚠️ 위치 정보를 가져오지 못했습니다. 기본 위치(서울 강남구)로 표시합니다.');
      setAppLocation({
        province: '서울', district: '강남구', display: '서울 강남구',
        lat: 37.4979, lng: 127.0276, cachedAt: Date.now(),
      });
    }
  };

  const handleNotifClick = () => showToast('🔔 새 알림이 없습니다.');

  // ── 실시간 대기질 값 계산 ──────────────────────────────────────────
  const level     = dust?.level  ?? 'normal';
  const caiValue  = dust?.caiValue ?? 0;
  const pm10Disp  = caiToPm10Display(caiValue);  // CAI → PM10 환산
  // PM2.5는 CAI 기반 추정 (PM10의 약 50~60%)
  const pm25Disp  = Math.round(pm10Disp * 0.55);
  const isMock    = dust?.isMock ?? true;

  const todayStr   = getTodayStr();
  const todayDiary = diaries[todayStr] ?? null;

  return (
    <>
      <Header>
        <HeaderLeft>
          <span style={{ fontSize: '18px' }}>📍</span>
          <div>
            <LocationText>
              {locLoading ? '위치 확인 중...' : appLocation ? appLocation.display : '위치 미등록'}
            </LocationText>
            <SubText style={{ display: 'flex', alignItems: 'center' }}>
              {locLoading
                ? 'GPS 연결 중'
                : appLocation
                ? '현재 위치 · 실시간'
                : 'GPS 정보를 활성화해주세요'}
              {!locLoading && appLocation && (
                <DataBadge $isMock={isMock}>
                  {isMock ? '샘플' : `CAI ${caiValue}`}
                </DataBadge>
              )}
            </SubText>
          </div>
        </HeaderLeft>
        <HeaderRight>
          <RefreshBtn onClick={handleRefresh} title="위치 새로고침">🔄</RefreshBtn>
          <NotifBtn onClick={handleNotifClick} title="알림">🔔</NotifBtn>
        </HeaderRight>
      </Header>

      <ScreenContent>
        {dustLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
            <Spinner />
          </div>
        ) : (
          <>
            <DustMainCard
              pm10={pm10Disp}
              level={level}
              caiValue={caiValue}
              mainPollutant={dust?.mainPollutant}
              dataTime={dust?.dataTime}
              isMock={isMock}
            />
            <PmGrid pm10={pm10Disp} pm25={pm25Disp} />
          </>
        )}
        <WeatherBar />
        <DiarySummary diary={todayDiary} onWriteClick={() => navigate('diary')} />
        <AlarmSection
          location={appLocation}
          alarms={alarms}
          isMock={alarmIsMock}
          loading={alarmLoading}
        />
        <GroupMiniView onGroupClick={() => navigate('group')} />
      </ScreenContent>
    </>
  );
}

export default HomePage;
