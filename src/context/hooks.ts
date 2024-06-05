import { useContext } from "react";
import { AreasContext } from "./AreasContext";
import { LayoutContext } from "./LayoutContext";
import { SaveStateContext } from "./SaveStateContext";
import { NotesContext } from "./NotesContext";
import { SelectContext } from "./SelectContext";
import { SettingsContext } from "./SettingsContext";
import { TransformContext } from "./TransformContext";
import { TypesContext } from "./TypesContext";
import { UndoRedoContext } from "./UndoRedoContext";
import { TablesContext } from "./TablesContext";

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

export function useTransform() {
    return useContext(TransformContext);
}

export function useTypes() {
    return useContext(TypesContext);
}

export function useUndoRedo() {
    return useContext(UndoRedoContext);
}

