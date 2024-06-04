import React from 'react';
import { createContext, useState } from "react";

export const LayoutContext: React.Context<any> = createContext(null);

export default function LayoutContextProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [layout, setLayout] = useState({
    header: true,
    sidebar: true,
    issues: true,
    toolbar: true,
    fullscreen: false
  });

  return (
    <LayoutContext.Provider value={{ layout, setLayout }}>
      {children}
    </LayoutContext.Provider>
  );
}
