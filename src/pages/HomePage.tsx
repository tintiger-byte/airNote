import { useEffect } from 'react';
import styled from 'styled-components';
import { useApp } from '../context/AppContext';
import { useLocation } from '../hooks/useLocation';
import { useDustAlarms } from '../hooks/useDustAlarms';
import { useDiaryStorage } from '../hooks/useDiaryStorage';
import { MOCK_DUST } from '../constants';
import { getTodayStr } from '../utils/dateUtils';

// Components
import Header from '../components/common/Header';
import { ScreenContent } from '../styles/commonComponents';
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

export function HomePage() {
  const { navigate, showToast, location: appLocation, setLocation: setAppLocation } = useApp();
  const { location, loading: locLoading, fetchLocation } = useLocation();
  const { alarms, isMock, loading: alarmLoading } = useDustAlarms();
  const { diaries } = useDiaryStorage();

  // Sync state between hook and AppContext
  useEffect(() => {
    if (location) {
      setAppLocation(location);
    }
  }, [location, setAppLocation]);

  // Initial location fetch
  useEffect(() => {
    if (!appLocation) {
      fetchLocation().then((loc) => {
        if (!loc) {
          showToast('⚠️ 위치 정보를 가져오지 못했습니다. 기본 위치(서울 강남구)로 표시합니다.');
          setAppLocation({ province: '서울', district: '강남구', display: '서울 강남구', lat: 37.4979, lng: 127.0276, cachedAt: Date.now() });
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
      setAppLocation({ province: '서울', district: '강남구', display: '서울 강남구', lat: 37.4979, lng: 127.0276, cachedAt: Date.now() });
    }
  };

  const handleNotifClick = () => {
    showToast('🔔 새 알림이 없습니다.');
  };

  // Get current dust value based on location
  const myProvince = appLocation?.province || '';
  const matchedKey = Object.keys(MOCK_DUST).find((k) => k.includes(myProvince)) || '서울 강남구';
  const dust = MOCK_DUST[matchedKey];

  const todayStr = getTodayStr();
  const todayDiary = diaries[todayStr] || null;

  return (
    <>
      <Header>
        <HeaderLeft>
          <span style={{ fontSize: '18px' }}>📍</span>
          <div>
            <LocationText>
              {locLoading ? '위치 확인 중...' : appLocation ? appLocation.display : '위치 미등록'}
            </LocationText>
            <SubText>
              {locLoading ? 'GPS 연결 중' : appLocation ? '현재 위치 · 실시간' : 'GPS 정보를 활성화해주세요'}
            </SubText>
          </div>
        </HeaderLeft>
        <HeaderRight>
          <RefreshBtn onClick={handleRefresh} title="위치 새로고침">
            🔄
          </RefreshBtn>
          <NotifBtn onClick={handleNotifClick} title="알림">
            🔔
          </NotifBtn>
        </HeaderRight>
      </Header>
      <ScreenContent>
        <DustMainCard pm10={dust.pm10} level={dust.level} />
        <PmGrid pm10={dust.pm10} pm25={dust.pm25} />
        <WeatherBar />
        <DiarySummary diary={todayDiary} onWriteClick={() => navigate('diary')} />
        <AlarmSection
          location={appLocation}
          alarms={alarms}
          isMock={isMock}
          loading={alarmLoading}
        />
        <GroupMiniView onGroupClick={() => navigate('group')} />
      </ScreenContent>
    </>
  );
}

export default HomePage;
