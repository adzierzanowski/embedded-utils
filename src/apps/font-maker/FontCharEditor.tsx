import { useEffect, useState } from "react"
import { useBEM } from "../../utils"
import './FontCharEditor.scss'
import { useFontMakerService } from "./services/ServiceProviders"

export const FontCharEditor = () => {
  const bem = useBEM('font-char-editor')
  const { fontMakerService, useEvent, useSetting } = useFontMakerService()
  const [penDown, setPenDown] = useState<boolean>(false)
  const [penVal, setPenVal] = useState<boolean>(true)
  const scanHorizontally = useSetting('scanHorizontally')
  const lsbFirst = useSetting('lsbFirst')
  const [activeChar, setActiveChar] = useState(fontMakerService.activeCharCode)

  const activeCharChange = useEvent('FMActiveCharChange')
  const fontDataChange = useEvent('FMFontDataChange')

  useEffect(() => {}, [fontDataChange])

  useEffect(() => {
    if (activeCharChange !== null) {
      setActiveChar(activeCharChange.data.code)
    }
  }, [activeCharChange])

  const onPointerDown = (x: number, y: number) => {
    const pixelState = fontMakerService.togglePixel(x, y)
    setPenDown(true)
    setPenVal(pixelState === 1)
  }

  const onPointerMove = (x: number, y: number) => {
    if (!penDown) return
    fontMakerService.setPixel(x, y, penVal)
  }

  const onPointerUp = () => {
    if (penDown) {
      setPenDown(false)
    }
  }

  return (
    <div className={bem([])}>
      <div className={bem(['title'])}>
        {fontMakerService.activeChar?.symbol}
        <sub>{activeChar}</sub>
      </div>

      <nav>
        <button onClick={() => fontMakerService?.prevChar()}>
          {'<- Prev'}
        </button>
        <button onClick={() => fontMakerService?.clearChar()}>
          Clear
        </button>
        <button onClick={() => fontMakerService?.nextChar()}>
          {'Next ->'}
        </button>
      </nav>

      <div className={bem(['bitmap'])} onPointerLeave={onPointerUp}>
        {fontMakerService.activeChar?.bitmap.map((row, y) => (

          <div key={y} className={bem(['row'])}>
            {scanHorizontally.value && (
              <div className={bem(['row', 'index'])}>
                {lsbFirst ? 16 - y - 1 : y}
              </div>
            )}
            {row.map((pix, x) => (
              <div
                key={[x, y].toString()}
                onPointerDown={() => onPointerDown(x, y)}
                onPointerMove={() => onPointerMove(x, y)}
                onPointerUp={onPointerUp}
                className={
                  `${bem(
                    ['pix'],
                    ['pix', 'guideline', (x+1)%8===0 || (y+1)%8===0]
                  )} ${pix === 1 ? 'active' : ''}`
                }
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
