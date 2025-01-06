import { FontOutputFormat, FontOutputFormatDef } from "../Font"

export interface FMSetting<T> {
  label: string
  defaultValue: T
  validate: FMSettingValidator<T>
  fromString: FMSettingFromString<T>
}

export type FMSettingValidator<T> = (value: T) => string | undefined
export type FMSettingFromString<T> = (value: string) => T | undefined

function createBoolSetting(label: string, defaultValue: boolean): FMSetting<boolean> {
  return {
    label,
    defaultValue,
    fromString: (val) => Boolean(val),
    validate: () => undefined
  }
}

function createStringSetting(label: string, defaultValue: string): FMSetting<string> {
  return {
    label,
    defaultValue,
    fromString: (val) => val,
    validate: () => undefined
  }
}

function createIntSetting(label: string, defaultValue: number, constraints: {[key: string]: (v: number) => boolean}): FMSetting<number> {
  return {
    label,
    defaultValue,
    fromString: (val: string) => {
      const parsedValue = parseInt(val)
      if (isNaN(parsedValue)) {
        return undefined
      }
      return parsedValue
    },
    validate: (val: number) => {
      for (const [message, constraint] of Object.entries(constraints)) {
        if (constraint(val)) {
          return message
        }
        return undefined
      }
    }
  }
}

export const FMSettings = {
  activePanel: createStringSetting('Active Panel', 'chars'),
  scanHorizontally: createBoolSetting('Scan Horizontally', false),
  lsbFirst: createBoolSetting('LSB First', false),
  charWidth: createIntSetting('Char Width', 8, {
    'Char width should be a positive integer': (v) => v <= 0
  }),
  charHeight: createIntSetting('Char Height', 8, {
    'Char height should be a positive integer': (v) => v <= 0
  }),
  fontName: createStringSetting('Font Name', 'font'),
  showLabels: createBoolSetting('Show Labels', true),
  outputFormat: createStringSetting('Output Format', 'c')
} as const

export type FMSettingKey = keyof typeof FMSettings
export type FMSettingDef<T extends FMSettingKey> = typeof FMSettings[T]
export type FMSettingVal<T extends FMSettingKey> = FMSettingDef<T>['defaultValue']
export type FMSettingState = {
  [K in FMSettingKey]: FMSettingVal<K>
}
