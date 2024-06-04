import React from 'react';
import { createContext, useState } from "react";
import { Action, ObjectType, defaultBlue } from "../data/constants";
import { useSelect, useUndoRedo, useTransform } from "../context/hooks";
import { Toast } from "@douyinfe/semi-ui";
import { useTranslation } from "react-i18next";

type TablesContext = {
  id: number,
  name: string,
  x: number,
  y: number,
  fields: [
    {
      name: "id",
      type: "INT",
      default: "",
      check: "",
      primary: true,
      unique: true,
      notNull: true,
      increment: true,
      comment: "",
      id: 0,
    },
  ],
  comment: string,
  indices: [],
  color: string,
  key: any
};

type TablesContextType = {
  tables: TablesContext[]
  setTables: React.Dispatch<React.SetStateAction<TablesContext[]>>
  addTable: (data: any, addToHistory: boolean) => void,
  updateTable: (id: number, updatedValues: []) => void,
  updateField: (tid: number, fid: number, updatedValues: []) => void,
  deleteField: (field: any, tid: boolean, addToHistory: boolean) => void,
  deleteTable: (id: number, addToHistory: boolean) => void,
  relationships: []
  setRelationships: React.Dispatch<React.SetStateAction<[]>>
  addRelationship: (data: any, addToHistory: boolean) => void
  deleteRelationship: (id: number, addToHistory: boolean) => void
}

const _tables: TablesContext[] = [];

export const TablesContext: React.Context<TablesContextType> = createContext({
  tables: _tables,
  setTables(v) { },
  addTable: (data: any, addToHistory: boolean) => { },
  updateTable: (id: number, updatedValues: []) => { },
  updateField: (tid: number, fid: number, updatedValues: []) => { },
  deleteField: (field: any, tid: boolean, addToHistory: boolean) => { },
  deleteTable: (id: number, addToHistory: boolean) => { },
  relationships: [],
  setRelationships: (v: any) => { },
  addRelationship: (data: any, addToHistory: boolean) => { },
  deleteRelationship: (id: number, addToHistory: boolean) => { }
});

export default function TablesContextProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const { t } = useTranslation();
  const { transform } = useTransform();
  const [tables, setTables] = useState<TablesContext[]>([]);
  const [relationships, setRelationships] = useState<[]>([]);
  const { setUndoStack, setRedoStack } = useUndoRedo();
  const { selectedElement, setSelectedElement } = useSelect();

  const addTable = (data: any, addToHistory = true) => {
    if (data) {
      setTables((prev) => {
        const temp = prev.slice();
        temp.splice(data.id, 0, data);

        return temp.map((t, i) => ({ ...t, id: i }));
      });
    } else {
      setTables((prev) => [
        ...prev,
        {
          id: prev.length,
          name: `table_${prev.length}`,
          x: -transform.pan.x,
          y: -transform.pan.y,
          fields: [
            {
              name: "id",
              type: "INT",
              default: "",
              check: "",
              primary: true,
              unique: true,
              notNull: true,
              increment: true,
              comment: "",
              id: 0,
            },
          ],
          comment: "",
          indices: [], color: defaultBlue, key: Date.now()
        },
      ]);
    }
    if (addToHistory) {
      setUndoStack((prev) => [
        ...prev,
        { action: Action.ADD, element: ObjectType.TABLE, message: t("add_table") },
      ]);
      setRedoStack([]);
    }
  };

  const deleteTable = (id: number, addToHistory = true) => {
    if (addToHistory) {
      Toast.success(t("table_deleted"));
      const rels = relationships.reduce((acc, r) => {
        if (r.startTableId === id || r.endTableId === id)
          acc.push(r);

        return acc;
      }, []);
      setUndoStack((prev) => [...prev, { action: Action.DELETE, element: ObjectType.TABLE, data: { table: tables[id], relationship: rels }, message: t("delete_table", { tableName: tables[id] }) }]);
      setRedoStack([]);
    }
    setRelationships((prevR) => {
      return prevR.filter((e) => !(e.startTableId === id || e.endTableId === id)).map((e, i) => {
        const newR = { ...e };

        if (e.startTableId > id)
          newR.startTableId = e.startTableId - 1;

        if (e.endTableId > id)
          newR.endTableId = e.endTableId - 1;

        return { ...newR, id: i };
      });
    });

    setTables((prev) => prev.filter((e) => e.id !== id).map((e, i) => ({ ...e, id: i })));
    if (id === selectedElement.id) {
      setSelectedElement((prev) => ({ ...prev, element: ObjectType.NONE, id: -1, open: false }));
    }
  };

  const updateTable = (id: number, updatedValues: []): void => setTables((prev) => prev.map((t) => (t.id === id ? { ...t, ...updatedValues } : t)));

  const updateField = (tid: number, fid: number, updatedValues: []) => {
    setTables((prev) =>
      prev.map((table, i) => {
        if (tid === i)
          return { ...table, fields: table.fields.map((field, j) => fid === j ? { ...field, ...updatedValues } : field) };

        return table;
      }),
    );
  };

  const deleteField = (field: any, tid: boolean, addToHistory: boolean = true) => {
    if (addToHistory) {
      const rels = relationships.reduce((acc, r) => {
        if ((r.startTableId === tid && r.startFieldId === field.id) || (r.endTableId === tid && r.endFieldId === field.id))
          acc.push(r);

        return acc;
      }, []);
      setUndoStack((prev) => [
        ...prev,
        {
          action: Action.EDIT, element: ObjectType.TABLE, component: "field_delete", tid: tid, data: { field: field, relationship: rels }, message: t("edit_table", { tableName: tables[tid].name, extra: "[delete field]" })
        }
      ]);
      setRedoStack([]);
    }
    setRelationships((prev) => {
      const temp = prev
        .filter((e) => !((e.startTableId === tid && e.startFieldId === field.id) || (e.endTableId === tid && e.endFieldId === field.id)))
        .map((e, i) => {
          if (e.startTableId === tid && e.startFieldId > field.id)
            return { ...e, startFieldId: e.startFieldId - 1, id: i };

          if (e.endTableId === tid && e.endFieldId > field.id)
            return { ...e, endFieldId: e.endFieldId - 1, id: i };

          return { ...e, id: i };
        });
      return temp;
    });
    updateTable(tid, { fields: tables[tid].fields.filter((e) => e.id !== field.id).map((t, i) => { return { ...t, id: i }; }) });
  };

  const addRelationship = (data: any, addToHistory: boolean = true) => {
    if (addToHistory) {
      setRelationships((prev) => {
        setUndoStack((prevUndo) => [
          ...prevUndo,
          { action: Action.ADD, element: ObjectType.RELATIONSHIP, data: data, message: t("add_relationship") },
        ]);
        setRedoStack([]);
        return [...prev, data];
      });
    } else {
      setRelationships((prev) => {
        const temp = prev.slice();
        temp.splice(data.id, 0, data);

        return temp.map((t, i) => ({ ...t, id: i }));
      });
    }
  };

  const deleteRelationship = (id: number, addToHistory: boolean = true) => {
    if (addToHistory) {
      setUndoStack((prev) => [
        ...prev,
        {
          action: Action.DELETE, element: ObjectType.RELATIONSHIP, data: relationships[id], message: t("delete_relationship", { refName: relationships[id].name })
        }
      ]);
      setRedoStack([]);
    }
    setRelationships((prev) => prev.filter((e) => e.id !== id).map((e, i) => ({ ...e, id: i })));
  };

  return <TablesContext.Provider value={{
    tables,
    setTables,
    addTable,
    updateTable,
    updateField,
    deleteField,
    deleteTable,
    relationships,
    setRelationships,
    addRelationship,
    deleteRelationship,
  }}>
    {children}
  </TablesContext.Provider>;
}
