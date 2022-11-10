import { useCallback } from 'react';
import { atom, useRecoilValue, useSetRecoilState } from 'recoil';

const STORAGE_KEY = 'app.read';

const readKeysState = atom<ReadonlySet<string>>({
  key: 'readState',
  default: new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as readonly string[]),
  effects: [
    ({ onSet }) => {
      onSet(keys => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...keys]));
      });
    },
  ]
});

export const useIsUnread = () => {
  const readKeys = useRecoilValue(readKeysState);
  return (key: string) => !readKeys.has(key);
};

export const useMarkAsRead = () => {
  const setReadKeys = useSetRecoilState(readKeysState);
  return useCallback(
    (key: string) => setReadKeys(keys => new Set([...keys, key])),
    [setReadKeys]
  );
};

export const useMarkAsUnread = () => {
  const setReadKeys = useSetRecoilState(readKeysState);
  return useCallback(
    (key: string) => setReadKeys(keys => new Set([...keys].filter(k => k !== key))),
    [setReadKeys]
  );
};