import React from 'react';
import { createContext, useState } from "react";
import { ObjectType, Tab } from "../data/constants";

type SelectedElement = {
  element: ObjectType,

  id: number,

  openDialogue: boolean,

  openCollapse: boolean,

  currentTab: Tab,

  /**
   * open popover or sidesheet when sidebar is disabled
   */
  open: boolean,

  /**
   *  this is to handle triggering onClickOutside when sidebar is disabled
   */
  openFromToolbar: boolean
};

type SelectedElementType = {
  selectedElement: SelectedElement
  setSelectedElement: React.Dispatch<React.SetStateAction<SelectedElement>>
};

const defaultValue = {
  element: ObjectType.NONE,
  id: -1,
  openDialogue: false,
  openCollapse: false,
  currentTab: Tab.TABLES,
  open: false,
  openFromToolbar: false
};

export const SelectContext: React.Context<SelectedElementType> = createContext({ selectedElement: defaultValue, setSelectedElement: v => { } });

export default function SelectContextProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [selectedElement, setSelectedElement] = useState<SelectedElement>(defaultValue);

  return <SelectContext.Provider value={{ selectedElement, setSelectedElement }}>
    {children}
  </SelectContext.Provider>;
}
