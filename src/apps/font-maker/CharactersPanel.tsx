import { TabPanel } from "../../components/Tabs/TabPanel"
import { FontCharNode } from "./FontCharNode"
import { Toggle } from "../../components/Toggle/Toggle"
import { useFontMakerService } from "./services/ServiceProviders"

export type CharactersPanelProps = {
  activePanel: string
}

export const CharactersPanel = ({activePanel}: CharactersPanelProps) => {
  const {fontMakerService, useEvent, useSetting} = useFontMakerService()
  const showLabels = useSetting('showLabels', true)

  const activeCharChange = useEvent('FMActiveCharChange')


  return (
    <TabPanel active={activePanel === 'chars'}>
      <div id="char-options">
      <input type="file" />
      <button onClick={() => fontMakerService.clearAll()}>
        Import
      </button>
      <button onClick={() => fontMakerService.clearAll()}>
        Clear All
      </button>
       <Toggle value={showLabels.value} onClick={val => showLabels.setValue(val)}>
          Show Labels
       </Toggle>
      </div>

      <div id="char-list">
        {fontMakerService.chars.map((char) => (
          <FontCharNode
            char={char}
            showLabel={showLabels.value}
            activeCharCode={fontMakerService?.activeCharCode}
            onClick={() => fontMakerService.activeCharCode = char.code}
            key={char.symbol}
          />
        ))}
      </div>
    </TabPanel>
  )
}
