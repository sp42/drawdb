import React from 'react';
import { createContext, useState } from "react";
import { Action, ObjectType, defaultBlue } from "../data/constants";
import { useSelect, useTransform, useUndoRedo } from "../hooks";
import { Toast } from "@douyinfe/semi-ui";
import { useTranslation } from "react-i18next";

type AreasContext = {

};
type AreasContextType = {
  areas: [],
  setAreas: React.Dispatch<React.SetStateAction<[]>>,
  updateArea: (id: number, values: []) => void,
  addArea: (id: number, addToHistory: boolean) => void,
  deleteArea: (id: number, addToHistory: boolean) => void
};

export const AreasContext: React.Context<AreasContextType> = createContext(null);

export default function AreasContextProvider({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const { transform } = useTransform();
  const [areas, setAreas] = useState<[]>([]);
  const { selectedElement, setSelectedElement } = useSelect();
  const { setUndoStack, setRedoStack } = useUndoRedo();

  const addArea = (data, addToHistory = true) => {
    if (data)
      setAreas((prev) => {
        const temp = prev.slice();
        temp.splice(data.id, 0, data);

        return temp.map((t, i) => ({ ...t, id: i }));
      });
    else
      setAreas((prev) => [
        ...prev,
        {
          id: prev.length, name: `area_${prev.length}`,
          x: -transform.pan.x, y: -transform.pan.y,
          width: 200, height: 200,
          color: defaultBlue,
        }
      ]);

    if (addToHistory) {
      setUndoStack((prev) => [...prev, { action: Action.ADD, element: ObjectType.AREA, message: t("add_area") }]);
      setRedoStack([]);
    }
  };

  function deleteArea(id: number, addToHistory = true): void {
    if (addToHistory) {
      Toast.success(t("area_deleted"));
      setUndoStack((prev) => [...prev, { action: Action.DELETE, element: ObjectType.AREA, data: areas[id], message: t("delete_area", areas[id].name) }]);
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
