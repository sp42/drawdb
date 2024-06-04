import { Collapse, Button, Popover } from "@douyinfe/semi-ui";
import { IconPlus, IconInfoCircle } from "@douyinfe/semi-icons";
import { useSelect, useTypes } from "../../../hooks";
import { ObjectType } from "../../../data/constants";
import { AutoComplete } from "@douyinfe/semi-ui";
import { IconSearch } from "@douyinfe/semi-icons";
import { useState } from "react";
import Empty from "../Empty";
import TypeInfo from "./TypeInfo";
import { useTranslation } from "react-i18next";

export default function TypesTab() {
  const { types, addType } = useTypes();
  const { selectedElement, setSelectedElement } = useSelect();
  const { t } = useTranslation();

  const [value, setValue] = useState("");
  const [filteredResult, setFilteredResult] = useState(types.map((t) => t.name));
  const handleStringSearch = (value) => {
    setFilteredResult(types.map((t) => t.name).filter((i) => i.includes(value)));
  };

  return (
    <>
      <div className="flex gap-2">
        <AutoComplete className="w-full" showClear data={filteredResult} value={value} prefix={<IconSearch />} placeholder={t("search")}
          onSearch={(v) => handleStringSearch(v)}
          emptyContent={<div className="p-3 popover-theme">{t("not_found")}</div>}
          onChange={(v) => setValue(v)}
          onSelect={(v) => {
            const i = types.findIndex((t) => t.name === v);
            setSelectedElement((prev) => ({
              ...prev,
              id: i,
              open: true,
              element: ObjectType.TYPE,
            }));

            document.getElementById(`scroll_type_${i}`).scrollIntoView({ behavior: "smooth" });
          }} />
        <div>
          <Button icon={<IconPlus />} block onClick={() => addType()}>
            {t("add_type")}
          </Button>
        </div>
        <Popover showArrow position="rightTop" content={
          <div className="w-[240px] text-sm space-y-2 popover-theme">
            {t("types_info").split("\n").map((line, index) => <div key={index}>{line}</div>)}
          </div>
        }>
          <Button theme="borderless" icon={<IconInfoCircle />} />
        </Popover>
      </div>
      {types.length <= 0 ? (
        <Empty title={t("no_types")} text={t("no_types_text")} />
      ) : (
        <Collapse keepDOM accordion lazyRender
          activeKey={selectedElement.open && selectedElement.element === ObjectType.TYPE ? `${selectedElement.id}` : ""}
          onChange={(id) =>
            setSelectedElement((prev) => ({
              ...prev,
              open: true,
              id: parseInt(id),
              element: ObjectType.TYPE
            }))
          }>
          {types.map((t, i) => (<TypeInfo data={t} key={i} index={i} />))}
        </Collapse>
      )}
    </>
  );
}
