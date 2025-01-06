import { SetStateAction, useEffect, useState } from "react";
import { FMSettingKey, FMSettings, FMSettingState, FMSettingVal } from "./FMSetting";
import { FontMakerEvent } from "../FMEvent";

export class FMSettingsService {
  private _localSettings: FMSettingState

  constructor() {
    const storageSettings = JSON.parse(localStorage.getItem('settings') ?? "{}")

    this._localSettings = Object.fromEntries(
      (Object.keys(FMSettings) as FMSettingKey[]).map(
        (k) => {
          if (k in storageSettings) {
            return [k, storageSettings[k] as FMSettingVal<typeof k>]

          } else {
            return [k, FMSettings[k].defaultValue as FMSettingVal<typeof k>]
          }
        }
      )
    ) as FMSettingState

    console.log('local settings', this._localSettings)
  }

  get<K extends FMSettingKey>(key: K): FMSettingVal<K> {
    return this._localSettings[key]
  }

  set<K extends FMSettingKey>(key: K, val: FMSettingVal<K>, store?: boolean) {
    this._localSettings[key] = val as FMSettingState[K]
    if (store === true) {
      this.store(key)
    }
    new FontMakerEvent('FMSettingChange', {key: key, value: val}).dispatch()
  }


  store(...keys: FMSettingKey[]) {
    const storageSettings = JSON.parse(localStorage.getItem('settings') ?? '{}')

    for (const key of keys) {
      storageSettings[key] = this._localSettings[key]
    }

    localStorage.setItem('settings', JSON.stringify(storageSettings))
  }

}
