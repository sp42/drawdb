import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useLayoutEffect } from "react";
import Editor from "./pages/Editor";
import Shortcuts from "./pages/Shortcuts";
import Templates from "./pages/Templates";
import LandingPage from "./pages/LandingPage";
import SettingsContextProvider from "./context/SettingsContext";
import { useSettings } from "./context/hooks";

export default function App() {
  return (
    <SettingsContextProvider>
      <BrowserRouter>
        <RestoreScroll />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/editor" element={
            <ThemedPage>
              <Editor />
            </ThemedPage>
          }
          />
          <Route path="/shortcuts" element={
            <ThemedPage>
              <Shortcuts />
            </ThemedPage>
          }
          />

          <Route path="/templates" element={<Templates />} />
          <Route path="*" element={
            <div className="p-3 space-y-2">
              Not found.
              <p> to create a relationship hold the blue dot of a field and drag it towards the field you want to connect it to
              </p>
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </SettingsContextProvider>
  );
}

function ThemedPage({ children }: { children: React.ReactNode }) {
  const { setSettings } = useSettings();

  useLayoutEffect(() => {
    const theme: string | null = localStorage.getItem("theme");

    if (theme === "dark") {
      setSettings((prev) => ({ ...prev, mode: "dark" }));
      const body = document.body;

      if (body.hasAttribute("theme-mode"))
        body.setAttribute("theme-mode", "dark");
    } else {
      setSettings((prev) => ({ ...prev, mode: "light" }));
      const body = document.body;

      if (body.hasAttribute("theme-mode"))
        body.setAttribute("theme-mode", "light");
    }
  }, [setSettings]);

  return children;
}

function RestoreScroll() {
  const location = useLocation();
  useLayoutEffect(() => window.scroll(0, 0), [location.pathname]);

  return null;
}
