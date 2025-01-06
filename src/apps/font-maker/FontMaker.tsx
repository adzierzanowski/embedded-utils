import { useEffect } from "react";
import { Tabs, TabsPanel } from "../../components/Tabs/Tabs";
import "./FontMaker.scss";
import { FontCharEditor } from "./FontCharEditor";
import { CharactersPanel } from "./CharactersPanel";
import { OutputPanel } from "./OutputPanel";
import { SettingsPanel } from "./SettingsPanel";
import { useFontMakerService } from "./services/ServiceProviders";
import { FMEventKindDef } from "./services/FMEvent";

export const FontMaker = () => {
  const panels: TabsPanel[] = [
    {
      name: "chars",
      label: "⌘C Characters",
      shortcut: (e: KeyboardEvent) => e.metaKey && e.key === "c",
    },
    {
      name: "output",
      label: "⌘O Output",
      shortcut: (e: KeyboardEvent) => e.metaKey && e.key === "o",
    },
    {
      name: "settings",
      label: "⌘S Settings",
      shortcut: (e: KeyboardEvent) => e.metaKey && e.key === "s",
    },
  ];

  const { fontMakerService, useSetting, useEvent } = useFontMakerService();

  const settingsStored = useEvent("FMSettingsStored");

  const { value: activePanel, setValue: setActivePanel } = useSetting(
    "activePanel",
    true
  );

  const onKeyDown = (e: KeyboardEvent) => {
    for (const panel of panels) {
      if (panel.shortcut?.(e)) {
        e.preventDefault();
        setActivePanel(panel.name);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (settingsStored !== null) {
      if (
        settingsStored.data.storedKeys.includes("charHeight") ||
        settingsStored.data.storedKeys.includes("charWidth")
      ) {
        fontMakerService.initFont();
      }
    }
  }, [settingsStored]);

  return (
    <div id="font-maker">
      <div id="editor-container">
        <FontCharEditor />
      </div>
      <div id="controls-container">
        <Tabs
          panels={panels}
          activePanel={activePanel}
          onPanelChange={setActivePanel}
        >
          <CharactersPanel activePanel={activePanel} />
          <OutputPanel activePanel={activePanel} />
          <SettingsPanel active={activePanel === "settings"} />
        </Tabs>
      </div>
    </div>
  );
};
