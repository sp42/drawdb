import React from 'react';
import { createContext, useState } from "react";
import { State } from "../data/constants";

interface SaveStateContextType {
  saveState: number
  setSaveState: React.Dispatch<React.SetStateAction<number>>
}

export const SaveStateContext: React.Context<SaveStateContextType> = createContext({ saveState: State.NONE, setSaveState: v => { } });

export default function SaveStateContextProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [saveState, setSaveState] = useState<number>(State.NONE);

  return <SaveStateContext.Provider value={{ saveState, setSaveState }}>
    {children}
  </SaveStateContext.Provider>;
}
