import React from 'react';
import { Collapse, AutoComplete } from "@douyinfe/semi-ui";
import { IconSearch } from "@douyinfe/semi-icons";
import { useSelect, useTables } from "../../context/hooks";
import Empty from "./Empty";
import RelationshipInfo from "./RelationshipInfo";
import { ObjectType } from "../../data/constants";
import { useTranslation } from "react-i18next";
// import { Relationships } from "../../context/TablesContext";

export default function RelationshipsTab() {
  const { relationships } = useTables();
  const { selectedElement, setSelectedElement } = useSelect();
  const { t } = useTranslation();

  const [searchText, setSearchText] = React.useState<string>("");
  const [filteredResult, setFilteredResult] = React.useState<string[]>(relationships.map((t) => t.name));
  const handleStringSearch = (value) => setFilteredResult(relationships.map((t) => t.name).filter((i) => i.includes(value)));

  return (
    <>
      <AutoComplete className="w-full" data={filteredResult} value={searchText} showClear prefix={<IconSearch />} placeholder={t("search")} emptyContent={<div className="p-3 popover-theme">{t("not_found")}</div>}
        onSearch={(v) => handleStringSearch(v)} onChange={(v) => setSearchText(v)} onSelect={(v) => {
          const { id } = relationships.find((t) => t.name === v);
          setSelectedElement((prev) => ({ ...prev, id: id, open: true, element: ObjectType.RELATIONSHIP }))
          document.getElementById(`scroll_ref_${id}`)?.scrollIntoView({ behavior: "smooth" });
        }}
      />
      <Collapse keepDOM accordion lazyRender activeKey={selectedElement.open && selectedElement.element === ObjectType.RELATIONSHIP ? `${selectedElement.id}` : ""}
        onChange={(k) => setSelectedElement((prev) => ({ ...prev, open: true, id: parseInt(k), element: ObjectType.RELATIONSHIP }))}>
        {relationships.length <= 0 ? (<Empty title={t("no_relationships")} text={t("no_relationships_text")} />) : (relationships.map((r) => <RelationshipInfo key={r.id} data={r} />))}
      </Collapse>
    </>
  );
}
