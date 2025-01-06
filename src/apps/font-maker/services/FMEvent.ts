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


// export const FMEventKindDict = {
//   ActiveCharChange: 'fms-active-char-change',
//   CharDataChange: 'fms-char-data-change',
//   FontDataChange: 'fms-font-data-change',
//   SettingChange: 'fms-setting-change'
// }

// export type FMEventKind = keyof typeof FMEventKindDict

// // export type FMEventDetail<T extends FMEventKind> = {
// //   kind: FMEventKind
// //   data: T extends ActiveCharChange
// //     ? {code: number}
// //     : T extends FMEventKind.CharDataChange
// //       ? {code: number, x: number, y: number, active: number}
// //       : T extends FMEventKind.FontDataChange
// //         ? never
// //         : T extends FMEventKind.SettingChange
// //           ? {key: FMSettingKey, value: FMSettingState[FMSettingKey]}
// //           : never
// // }

// export type FMEventDetail<T in FMEventKind> = T extends "ActiveCharChange" ? { code: number } : never


// export class FontMakerEvent<Kind extends FMEventKind> extends CustomEvent<FMEventDetail<Kind>> {
//   constructor(kind: Kind, data: FMEventDetail<Kind>) {
//     super(kind, {
//       detail: {
//         kind,
//         data
//       }
//     })
//   }


//   get kind() {
//     return this.detail.kind
//   }

//   get data() {
//     return this.detail.data
//   }

//   dispatch() {
//     window.dispatchEvent(this)
//   }
// }
