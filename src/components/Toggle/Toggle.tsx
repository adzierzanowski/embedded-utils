import { ReactNode } from "react"
import { useBEM } from "../../utils"
import './Toggle.scss'

export type ToggleProps = {
  onClick?: (checked: boolean) => void
  value: boolean
  children: ReactNode
}

export const Toggle = ({value, children, onClick}: ToggleProps) => {
  const bem = useBEM('toggle')

  return (
    <div
      className={bem([], [undefined, 'checked', value])}
      role="checkbox"
      onClick={() => onClick?.(!value)}>
      <div className={bem(['mark'], ['mark', 'checked', value])} />
      {children}
    </div>
  )
}
