import { Dispatch, SetStateAction, useEffect, useState } from "react"

export const useValidatedState = <T>(
  initial: T,
  validate?: (value: T) => (string | undefined)
): [T, Dispatch<SetStateAction<T>>, (string | undefined)] => {
  const [formValue, setFormValue] = useState<T>(initial)
  const [error, setError] = useState<string | undefined>(undefined)

  useEffect(() => {
    setError(validate?.(formValue))
  }, [formValue])

  const setValue = (newValue: SetStateAction<T>) =>
    setFormValue(newValue)


  return [formValue, setValue, error]
}
