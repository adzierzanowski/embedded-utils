import { FMSettingsService } from "./settings/FMSettingsService";
import { Font, FontOutputFormatDef, FontOutputOptions } from "./Font";
import { FontMakerEvent, FMEventKindDef, FMEventKind } from "./FMEvent";


export class FontMakerService {
  private _font: Font
  private _settings: FMSettingsService = new FMSettingsService()

  constructor() {
    console.log('new FontMakerService')
    this._font = this.initFont()
  }

  private _onChange<T extends FMEventKind>(type: T, data: FMEventKindDef[T]) {
    new FontMakerEvent(type, data).dispatch()
  }

  initFont() {
    this._font = new Font(
      this.settings.get('charWidth'),
      this.settings.get('charHeight')
    )
    this._onChange('FMFontDataChange', {} as never)
    return this._font
  }

  get settings() {
    return this._settings
  }

  get activeCharCode() {
    return this._font.activeCharCode
  }

  get activeChar() {
    return this._font.chars.find(
      (char) => char.code === this._font.activeCharCode)
  }

  set activeCharCode(code: number) {
    this._font.activeCharCode = code
    this._onChange('FMActiveCharChange', { code: this._font.activeCharCode })
  }

  get chars() {
    return this._font.chars
  }

  togglePixel(x: number, y: number) {
    const bitmap = this.activeChar?.bitmap;
    if (bitmap === undefined) return

    bitmap[y][x] = bitmap[y][x] === 0 ? 1 : 0;

    const currentState = bitmap[y][x]

    this._onChange(
      'FMCharDataChange',
      { code: this.activeCharCode, x, y, active: bitmap[y][x] }
    )

    return currentState
  }

  setPixel(x: number, y: number, on: boolean) {
    const bitmap = this.activeChar?.bitmap;
    if (bitmap === undefined) return

    bitmap[y][x] = on ? 1 : 0;
    this._onChange(
      'FMCharDataChange',
      { code: this.activeCharCode, x, y, active: bitmap[y][x] }
    )
  }

  prevChar() {
    this._font.activeCharCode = this.activeCharCode - 1
    this._onChange('FMActiveCharChange', { code: this._font.activeCharCode })
  }

  nextChar() {
    this._font.activeCharCode = this.activeCharCode + 1
    this._onChange('FMActiveCharChange', { code: this._font.activeCharCode })
  }

  clearChar() {
    const bitmap = this.activeChar?.bitmap
    if (bitmap === undefined) return
    bitmap.forEach(row => row.fill(0))
    this._onChange('FMFontDataChange', {} as never)
  }

  clearAll() {
    this._font.clearAll()
    this._onChange('FMFontDataChange', {} as never)
  }

  exportFont(fmt: FontOutputFormatDef) {
    const fontExportSettings: FontOutputOptions = {
      name: this.settings.get('fontName'),
      lsbFirst: this.settings.get('lsbFirst'),
      scanHorizontally: this.settings.get('scanHorizontally')
    }
    console.log('font export with settings', fontExportSettings)
    return this._font.toString(fmt, fontExportSettings)
  }
}
