import React, { ReactNode, useContext, useEffect, useMemo, useReducer, useState } from "react";

const STORAGE_KEY = 'app.read';
const readKeysFromStorage = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as readonly string[];

type UpdateAction = {
  type: 'markAsRead';
  key: string;
};

type ReadContextValue = {
  readKeys: ReadonlySet<string>;
  dispatchUpdate: (action: UpdateAction) => void;
};

const ReadContext = React.createContext<ReadContextValue>(null!);

export const useIsUnread = () => {
  const { readKeys } = useContext(ReadContext);
  return (key: string) => !readKeys.has(key);
};

export const useMarkAsRead = () => {
  const { dispatchUpdate } = useContext(ReadContext);
  return (key: string) => dispatchUpdate({ type: 'markAsRead', key });
};

type ReadContextProviderProps = {
  children: ReactNode;
}

const keysReducer = (readKeys: ReadonlySet<string>, action: UpdateAction) => {
  return {
    markAsRead() {
      return new Set([...readKeys, action.key]);
    }
  }[action.type]();
};

export const ReadContextProvider: React.FC<ReadContextProviderProps> = ({ children }) => {
  const [readKeys, dispatchUpdate] = useReducer(keysReducer, new Set(readKeysFromStorage));
  const contextValue = useMemo(() => ({ readKeys, dispatchUpdate }), [readKeys, dispatchUpdate]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...readKeys]));
  }, [readKeys]);

  return <ReadContext.Provider value={contextValue}>
    {children}
  </ReadContext.Provider>
};