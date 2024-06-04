import React from 'react';
import ReactDOM from "react-dom/client";
import { LocaleProvider } from "@douyinfe/semi-ui";
import { Analytics } from "@vercel/analytics/react";
import App from "./App.tsx";
import en_US from "@douyinfe/semi-ui/lib/es/locale/source/en_US";
import "./index.css";
import "./i18n/i18n.js";

const root:ReactDOM.Root = ReactDOM.createRoot(document.getElementById("root"));

console.log(9999999)
root.render(
  <LocaleProvider locale={en_US}>
    <App />
    <Analytics />
  </LocaleProvider>,
);
