import React from 'react';
import { createContext, useState } from "react";
import { State } from "../data/constants";

export const SaveStateContext : React.Context<any> = createContext(null);

export default function SaveStateContextProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [saveState, setSaveState] = useState(State.NONE);

  return (
    <SaveStateContext.Provider value={{ saveState, setSaveState }}>
      {children}
    </SaveStateContext.Provider>
  );
}
