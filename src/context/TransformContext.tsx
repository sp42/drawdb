import React from 'react';
import { createContext, useState } from "react";

export const TransformContext: React.Context<any> = createContext(null);

export default function TransformContextProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [transform, setTransform] = useState({ zoom: 1, pan: { x: 0, y: 0 } });

  return (
    <TransformContext.Provider value={{ transform, setTransform }}>
      {children}
    </TransformContext.Provider>
  );
}
