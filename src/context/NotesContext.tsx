import React from 'react';
import { createContext, useState } from "react";
import { Action, ObjectType, defaultNoteTheme } from "../data/constants";
import { useSelect, useUndoRedo, useTransform } from "../context/hooks";
import { Toast } from "@douyinfe/semi-ui";
import { useTranslation } from "react-i18next";

type NotesContext = {
  id: number
  x: number
  y: number
  title: string
  content: string
  color: string
  height: number
};

type NotesContextType = {
  notes: NotesContext[]
  setNotes: React.Dispatch<React.SetStateAction<NotesContext[]>>
  updateNote: (id: number, values: []) => void
  addNote: (data: any, addToHistory: boolean) => void
  deleteNote: (id: number, addToHistory: boolean) => void
};
const _notes: NotesContext[] = [];
export const NotesContext: React.Context<NotesContextType> = createContext({
  notes: _notes,
  setNotes(v) { },
  updateNote(id, values) { },
  addNote(data, addToHistory) { },
  deleteNote(id, addToHistory) { }
});

export default function NotesContextProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const { t } = useTranslation();
  const [notes, setNotes] = useState<NotesContext[]>([]);
  const { transform } = useTransform();
  const { setUndoStack, setRedoStack } = useUndoRedo();
  const { selectedElement, setSelectedElement } = useSelect();

  const addNote = (data: any, addToHistory: boolean = true) => {
    if (data) {
      setNotes((prev) => {
        const temp = prev.slice();
        temp.splice(data.id, 0, data);

        return temp.map((t, i) => ({ ...t, id: i }));
      });
    } else
      setNotes((prev) => [...prev, { id: prev.length, x: -transform.pan.x, y: -transform.pan.y, title: `note_${prev.length}`, content: "", color: defaultNoteTheme, height: 88 }]);

    if (addToHistory) {
      setUndoStack((prev) => [...prev, { action: Action.ADD, element: ObjectType.NOTE, message: t("add_note") }]);
      setRedoStack([]);
    }
  };

  const deleteNote = (id: number, addToHistory: boolean = true) => {
    if (addToHistory) {
      Toast.success(t("note_deleted"));
      setUndoStack((prev) => [...prev, { action: Action.DELETE, element: ObjectType.NOTE, data: notes[id], message: t("delete_note", { noteTitle: notes[id].title }) }]);
      setRedoStack([]);
    }

    setNotes((prev) => prev.filter((e) => e.id !== id).map((e, i) => ({ ...e, id: i })));

    if (id === selectedElement.id)
      setSelectedElement((prev) => ({ ...prev, element: ObjectType.NONE, id: -1, open: false }));
  };

  const updateNote = (id: number, values: []) => {
    setNotes((prev) => prev.map((t) => {
      if (t.id === id)
        return { ...t, ...values };

      return t;
    }),
    );
  };

  return <NotesContext.Provider value={{ notes, setNotes, updateNote, addNote, deleteNote }} >
    {children}
  </NotesContext.Provider>;
}
