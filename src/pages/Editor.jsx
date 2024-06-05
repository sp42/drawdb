import LayoutContextProvider from "../context/LayoutContext";
import TransformContextProvider from "../context/TransformContext";
import TablesContextProvider from "../context/TablesContext";
import UndoRedoContextProvider from "../context/UndoRedoContext";
import SelectContextProvider from "../context/SelectContext";
import AreasContextProvider from "../context/AreasContext";
import NotesContextProvider from "../context/NotesContext";
import TypesContextProvider from "../context/TypesContext";
import SaveStateContextProvider from "../context/SaveStateContext";
import WorkSpace from "../components/Workspace";

export default function Editor() {
  return <LayoutContextProvider>
    <TransformContextProvider>
      <UndoRedoContextProvider>
        <SelectContextProvider>
          <AreasContextProvider>
            <NotesContextProvider>
              <TypesContextProvider>
                <TablesContextProvider>
                  <SaveStateContextProvider>
                    <WorkSpace />
                  </SaveStateContextProvider>
                </TablesContextProvider>
              </TypesContextProvider>
            </NotesContextProvider>
          </AreasContextProvider>
        </SelectContextProvider>
      </UndoRedoContextProvider>
    </TransformContextProvider>
  </LayoutContextProvider>;
}
