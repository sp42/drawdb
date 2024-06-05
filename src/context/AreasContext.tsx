import React from 'react';
import { createContext, useState } from "react";
import { Action, ObjectType, defaultBlue } from "../data/constants";
import { useSelect, useTransform, useUndoRedo } from "../context/hooks";
import { Toast } from "@douyinfe/semi-ui";
import { useTranslation } from "react-i18next";

type AreasContext = {
  id: number
  name: string
};

type AreasContextType = {
  areas: AreasContext[],
  setAreas: React.Dispatch<React.SetStateAction<AreasContext[]>>,
  updateArea: (id: number, values: []) => void,
  addArea: (id: number, addToHistory: boolean) => void,
  deleteArea: (id: number, addToHistory: boolean) => void
};

const _areas: AreasContext[] = [];
export const AreasContext: React.Context<AreasContextType> = createContext({
  areas: _areas,
  setAreas: v => { },
  updateArea: (id: number, values: []) => { },
  addArea: (data: any, addToHistory: boolean) => { },
  deleteArea: (id: number, addToHistory: boolean) => { }
});

export default function AreasContextProvider({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const { transform } = useTransform();
  const [areas, setAreas] = useState<AreasContext[]>([]);
  const { selectedElement, setSelectedElement } = useSelect();
  const { setUndoStack, setRedoStack } = useUndoRedo();

  const addArea = (data: any, addToHistory: boolean = true) => {
    if (data)
      setAreas((prev) => {
        const temp = prev.slice();
        temp.splice(data.id, 0, data);

        return temp.map((t, i) => ({ ...t, id: i }));
      });
    else
      setAreas((prev) => [
        ...prev,
        { id: prev.length, name: `area_${prev.length}`, x: -transform.pan.x, y: -transform.pan.y, width: 200, height: 200, color: defaultBlue }
      ]);

    if (addToHistory) {
      setUndoStack((prev) => [...prev, { action: Action.ADD, element: ObjectType.AREA, message: t("add_area") }]);
      setRedoStack([]);
    }
  };

  function deleteArea(id: number, addToHistory = true): void {
    if (addToHistory) {
      Toast.success(t("area_deleted"));
      setUndoStack((prev) => [...prev, { action: Action.DELETE, element: ObjectType.AREA, data: areas[id], message: t("delete_area", areas[id].name).toString() }]);
      setRedoStack([]);
    }

    setAreas((prev) => prev.filter((e) => e.id !== id).map((e, i) => ({ ...e, id: i })));

    if (id === selectedElement.id)
      setSelectedElement((prev) => ({ ...prev, element: ObjectType.NONE, id: -1, open: false }));
  };

  function updateArea(id: number, values: []): void {
    setAreas((prev) => prev.map((t) => {
      if (t.id === id)
        return { ...t, ...values };

      return t;
    }),
    );
  };

  return <AreasContext.Provider value={{ areas, setAreas, updateArea, addArea, deleteArea }}>
    {children}
  </AreasContext.Provider>;
}
