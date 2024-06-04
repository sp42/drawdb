import { useContext } from "react";
import { AreasContext } from "../context/AreasContext";
import { LayoutContext } from "../context/LayoutContext";
import { SaveStateContext } from "../context/SaveStateContext";
import { NotesContext } from "../context/NotesContext";
import { SelectContext } from "../context/SelectContext";
import { SettingsContext } from "../context/SettingsContext";
import { TransformContext } from "../context/TransformContext";
import { TypesContext } from "../context/TypesContext";
import { UndoRedoContext } from "../context/UndoRedoContext";
import { TasksContext } from "../context/TasksContext";
import { TablesContext } from "../context/TablesContext";

export function useAreas() {
    return useContext(AreasContext);
}

export function useLayout() {
    return useContext(LayoutContext);
}

export function useNotes() {
    return useContext(NotesContext);
}

export function useSaveState() {
    return useContext(SaveStateContext);
}

export function useSelect() {
    return useContext(SelectContext);
}

export function useSettings() {
    return useContext(SettingsContext);
}

export function useTables() {
    return useContext(TablesContext);
}

export function useTasks() {
    return useContext(TasksContext);
}

export function useTransform() {
    return useContext(TransformContext);
}

export function useTypes() {
    return useContext(TypesContext);
}

export function useUndoRedo() {
    return useContext(UndoRedoContext);
}

