import { leftPad } from "../../../utils"
import { FontChar } from "./FontChar"

export class Font {
  charWidth: number
  charHeight: number
  name = 'font'
  chars: FontChar[]
  private _activeCharCode: number

  constructor(charWidth = 8, charHeight = 16) {
    console.log('new Font')
    this.charWidth = charWidth
    this.charHeight = charHeight
    this.chars = new Array(127 - 32).fill(0).map(
      (_, i) => new FontChar(i + 32, this.charWidth, this.charHeight))
    this._activeCharCode = 32
  }

  get activeCharCode() {
    return this._activeCharCode
  }

  set activeCharCode(val: number) {
    if (this.chars.find(char => char.code === val)) {
      this._activeCharCode = val
    }
  }

  clearAll() {
    for (const char of this.chars) {
      char.clear()
    }
  }

  private _toJSON(options: FontOutputOptions) {
    return JSON.stringify({
      name: options.name,
      charWidth: this.charWidth,
      charHeight: this.charWidth,
      scanHorizontally: options.scanHorizontally,
      lsbFirst: options.lsbFirst,
      chars: this.chars.map(char => ({
        code: char.code,
        bitmap: char.toArray(options.scanHorizontally, options.lsbFirst)
      }))
    }, undefined, 2)
  }

  private _toCArray(options: FontOutputOptions) {
    const hscan  = options.scanHorizontally
    const lsbFirst = options.lsbFirst

    const lines = [
      `const uint8_t ${options.name}[][${hscan ? this.charHeight : this.charWidth
      }] = {`
    ]

    lines.push(
      ...this.chars.map(char => {
        const arr = char.toArray(hscan, lsbFirst).map(val => {
          const padding = 2 * Math.trunc((hscan ? char.height : char.width) / 8)
          return `0x${leftPad(val.toString(16), padding)}`
        })
        const charCode = leftPad(char.code.toString(), 3, ' ')
        const charSymbol =  char.symbol === '\\' ? 'backslash' : char.symbol
        const comment =  `${charCode} ${charSymbol}`

        return `  { ${arr.join(', ')} }, // ${comment}`;
      })
    )

    lines.push('};')

    return lines.join('\n')
  }

  toString(format: FontOutputFormatDef, options: FontOutputOptions) {
    if (options?.name !== undefined) {
      this.name = options.name
    }
    switch (format) {
      case FontOutputFormat.C:
        return this._toCArray(options)

      default:
      case FontOutputFormat.JSON:
        return this._toJSON(options)
    }
  }
}

export interface FontOutputOptions {
  name: string,
  scanHorizontally: boolean
  lsbFirst: boolean
}

export interface FontOutputFormatDef {
  name: string
  displayName: string
  language: string
}

export const FontOutputFormat: Readonly<{ [key: string]: FontOutputFormatDef }> = {
  JSON: {
    name: 'json',
    displayName: 'JSON',
    language: 'json'
  },
  C: {
    name: 'c',
    displayName: 'C Array',
    language: 'c'
  }
} as const
