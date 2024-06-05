import React from 'react';
import { Collapse, Button, AutoComplete } from "@douyinfe/semi-ui";
import { IconPlus, IconSearch } from "@douyinfe/semi-icons";
import { useSelect, useTables } from "../../../context/hooks";
import { ObjectType } from "../../../data/constants";
import Empty from "../Empty";
import TableInfo from "./TableInfo";
import { useTranslation } from "react-i18next";

export default function TablesTab() {
  const { tables, addTable } = useTables();
  const { selectedElement, setSelectedElement } = useSelect();
  const { t } = useTranslation();

  const [searchText, setSearchText] = React.useState<string>("");
  const filteredTable = React.useMemo(() => tables.map((t) => t.name).filter((i) => i.includes(searchText)), [tables, searchText]);

  return (
    <>
      <div className="flex gap-2">
        <AutoComplete className="w-full" data={filteredTable} value={searchText} showClear prefix={<IconSearch />} placeholder={t("search")} emptyContent={<div className="p-3 popover-theme">{t("not_found")}</div>}
          onChange={(v) => setSearchText(v)} onSelect={(v) => {
            const { id } = tables.find((t) => t.name === v);
            setSelectedElement((prev) => ({ ...prev, id: id, open: true, element: ObjectType.TABLE }));
            document.getElementById(`scroll_table_${id}`)?.scrollIntoView({ behavior: "smooth" });
          }} />

        <div>
          <Button icon={<IconPlus />} block onClick={() => addTable()}>
            {t("add_table")}
          </Button>
        </div>
      </div>
      {tables.length === 0 ? (
        <Empty title={t("no_tables")} text={t("no_tables_text")} />
      ) : (
        <Collapse accordion keepDOM activeKey={selectedElement.open && selectedElement.element === ObjectType.TABLE ? `${selectedElement.id}` : ""}
          onChange={(k) => setSelectedElement((prev) => ({ ...prev, open: true, id: parseInt(k), element: ObjectType.TABLE }))}>
          {tables.map((t) => (
            <div id={`scroll_table_${t.id}`} key={t.id}>
              <Collapse.Panel itemKey={`${t.id}`} header={
                <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                  {t.name}
                </div>
              }>
                <TableInfo data={t} />
              </Collapse.Panel>
            </div>
          ))}
        </Collapse>
      )}
    </>
  );
}
