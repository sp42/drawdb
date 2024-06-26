import React from 'react';
import { IconCaretdown, IconCheckboxTick, IconRowsStroked } from "@douyinfe/semi-icons";
import { Dropdown } from "@douyinfe/semi-ui";
import { useLayout } from "../../context/hooks";
import { enterFullscreen, exitFullscreen } from "../../utils/utils";
import { useTranslation } from "react-i18next";

/**
 * Drop down list on the first menu
 * 
 * @returns 
 */
export default function LayoutDropdown(): React.JSX.Element {
  const { layout, setLayout } = useLayout();
  const { t } = useTranslation();

  function invertLayout(component: string): void {
    setLayout((prev) => {
      // @ts-ignore
      prev[component] = !prev[component];
      
      return { ...prev };
    });
  }

  return (
    <Dropdown position="bottomLeft" style={{ width: "180px" }} trigger="click"
      render={
        <Dropdown.Menu>
          <Dropdown.Item icon={layout.header ? <IconCheckboxTick /> : <div className="px-2" />} onClick={() => invertLayout("header")}>
            {t("header")}
          </Dropdown.Item>
          <Dropdown.Item icon={layout.sidebar ? <IconCheckboxTick /> : <div className="px-2" />} onClick={() => invertLayout("sidebar")}>
            {t("sidebar")}
          </Dropdown.Item>
          <Dropdown.Item icon={layout.issues ? <IconCheckboxTick /> : <div className="px-2" />} onClick={() => invertLayout("issues")}>
            {t("issues")}
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item icon={<div className="px-2" />} onClick={() => {
            if (layout.fullscreen)
              exitFullscreen();
            else
              enterFullscreen();

            invertLayout("fullscreen");
          }}>
            {t("fullscreen")}
          </Dropdown.Item>
        </Dropdown.Menu>
      }>
      <div className="py-1 px-2 hover-2 rounded flex items-center justify-center">
        <IconRowsStroked size="extra-large" />
        <div>
          <IconCaretdown />
        </div>
      </div>
    </Dropdown>
  );
}
