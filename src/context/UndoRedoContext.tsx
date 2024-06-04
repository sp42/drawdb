import React from 'react';
import { createContext, useState } from "react";

type UndoRedoContextType = {
  undoStack: [],
  redoStack: [],
  setUndoStack: (v: []) => void,
  setRedoStack: (v: []) => void
};

function emptyFn(v: []): void {
}

export const UndoRedoContext: React.Context<UndoRedoContextType> = createContext({ undoStack: [], redoStack: [], setUndoStack: emptyFn, setRedoStack: emptyFn });

export default function UndoRedoContextProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [undoStack, setUndoStack] = useState<[]>([]);
  const [redoStack, setRedoStack] = useState<[]>([]);

  return <UndoRedoContext.Provider value={{ undoStack, redoStack, setUndoStack, setRedoStack }}>
    {children}
  </UndoRedoContext.Provider>;
}
