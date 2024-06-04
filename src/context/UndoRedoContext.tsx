import React from 'react';
import { createContext, useState } from "react";
import { Action, ObjectType } from "../data/constants";

type UndoRedoContext = {
  id?: number

  /**
   * 动作类型
   */
  action: Action

  element: ObjectType

  /** 
   * 消息 
   */
  message: string

  data?: any
};

type UndoRedoContextType = {
  undoStack: UndoRedoContext[],
  redoStack: [],
  setUndoStack: React.Dispatch<React.SetStateAction<UndoRedoContext[]>>,
  setRedoStack: React.Dispatch<React.SetStateAction<[]>>
};


const _undoStack: UndoRedoContext[] = [];
export const UndoRedoContext: React.Context<UndoRedoContextType> = createContext({ undoStack: _undoStack, redoStack: [], setUndoStack: v => { }, setRedoStack: v => { } });

export default function UndoRedoContextProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [undoStack, setUndoStack] = useState<UndoRedoContext[]>([]);
  const [redoStack, setRedoStack] = useState<[]>([]);

  return <UndoRedoContext.Provider value={{ undoStack, redoStack, setUndoStack, setRedoStack }}>
    {children}
  </UndoRedoContext.Provider>;
}
