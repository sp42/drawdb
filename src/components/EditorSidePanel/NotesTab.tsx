import React from 'react';
import { Button, Collapse, AutoComplete } from "@douyinfe/semi-ui";
import { IconPlus } from "@douyinfe/semi-icons";
import { useNotes, useSelect } from "../../context/hooks";
import Empty from "./Empty";
import NoteInfo from "./NoteInfo";
import { useTranslation } from "react-i18next";
import { IconSearch } from "@douyinfe/semi-icons";

export default function NotesTab() {
  const { notes, addNote } = useNotes();
  const { selectedElement, setSelectedElement } = useSelect();
  const { t } = useTranslation();

  const [searchText, setSearchText] = React.useState<string>("");
  const [filteredResult, setFilteredResult] = React.useState(notes.map((t) => t.title));

  const handleStringSearch = (value) => { setFilteredResult(notes.map((t) => t.title).filter((i) => i.includes(value))); };

  return (
    <>
      <div className="flex gap-2">
        <AutoComplete className="w-full" data={filteredResult} value={searchText} showClear prefix={<IconSearch />} placeholder={t("search")} emptyContent={<div className="p-3 popover-theme">{t("not_found")}</div>}
          onSearch={(v) => handleStringSearch(v)} onChange={(v) => setSearchText(v)}
          onSelect={(v) => {
            const { id } = notes.find((t) => t.title === v);
            setSelectedElement((prev) => ({ ...prev, id: parseInt(id) }));
            document.getElementById(`scroll_note_${id}`)?.scrollIntoView({ behavior: "smooth" });
          }} />
        <div>
          <Button icon={<IconPlus />} block onClick={() => addNote()}>
            {t("add_note")}
          </Button>
        </div>
      </div>
      {notes.length <= 0 ? (
        <Empty title={t("no_notes")} text={t("no_notes_text")} />
      ) : (
        <Collapse keepDOM accordion lazyRender activeKey={selectedElement.open ? `${selectedElement.id}` : ""}
          onChange={(activeKey) => { setSelectedElement((prev) => ({ ...prev, id: parseInt(activeKey), open: true })); }}>
          {notes.map((n, i) => (
            <NoteInfo data={n} key={i} nid={i} />
          ))}
        </Collapse>
      )}
    </>
  );
}
