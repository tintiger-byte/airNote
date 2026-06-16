import { useState, useCallback } from 'react';
import type { LocationData } from '../types';
import { reverseGeocode } from '../services/geocodeService';

export function useLocation() {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLocation = useCallback(async (force = false) => {
    setLoading(true);
    setError(null);

    // Caching for 5 minutes
    if (!force && location && location.cachedAt && Date.now() - location.cachedAt < 300000) {
      setLoading(false);
      return location;
    }

    if (!navigator.geolocation) {
      setError('브라우저 미지원');
      setLoading(false);
      return null;
    }

    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 6000, // Reduced timeout for faster fallback
          maximumAge: 300000,
          enableHighAccuracy: false,
        });
      });

      const { latitude: lat, longitude: lng } = pos.coords;
      const locData = await reverseGeocode(lat, lng);
      const updatedLoc = { ...locData, cachedAt: Date.now() };
      setLocation(updatedLoc);
      setLoading(false);
      return updatedLoc;
    } catch (err: any) {
      console.warn('[DustMate] HTML5 Geolocation 실패. IP 기반 위치 조회를 시도합니다...', err.message);
      try {
        const ipRes = await fetch('https://ipinfo.io/json');
        if (!ipRes.ok) throw new Error('IP API HTTP ' + ipRes.status);
        const ipData = await ipRes.json();
        
        if (ipData && ipData.loc) {
          const [latStr, lngStr] = ipData.loc.split(',');
          const lat = Number(latStr);
          const lng = Number(lngStr);
          const locData = await reverseGeocode(lat, lng);
          const updatedLoc = { ...locData, cachedAt: Date.now() };
          setError(null);
          setLocation(updatedLoc);
          setLoading(false);
          return updatedLoc;
        } else {
          throw new Error('IP Geolocation loc property is missing');
        }
      } catch (ipErr: any) {
        console.warn('[DustMate] IP 위치 조회 실패:', ipErr.message);
        setError('위치 확인 실패');
        setLocation(null);
        setLoading(false);
        return null;
      }
    }
  }, [location]);

  return {
    location,
    loading,
    error,
    fetchLocation,
    setLocation,
  };
}
