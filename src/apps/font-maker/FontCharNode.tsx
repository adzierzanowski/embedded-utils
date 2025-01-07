import { useEffect, useRef } from "react"
import { useBEM } from "../../utils"
import { FontChar } from "./services/FontChar"
import { useFontMakerService } from "./services/ServiceProviders"

export type FontCharProps = {
  char: FontChar
  activeCharCode: number
  onClick: () => void
  showLabel: boolean
}

export const FontCharNode = ({char, activeCharCode, onClick, showLabel}: FontCharProps) => {
  const bem = useBEM('character')
  const {useEvent} = useFontMakerService()
  const cvs = useRef(null)

  const charDataChange = useEvent('FMCharDataChange')

  const drawThumb = () => {
    window.requestAnimationFrame(() => {
      if (cvs.current !== null) {
        char.drawOnCanvas(cvs.current)
      }
    })
  }

  useEffect(drawThumb, [charDataChange])

  return (
    <div
      role="button"
      onClick={onClick}
      className={
        `${bem([])} ${activeCharCode === char.code ? 'active' : ''}
      `}
      key={char.symbol}>
      {showLabel ? (
        <div className={bem(['label'])}>
          <div className={bem(['symbol'])}>
            {char.symbol}
          </div>
          <div className={bem(['code'])}>
            {char.code}
          </div>
        </div>
      ) : null}
      <div className={bem(['thumb'])}>
        <canvas width={8*char.width} height={8*char.height} ref={cvs} />
      </div>
    </div>
  )
}
