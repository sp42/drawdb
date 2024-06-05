import React from 'react';
import { Button, AutoComplete } from "@douyinfe/semi-ui";
import { IconPlus, IconSearch } from "@douyinfe/semi-icons";
import Empty from "./Empty";
import { useAreas } from "../../context/hooks";
import AreaInfo from "./AreaDetails";
import { useTranslation } from "react-i18next";


/**
 * 主题区域
 * @returns 
 */
export default function AreasTab() {
  const { areas, addArea } = useAreas();
  const { t } = useTranslation();

  const [searchText, setSearchText] = React.useState<string>("");
  const [filteredResult, setFilteredResult] = React.useState<string[]>(areas.map((t) => t.name));

  const handleStringSearch = (value) => setFilteredResult(areas.map((t) => t.name).filter((i) => i.includes(value)));

  return (
    <div>
      <div className="flex gap-2">
        <AutoComplete data={filteredResult} value={searchText} showClear className="w-full" prefix={<IconSearch />} placeholder={t("search")}
          emptyContent={<div className="p-3 popover-theme">{t("not_found")}</div>}
          onSearch={(v) => handleStringSearch(v)} onChange={(v) => setSearchText(v)}
          onSelect={(v) => {
            const { id } = areas.find((t) => t.name === v);
            document.getElementById(`scroll_area_${id}`)?.scrollIntoView({ behavior: "smooth" });
          }} />
        <div>
          <Button icon={<IconPlus />} block onClick={addArea}>
            {t("add_area")}
          </Button>
        </div>
      </div>
      {areas.length <= 0 ? (<Empty title={t("no_subject_areas")} text={t("no_subject_areas_text")} />
      ) : (
        <div className="p-2">
          {areas.map((a, i) => (<AreaInfo data={a} key={"area_" + i} i={i} />))}
        </div>
      )}
    </div>
  );
}
