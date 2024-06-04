import React from 'react';
import { createContext, useState } from "react";

export const UndoRedoContext: React.Context<any> = createContext(null);

export default function UndoRedoContextProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  return (
    <UndoRedoContext.Provider value={{ undoStack, redoStack, setUndoStack, setRedoStack }} >
      {children}
    </UndoRedoContext.Provider>
  );
}
