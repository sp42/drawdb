import React from 'react';
import { createContext, useState } from "react";
import { tableWidth } from "../data/constants";

type Setting = {
  strictMode: boolean,
  showFieldSummary: boolean,
  showGrid: boolean,
  /**
   * The theme mode: 'dark' | 'light'
   */
  mode: string,
  autosave: boolean,
  panning: boolean,
  showCardinality: boolean,
  tableWidth: number
};

type SettingAll = {
  settings: Setting
  setSettings: React.Dispatch<React.SetStateAction<Setting>>
};

const defaultValue: Setting = {
  strictMode: false,
  showFieldSummary: true,
  showGrid: true,
  mode: "light",
  autosave: true,
  panning: true,
  showCardinality: true,
  tableWidth: tableWidth
};

export const SettingsContext: React.Context<SettingAll> = createContext({ settings: defaultValue, setSettings: v => { } });

export default function SettingsContextProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [settings, setSettings] = useState<Setting>(defaultValue);

  return <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>;
}
