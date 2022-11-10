import { useCallback } from 'react';
import { atom, useRecoilValue, useSetRecoilState } from 'recoil';

const STORAGE_KEY = 'app.theme';

const themeState = atom<'light' | 'dark'>({
  key: 'themeState',
  default: (localStorage.getItem(STORAGE_KEY) as 'light' | 'dark' | undefined) ?? 'dark',
  effects: [
    ({ onSet }) => {
      onSet(value => {
        localStorage.setItem(STORAGE_KEY, value);
      });
    },
  ]
});

export const useTheme = () => useRecoilValue(themeState);
export const useToggleTheme = () => {
  const setTheme = useSetRecoilState(themeState);
  return useCallback(
    () => setTheme(t => t === 'dark' ? 'light' : 'dark'),
    [setTheme]
  );
};