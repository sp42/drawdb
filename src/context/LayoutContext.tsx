import React from 'react';
import { createContext, useState } from "react";

/**
 * 布局
 */
type LayoutContext = {
  header: boolean,
  sidebar: boolean,
  issues: boolean,
  toolbar: boolean,
  fullscreen: boolean
};

type LayoutContextType = {
  layout: LayoutContext
  setLayout: React.Dispatch<React.SetStateAction<LayoutContext>>
}

const defaultValue: LayoutContext = {
  header: true,
  sidebar: true,
  issues: true,
  toolbar: true,
  fullscreen: false
};

export const LayoutContext: React.Context<LayoutContextType> = createContext({ layout: defaultValue, setLayout: v => { } });

export default function LayoutContextProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [layout, setLayout] = useState<LayoutContext>(defaultValue);

  return <LayoutContext.Provider value={{ layout, setLayout }}>
    {children}
  </LayoutContext.Provider>;
}
