import { useState, useCallback } from 'react';
import type { DiaryEntry } from '../types';
import { MOCK_DIARY } from '../constants';

export function useDiaryStorage() {
  const [diaries, setDiaries] = useState<Record<string, DiaryEntry>>(() => {
    try {
      const stored = localStorage.getItem('dm_diaries');
      if (stored) {
        return JSON.parse(stored);
      }
      // Populate with mock diary data on first run
      const initial: Record<string, DiaryEntry> = {};
      MOCK_DIARY.forEach((entry) => {
        initial[entry.date] = entry;
      });
      localStorage.setItem('dm_diaries', JSON.stringify(initial));
      return initial;
    } catch {
      return {};
    }
  });

  const getDiary = useCallback((date: string): DiaryEntry | null => {
    return diaries[date] || null;
  }, [diaries]);

  const saveDiary = useCallback((entry: DiaryEntry) => {
    const updated = { ...diaries, [entry.date]: entry };
    setDiaries(updated);
    localStorage.setItem('dm_diaries', JSON.stringify(updated));
  }, [diaries]);

  const reloadDiaries = useCallback(() => {
    try {
      const stored = localStorage.getItem('dm_diaries');
      if (stored) {
        setDiaries(JSON.parse(stored));
      }
    } catch {
      setDiaries({});
    }
  }, []);

  return {
    diaries,
    getDiary,
    saveDiary,
    reloadDiaries,
  };
}

