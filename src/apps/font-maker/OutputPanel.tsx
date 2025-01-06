import { useEffect, useState } from "react"
import { TabPanel } from "../../components/Tabs/TabPanel"
import { Editor } from '@monaco-editor/react'
import { FontOutputFormat } from "./services/Font"
import { useFontMakerService } from "./services/ServiceProviders"

export type OutputPanelProps = {
  activePanel: string
}

export const OutputPanel = ({activePanel}: OutputPanelProps) => {
  const { fontMakerService, useEvent, useSetting } = useFontMakerService()
  const [output, setOutput] = useState<string>('')

  const fontDataChange = useEvent('FMCharDataChange')
  const settingChange = useEvent('FMSettingChange')
  const charDataChange  = useEvent('FMCharDataChange')

  const {value: outputFormat, setFormValue: setOutputFormat} =
    useSetting('outputFormat', true)

  const outputFormatDef = Object.values(FontOutputFormat).find(
    fmt => fmt.name === outputFormat) ?? FontOutputFormat.C

  useEffect(() => {
    setOutput(fontMakerService.exportFont(outputFormatDef))
  }, [fontDataChange, charDataChange, settingChange, outputFormat])


  return (
    <TabPanel active={activePanel === 'output'}>
      <div id="output-panel">
        <nav>
          <fieldset>
            <legend>Output Format</legend>
            <select
              onChange={e => setOutputFormat(e.target.value)}
              value={outputFormat}
            >
              {Object.values(FontOutputFormat).map((fmt) => (
                <option key={fmt.name} value={fmt.name}>
                  {fmt.displayName}
                </option>
              ))}
            </select>
          </fieldset>
          <button>Export</button>
          <button>Copy</button>
        </nav>
        <Editor
          value={output}
          theme="vs-dark"
          language={outputFormatDef.language}
          options={{
            readOnly: true,
            minimap: {enabled: false},
            padding: {top: 10},
            wordWrap: 'on'
          }}
        />
      </div>
    </TabPanel>
  )
}
