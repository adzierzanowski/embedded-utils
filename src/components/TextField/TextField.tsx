import { DetailedHTMLProps, InputHTMLAttributes } from "react"
import { useBEM } from "../../utils"
import './TextField.scss'

export type TextFieldProps =
  DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > & {
    error?: string
    label?: string
  }

export const TextField = ({error, label, ...inputProps}: TextFieldProps) => {
  const bem = useBEM('text-field')

  return (
    <fieldset
      className={
        bem([], [undefined, 'error', error !== undefined])
      }
    >
      {label && <legend>{label}</legend>}
      <input type="text" {...inputProps} />
      {error && <div className={bem(['error'])}>{error}</div>}
    </fieldset>
  )
}
