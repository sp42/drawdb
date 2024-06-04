import React from 'react';
import { createContext, useState } from "react";
import { Action, ObjectType } from "../data/constants";
import { useUndoRedo } from "../context/hooks";
import { Toast } from "@douyinfe/semi-ui";
import { useTranslation } from "react-i18next";

type TypesContext = {
  name: string
  fields: []
  comment: string
};

type TypesContextType = {
  types: TypesContext[],
  setTypes: React.Dispatch<React.SetStateAction<TypesContext[]>>,
  addType: (data: any, addToHistory: boolean) => void,
  updateType: (id: number, values: []) => void,
  deleteType: (id: number, addToHistory: boolean) => void
};

const _types: TypesContext[] = [];

export const TypesContext: React.Context<TypesContextType> = createContext({
  types: _types,
  setTypes: v => { },
  addType: (data: any, addToHistory: boolean) => { },
  updateType: (id: number, values: []) => { },
  deleteType: (id: number, addToHistory: boolean) => { }
});

export default function TypesContextProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const { t } = useTranslation();
  const [types, setTypes] = React.useState<TypesContext[]>([]);
  const { setUndoStack, setRedoStack } = useUndoRedo();

  const addType = (data: any, addToHistory: boolean = true) => {
    if (data)
      setTypes((prev) => {
        const temp = prev.slice();
        temp.splice(data.id, 0, data);

        return temp;
      });
    else
      setTypes((prev) => [...prev, { name: `type_${prev.length}`, fields: [], comment: "" }]);

    if (addToHistory) {
      setUndoStack((prev) => [...prev, { action: Action.ADD, element: ObjectType.TYPE, message: t("add_type") }]);
      setRedoStack([]);
    }
  };

  const deleteType = (id: number, addToHistory: boolean = true) => {
    if (addToHistory) {
      Toast.success(t("type_deleted"));
      setUndoStack((prev) => [
        ...prev,
        {
          action: Action.DELETE,
          element: ObjectType.TYPE,
          id: id,
          data: types[id],
          message: t("delete_type", { typeName: types[id].name }),
        },
      ]);

      setRedoStack([]);

    }
    setTypes((prev) => prev.filter((e, i) => i !== id));
  };

  const updateType = (id: number, values: []) => { setTypes((prev) => prev.map((e, i) => (i === id ? { ...e, ...values } : e))); };

  return <TypesContext.Provider value={{ types, setTypes, addType, updateType, deleteType }}>
    {children}
  </TypesContext.Provider>;
}
