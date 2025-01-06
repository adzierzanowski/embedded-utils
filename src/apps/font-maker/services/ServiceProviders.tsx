import {
  createContext,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react"
import { FontMakerService } from "./FontMakerService"
import { FMSettingKey, FMSettings, FMSettingVal } from "./settings/FMSetting"
import { FontMakerEvent, FMEventKind } from "./FMEvent"

const fontMakerService = new FontMakerService()
const FontMakerContext = createContext(fontMakerService)

export const FontMakerServiceProvider = ({
  children,
}: {
  children: ReactNode;
}) => (
  <FontMakerContext.Provider value={fontMakerService}>
    {children}
  </FontMakerContext.Provider>
)

export const useFontMakerService = () => {
  const fontMakerService = useContext(FontMakerContext)
  const settings = fontMakerService.settings

  const useEvent = <T extends FMEventKind>(kind: T) => {
    const [event, setEvent] = useState<FontMakerEvent<T> | null>(null)

    const eventListener = (e: FontMakerEvent<T>) => {
      setEvent(e)
    }

    useEffect(() => {
      window.addEventListener(kind, eventListener as EventListener)
      return () => window.removeEventListener(kind, eventListener as EventListener);
    }, [])

    return event
  }

  const useSetting = <K extends FMSettingKey>(key: K, store = false) => {
    const setting = FMSettings[key]

    const [formValue, _setFormValue] = useState<string>(
      settings.get(key).toString()
    );
    const [value, _setValue] = useState<FMSettingVal<K>>(settings.get(key))
    const [error, setError] = useState<string | undefined>(undefined)

    const setValue = (value: SetStateAction<FMSettingVal<K>>) => {
      _setValue(value)
    };

    const setFormValue = (val: string) => {
      _setFormValue(val);
      const parsedVal = setting.fromString(val)
      if (parsedVal === undefined) {
        setError("Couldn't parse the value")
        return
      }
      setError(setting.validate(parsedVal as never))
      setValue(parsedVal)
    };

    useEffect(() => {
      settings.set(key, value, store)
    }, [value]);

    return {
      label: setting.label,
      value,
      setValue,
      formValue,
      setFormValue,
      error,
    };
  };

  return { fontMakerService, useEvent, useSetting };
};
