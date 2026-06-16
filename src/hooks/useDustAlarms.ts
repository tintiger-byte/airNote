import { useState, useEffect, useCallback } from 'react';
import type { AlarmItem } from '../types';
import { fetchDustAlarms } from '../services/airkoreaApi';
import { MOCK_ALARMS } from '../constants';

export function useDustAlarms() {
  const [alarms, setAlarms] = useState<AlarmItem[] | null>(null);
  const [isMock, setIsMock] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadAlarms = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDustAlarms();
      if (data === null) {
        setAlarms(MOCK_ALARMS);
        setIsMock(true);
      } else {
        setAlarms(data);
        setIsMock(false);
      }
    } catch (err: any) {
      setError(err.message);
      setAlarms(MOCK_ALARMS);
      setIsMock(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAlarms();
  }, [loadAlarms]);

  return {
    alarms,
    isMock,
    loading,
    error,
    refetch: loadAlarms,
  };
}
