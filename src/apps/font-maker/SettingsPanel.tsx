import { TabPanel, TabPanelProps } from "../../components/Tabs/TabPanel";
import { Toggle } from "../../components/Toggle/Toggle";
import { TextField } from "../../components/TextField/TextField";
import { useFontMakerService } from "./services/ServiceProviders";
import { FMSettingKey } from "./services/settings/FMSetting";
import { FontMakerEvent } from "./services/FMEvent";

export const SettingsPanel = ({active}: TabPanelProps) => {
  const {fontMakerService, useSetting} = useFontMakerService()
  const settings = fontMakerService.settings

  const charWidth = useSetting('charWidth')
  const charHeight = useSetting('charHeight')
  const fontName = useSetting('fontName')
  const scanHorizontally = useSetting('scanHorizontally')
  const lsbFirst = useSetting('lsbFirst')

  const onApply = () => {
    const keysToStore: FMSettingKey[] = [
      'fontName', 'charHeight', 'charWidth', 'lsbFirst', 'scanHorizontally'
    ]
    settings.store(...keysToStore)
    new FontMakerEvent('FMSettingsStored', {storedKeys: keysToStore}).dispatch()
  }

  return (
    <TabPanel id="settings-panel" active={active}>
      <TextField
        value={fontName.formValue}
        onChange={e => fontName.setFormValue(e.target.value)}
        label={fontName.label}
        error={fontName.error}
      />

      <div className="quickrow">
        <TextField
          value={charWidth.formValue}
          onChange={e => charWidth.setFormValue(e.target.value)}
          label={charWidth.label}
          error={charWidth.error}
        />

        <TextField
          value={charHeight.formValue}
          onChange={e => charHeight.setFormValue(e.target.value)}
          label={charHeight.label}
          error={charHeight.error}
        />
      </div>

      <div className="quickrow">
        <Toggle
          value={scanHorizontally.value}
          onClick={checked => scanHorizontally.setValue(checked)}>
          {scanHorizontally.label}
        </Toggle>

        <Toggle
          value={lsbFirst.value}
          onClick={checked => lsbFirst.setValue(checked)}>
          {lsbFirst.label}
        </Toggle>
      </div>

      <button onClick={onApply}>Apply</button>
    </TabPanel>
  )
}
