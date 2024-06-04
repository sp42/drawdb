import React from 'react';
import i18n from "../../../i18n/i18n";
import Open from "./Open";
import New from "./New";
import ImportDiagram from "./ImportDiagram";
import ImportSource from "./ImportSource";
import Language from "./Language";
import CodeMirror from "@uiw/react-codemirror";
import { Spin, Input, Image, Toast, Modal as SemiUIModal, InputNumber } from "@douyinfe/semi-ui";
import { MODAL, STATUS } from "../../../data/constants";
import { useState } from "react";
import { db } from "../../../data/db";
import { useAreas, useNotes, useSettings, useTables, useTransform, useTypes, useUndoRedo, } from "../../../context/hooks";
import { saveAs } from "file-saver";
import { Parser } from "node-sql-parser";
import { astToDiagram } from "../../../utils/astToDiagram";
import { sql } from "@codemirror/lang-sql";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { json } from "@codemirror/lang-json";
import { githubLight } from "@uiw/codemirror-theme-github";
import { useTranslation } from "react-i18next";
import { ErrorType, ImportSourceType } from './type';

const languageExtension = {
  sql: [sql()],
  json: [json()],
};

function getModalTitle(modal: number): string {
  switch (modal) {
    case MODAL.IMPORT:
    case MODAL.IMPORT_SRC:
      return i18n.t("import_diagram");
    case MODAL.CODE:
      return i18n.t("export_source");
    case MODAL.IMG:
      return i18n.t("export_image");
    case MODAL.RENAME:
      return i18n.t("rename_diagram");
    case MODAL.OPEN:
      return i18n.t("open_diagram");
    case MODAL.SAVEAS:
      return i18n.t("save_as");
    case MODAL.NEW:
      return i18n.t("create_new_diagram");
    case MODAL.TABLE_WIDTH:
      return i18n.t("table_width");
    case MODAL.LANGUAGE:
      return i18n.t("language");
    default:
      return "";
  }
};

function getOkText(modal: number): string {
  switch (modal) {
    case MODAL.IMPORT:
    case MODAL.IMPORT_SRC:
      return i18n.t("import");
    case MODAL.CODE:
    case MODAL.IMG:
      return i18n.t("export");
    case MODAL.RENAME:
      return i18n.t("rename");
    case MODAL.OPEN:
      return i18n.t("open");
    case MODAL.SAVEAS:
      return i18n.t("save_as");
    case MODAL.NEW:
      return i18n.t("create");
    default:
      return i18n.t("confirm");
  }
};


export default function Modal({ modal, setModal, title, setTitle, prevTitle, setPrevTitle, setDiagramId, exportData, setExportData }) {
  const { t } = useTranslation();
  const { setTables, setRelationships } = useTables();
  const { setNotes } = useNotes();
  const { setAreas } = useAreas();
  const { setTypes } = useTypes();
  const { settings, setSettings } = useSettings();
  const { setTransform } = useTransform();
  const { setUndoStack, setRedoStack } = useUndoRedo();
  const [importSource, setImportSource] = useState<ImportSourceType>({ src: "", overwrite: true, dbms: "MySQL" });
  const [importData, setImportData] = useState(null);
  const [error, setError] = useState<ErrorType>({ type: STATUS.NONE, message: "" });
  const [selectedTemplateId, setSelectedTemplateId] = useState(-1);
  const [selectedDiagramId, setSelectedDiagramId] = useState(0);
  const [saveAsTitle, setSaveAsTitle] = useState(title);

  const overwriteDiagram = () => {
    setTables(importData.tables);
    setRelationships(importData.relationships);
    setAreas(importData.subjectAreas);
    setNotes(importData.notes);

    if (importData.title)
      setTitle(importData.title);
  };

  const loadDiagram = async (id) => {
    await db.diagrams.get(id).then((diagram) => {
      if (diagram) {
        setDiagramId(diagram.id);
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
        Toast.error("Oops! Something went wrong.");
    })
      .catch(() => Toast.error("Oops! Couldn't load diagram."));
  };

  const parseSQLAndLoadDiagram = () => {
    const parser = new Parser();
    let ast = null;

    try {
      ast = parser.astify(importSource.src, { database: "MySQL" });
    } catch (err) {
      // @ts-ignore
      setError({ type: STATUS.ERROR, message: err.name + " [Ln " + err.location.start.line + ", Col " + err.location.start.column + "]: " + err.message });

      return;
    }

    const d = astToDiagram(ast);

    if (importSource.overwrite) {
      setTables(d.tables);
      setRelationships(d.relationships);
      setTransform((prev) => ({ ...prev, pan: { x: 0, y: 0 } }));
      setNotes([]);
      setAreas([]);
      setTypes([]);
      setUndoStack([]);
      setRedoStack([]);
    } else {
      setTables((prev) => [...prev, ...d.tables]);
      setRelationships((prev) => [...prev, ...d.relationships]);
    }
    setModal(MODAL.NONE);
  };

  const createNewDiagram = (id) => {
    const newWindow: Window | null = window.open("/editor");

    if (newWindow)
      newWindow.name = "lt " + id;
  };

  const getModalOnOk = async () => {
    switch (modal) {
      case MODAL.IMG:
        saveAs(exportData.data, `${exportData.filename}.${exportData.extension}`);
        return;
      case MODAL.CODE: {
        const blob = new Blob([exportData.data], { type: "application/json" });
        saveAs(blob, `${exportData.filename}.${exportData.extension}`);

        return;
      }
      case MODAL.IMPORT:
        if (error.type !== STATUS.ERROR) {
          setTransform((prev) => ({ ...prev, pan: { x: 0, y: 0 } }));
          overwriteDiagram();
          setImportData(null);
          setModal(MODAL.NONE);
          setUndoStack([]);
          setRedoStack([]);
        }
        return;
      case MODAL.IMPORT_SRC:
        parseSQLAndLoadDiagram();
        return;
      case MODAL.OPEN:
        if (selectedDiagramId === 0) return;
        loadDiagram(selectedDiagramId);
        setModal(MODAL.NONE);
        return;
      case MODAL.RENAME:
        setPrevTitle(title);
        setModal(MODAL.NONE);
        return;
      case MODAL.SAVEAS:
        setTitle(saveAsTitle);
        setModal(MODAL.NONE);
        return;
      case MODAL.NEW:
        setModal(MODAL.NONE);
        createNewDiagram(selectedTemplateId);
        return;
      default:
        setModal(MODAL.NONE);
        return;
    }
  };

  const getModalBody = () => {
    switch (modal) {
      case MODAL.IMPORT:
        return <ImportDiagram setImportData={setImportData} error={error} setError={setError} />;
      case MODAL.IMPORT_SRC:
        return <ImportSource importData={importSource} setImportData={setImportSource} error={error} setError={setError} />;
      case MODAL.NEW:
        return <New selectedTemplateId={selectedTemplateId} setSelectedTemplateId={setSelectedTemplateId} />;
      case MODAL.RENAME:
        return <Input placeholder={t("name")} value={title} onChange={(v) => setTitle(v)} />
      // return <Rename title={title} setTitle={setTitle} />;
      case MODAL.OPEN:
        return <Open selectedDiagramId={selectedDiagramId} setSelectedDiagramId={setSelectedDiagramId} />;
      case MODAL.SAVEAS:
        return <Input placeholder={t("name")} value={saveAsTitle} onChange={(v) => setSaveAsTitle(v)} />;
      case MODAL.CODE:
      case MODAL.IMG:
        if (exportData.data !== "" || exportData.data)
          return (
            <>
              {modal === MODAL.IMG ? (
                <Image src={exportData.data} alt="Diagram" height={280} />
              ) : (
                <CodeMirror value={exportData.data} height="360px" extensions={languageExtension[exportData.extension]} onChange={() => { }} editable={false} theme={settings.mode === "dark" ? vscodeDark : githubLight} />
              )}
              <div className="text-sm font-semibold mt-2">{t("filename")}:</div>
              <Input value={exportData.filename} placeholder={t("filename")} suffix={<div className="p-2">{`.${exportData.extension}`}</div>}
                onChange={(value) => setExportData((prev) => ({ ...prev, filename: value }))} field="filename"
              />
            </>
          );
        else
          return (
            <div className="text-center my-3">
              <Spin tip={t("loading")} size="large" />
            </div>
          );

      case MODAL.TABLE_WIDTH:
        return <InputNumber className="w-full" value={settings.tableWidth} onChange={(c) => {
          let n: number = parseInt(c);
          if (n < 180) return;
          setSettings((prev) => ({ ...prev, tableWidth: n }));
        }} />
      case MODAL.LANGUAGE:
        return <Language />;
      default:
        return <></>;
    }
  };

  return (
    <SemiUIModal title={getModalTitle(modal)} visible={modal !== MODAL.NONE} onOk={getModalOnOk}
      afterClose={() => {
        setExportData(() => ({ data: "", extension: "", filename: `${title}_${new Date().toISOString()}` }));
        setError({ type: STATUS.NONE, message: "" });
        setImportData(null);
        setImportSource({ src: "", overwrite: true, dbms: "MySQL" });
      }}
      onCancel={() => {
        if (modal === MODAL.RENAME) setTitle(prevTitle);
        setModal(MODAL.NONE);
      }}
      centered closeOnEsc={true} okText={getOkText(modal)} okButtonProps={{
        disabled:
          (error && error?.type === STATUS.ERROR) ||
          (modal === MODAL.IMPORT && (error.type === STATUS.ERROR || !importData)) ||
          (modal === MODAL.RENAME && title === "") ||
          ((modal === MODAL.IMG || modal === MODAL.CODE) && !exportData.data) ||
          (modal === MODAL.SAVEAS && saveAsTitle === "") ||
          (modal === MODAL.IMPORT_SRC && importSource.src === ""),
      }}
      cancelText={t("cancel")} width={modal === MODAL.NEW ? 740 : 600} bodyStyle={{ maxHeight: window.innerHeight - 280, overflow: "auto" }}>
      {getModalBody()}
    </SemiUIModal>
  );
}
