import { FMSettingKey, FMSettingState } from "./settings/FMSetting"

export interface FMEventKindDef {
  FMActiveCharChange: { code: number }
  FMCharDataChange: { code: number; x: number; y: number; active: number }
  FMFontDataChange: never
  FMSettingChange: { key: FMSettingKey; value: FMSettingState[FMSettingKey] }
  FMSettingsStored: { storedKeys: FMSettingKey[] }
}

export type FMEventKind = keyof FMEventKindDef

export type FMEventDetail<Kind extends FMEventKind> = {
  kind: Kind,
  data: FMEventKindDef[Kind]
}

export class FontMakerEvent<Kind extends keyof FMEventKindDef> extends CustomEvent<FMEventDetail<Kind>> {
  constructor(kind: Kind, data: FMEventKindDef[Kind]) {
    super(kind, {
      detail: {
        kind,
        data
      }
    })
  }


  get kind() {
    return this.detail.kind
  }

  get data() {
    return this.detail.data
  }

  dispatch() {
    console.log(`Dispatched ${this.kind}`, this.data)
    window.dispatchEvent(this)
  }
}
