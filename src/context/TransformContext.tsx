import React from 'react';
import { createContext, useState } from "react";

/**
 * 缩放
 */
type TransformContext = {
  zoom: number
  pan: { x: number, y: number }
}

type TransformContextType = {
  transform: TransformContext
  setTransform: React.Dispatch<React.SetStateAction<TransformContext>>
};

const defaultValue: TransformContext = { zoom: 1, pan: { x: 0, y: 0 } };

export const TransformContext: React.Context<TransformContextType> = createContext({ transform: defaultValue, setTransform: v => { } });

export default function TransformContextProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [transform, setTransform] = useState<TransformContext>(defaultValue);

  return <TransformContext.Provider value={{ transform, setTransform }}>
    {children}
  </TransformContext.Provider>;
}
