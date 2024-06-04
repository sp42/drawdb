import React from 'react';
import { ddbDiagramIsValid, jsonDiagramIsValid } from "../../../utils/validateSchema";
import { Upload, Banner } from "@douyinfe/semi-ui";
import { STATUS } from "../../../data/constants";
import { useAreas, useNotes, useTables } from "../../../hooks";
import { useTranslation } from "react-i18next";
import { ErrorType, ImportDataType } from './type';

export default function ImportDiagram({ setImportData, error, setError }: { setImportData: React.Dispatch<React.SetStateAction<ImportSourceType>>, error: ErrorType, setError: (v: ErrorType) => void }) {
  const { areas } = useAreas();
  const { notes } = useNotes();
  const { tables, relationships } = useTables();
  const { t } = useTranslation();
  const diagramIsEmpty = () => tables.length === 0 && relationships.length === 0 && notes.length === 0 && areas.length === 0;

  return (
    <div>
      <Upload action="#" beforeUpload={({ file, fileList }) => {
        const f = fileList[0].fileInstance;
        if (!f)
          return;

        const reader = new FileReader();
        reader.onload = async (e) => {
          let jsonObject = null;

          try {
            // @ts-ignore
            jsonObject = JSON.parse(e.target.result);
          } catch (error) {
            setError({ type: STATUS.ERROR, message: "The file contains an error." });
            return;
          }

          if (f.type === "application/json") {
            if (!jsonDiagramIsValid(jsonObject)) {
              setError({ type: STATUS.ERROR, message: "The file is missing necessary properties for a diagram." });
              return;
            }
          } else if (f.name.split(".").pop() === "ddb") {
            if (!ddbDiagramIsValid(jsonObject)) {
              setError({ type: STATUS.ERROR, message: "The file is missing necessary properties for a diagram." });
              return;
            }
          }
          setImportData(jsonObject);

          if (diagramIsEmpty())
            setError({ type: STATUS.OK, message: "Everything looks good. You can now import." });
          else
            setError({ type: STATUS.WARNING, message: "The current diagram is not empty. Importing a new diagram will overwrite the current changes." });
        };

        reader.readAsText(f);

        return { autoRemove: false, fileInstance: file.fileInstance, status: "success", shouldUpload: false };
      }}
        draggable={true} dragMainText={t("drag_and_drop_files")} dragSubText={t("support_json_and_ddb")} accept="application/json,.ddb"
        onRemove={() => setError({ type: STATUS.NONE, message: "" })} onFileChange={() => setError({ type: STATUS.NONE, message: "" })}
        limit={1}
      />
      {error.type === STATUS.ERROR ? (
        <Banner type="danger" fullMode={false} description={<div>{error.message}</div>} />
      ) : error.type === STATUS.OK ? (
        <Banner type="info" fullMode={false} description={<div>{error.message}</div>} />
      ) : (error.type === STATUS.WARNING && (<Banner type="warning" fullMode={false} description={<div>{error.message}</div>} />)
      )}
    </div>
  );
}
