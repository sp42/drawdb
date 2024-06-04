import React from 'react';
import { createContext, useState } from "react";
import { tableWidth } from "../data/constants";

export const SettingsContext: React.Context<any> = createContext(null);

export default function SettingsContextProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [settings, setSettings] = useState({
    strictMode: false,
    showFieldSummary: true,
    showGrid: true,
    mode: "light",
    autosave: true,
    panning: true,
    showCardinality: true,
    tableWidth: tableWidth
  });

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}
