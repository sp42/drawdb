import React from 'react';
import { useState, useEffect, useCallback } from "react";
import ControlPanel from "./EditorHeader/ControlPanel";
import Canvas from "./EditorCanvas/Canvas";
import SidePanel from "./EditorSidePanel/SidePanel";
import { State } from "../data/constants";
import { db } from "../data/db";
import { useLayout, useSettings, useTransform, useTables, useUndoRedo, useAreas, useNotes, useTypes, useSaveState } from "../context/hooks";
import FloatingControls from "./FloatingControls";

/**
 * Main workspace
 * 
 * @returns 
 */
export default function WorkSpace() {
  const [id, setId] = useState<number>(0);
  const [title, setTitle] = useState<string>("Untitled Diagram");
  const [resize, setResize] = useState<boolean>(false);
  const [width, setWidth] = useState<number>(340);
  const [lastSaved, setLastSaved] = useState<string>("");
  const { layout } = useLayout();
  const { settings } = useSettings();
  const { types, setTypes } = useTypes();
  const { areas, setAreas } = useAreas();
  const { notes, setNotes } = useNotes();
  const { saveState, setSaveState } = useSaveState();
  const { transform, setTransform } = useTransform();
  const { tables, relationships, setTables, setRelationships } = useTables();
  const { undoStack, redoStack, setUndoStack, setRedoStack } = useUndoRedo();

  const handleResize = (e: any): void => {
    if (!resize) return;
    const w: number = e.clientX;
    if (w > 340) setWidth(w);
  };

  const save = useCallback(async () => {
    const name: string[] = window.name.split(" ");
    const op: string = name[0];
    const saveAsDiagram: boolean = window.name === "" || op === "d" || op === "lt";

    if (saveAsDiagram) {
      if ((id === 0 && window.name === "") || window.name.split(" ")[0] === "lt")
        await db.diagrams.add({ name: title, lastModified: new Date(), tables: tables, references: relationships, types: types, notes: notes, areas: areas, pan: transform.pan, zoom: transform.zoom }).then((id) => {
          setId(id);
          window.name = `d ${id}`;
          setSaveState(State.SAVED);
          setLastSaved(new Date().toLocaleString());
        });
      else
        await db.diagrams.update(id, { name: title, lastModified: new Date(), tables: tables, references: relationships, types: types, notes: notes, areas: areas, pan: transform.pan, zoom: transform.zoom })
          .then(() => {
            setSaveState(State.SAVED);
            setLastSaved(new Date().toLocaleString());
          });

    } else
      await db.templates.update(id, { title: title, tables: tables, relationships: relationships, types: types, notes: notes, subjectAreas: areas, pan: transform.pan, zoom: transform.zoom })
        .then(() => {
          setSaveState(State.SAVED);
          setLastSaved(new Date().toLocaleString());
        })
        .catch(() => setSaveState(State.ERROR));
  }, [tables, relationships, notes, areas, types, title, id, transform, setSaveState]);

  const load = useCallback(async () => {
    const loadLatestDiagram = async () => {
      await db.diagrams.orderBy("lastModified").last().then((d) => {
        if (d) {
          setId(d.id);
          setTitle(d.name);
          setTables(d.tables);
          setRelationships(d.references);
          setNotes(d.notes);
          setAreas(d.areas);
          setTypes(d.types);
          setTransform({ pan: d.pan, zoom: d.zoom });
          window.name = `d ${d.id}`;
        } else
          window.name = "";
      }).catch((error) => console.log(error));
    };

    const loadDiagram = async (id) => {
      await db.diagrams.get(id).then((diagram) => {
        if (diagram) {
          setId(diagram.id);
          setTitle(diagram.name);
          setTables(diagram.tables);
          setTypes(diagram.types);
          setRelationships(diagram.references);
          setAreas(diagram.areas);
          setNotes(diagram.notes);
          setTransform({ pan: diagram.pan, zoom: diagram.zoom });
          setUndoStack([]);
          setRedoStack([]);
          window.name = `d ${diagram.id}`;
        } else
          window.name = "";
      }).catch((error) => console.log(error));
    };

    const loadTemplate = async (id) => {
      await db.templates.get(id).then((diagram) => {
        if (diagram) {
          setId(diagram.id);
          setTitle(diagram.title);
          setTables(diagram.tables);
          setTypes(diagram.types);
          setRelationships(diagram.relationships);
          setAreas(diagram.subjectAreas);
          setNotes(diagram.notes);
          setTransform({ zoom: 1, pan: { x: 0, y: 0 } });
          setUndoStack([]);
          setRedoStack([]);
        }
      }).catch((error) => console.log(error));
    };

    if (window.name === "")
      loadLatestDiagram();
    else {
      const name: string[] = window.name.split(" ");
      const op: string = name[0];
      const id: number = parseInt(name[1]);

      switch (op) {
        case "d": {
          loadDiagram(id);
          break;
        }
        case "t":
        case "lt": {
          loadTemplate(id);
          break;
        }
        default:
          break;
      }
    }
  }, [setTransform, setRedoStack, setUndoStack, setRelationships, setTables, setAreas, setNotes, setTypes]);

  useEffect(() => {
    if (tables?.length === 0 && areas?.length === 0 && notes?.length === 0 && types?.length === 0)
      return;

    if (settings.autosave)
      setSaveState(State.SAVING);
  }, [undoStack, redoStack, settings.autosave, tables?.length, areas?.length, notes?.length, types?.length, relationships?.length, transform.zoom, title, setSaveState]);

  useEffect(() => {
    if (saveState !== State.SAVING) return;

    save();
  }, [id, saveState, save]);

  useEffect(() => {
    document.title = "Editor | drawDB";
    load();
  }, [load]);

  return <div className="h-[100vh] flex flex-col overflow-hidden theme">
    <ControlPanel diagramId={id} setDiagramId={setId} title={title} setTitle={setTitle} lastSaved={lastSaved} setLastSaved={setLastSaved} />

    <div className="flex h-full overflow-y-auto" onMouseUp={() => setResize(false)} onMouseLeave={() => setResize(false)} onMouseMove={handleResize}>
      {layout.sidebar && (<SidePanel resize={resize} setResize={setResize} width={width} />)}
      <div className="relative w-full h-full overflow-hidden">

        <Canvas saveState={saveState} setSaveState={setSaveState} />

        {!(layout.sidebar || layout.toolbar || layout.header) && (
          <div className="fixed right-5 bottom-4">
            <FloatingControls />
          </div>
        )}
      </div>
    </div>
  </div>;
}
