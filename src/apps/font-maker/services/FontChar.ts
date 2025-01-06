export class FontChar {
  code: number
  width: number
  height: number
  bitmap: number[][]

  constructor(code: number, width: number, height: number) {
    this.code = code
    this.width = width
    this.height = height
    this.bitmap = new Array(height).fill(0).map(
      () => new Array(width).fill(0))
  }

  get symbol() {
    return this.code === 32 ? '␣' : String.fromCharCode(this.code)
  }

  clear() {
    this.bitmap.forEach(row => row.fill(0))
  }

  async drawOnCanvas(cvs: HTMLCanvasElement) {
    const ctx = cvs.getContext('2d')
    if (ctx === null) return
    ctx.clearRect(0, 0, cvs.width, cvs.height)
    ctx.imageSmoothingEnabled = false
    const pix = ctx.createImageData(this.width, this.height)
    const bmpData = this.bitmap.map(
      row => row.flatMap(
        p => new Array(4).fill(p*0xff)
      )
    ).flat()
    pix.data.set(bmpData)
    const img = await window.createImageBitmap(pix, {})
    ctx.drawImage(img, 0, 0, cvs.width, cvs.height)
  }

  toArray(scanHorizontally = false, lsbFirst = false) {
    const arr = []

    if (scanHorizontally) {
      for (let x = 0; x < this.width; x++) {
        let val = 0
        let i = lsbFirst ? 0 : this.height - 1
        for (let y = 0;  y <  this.height ; y++) {
          val |= this.bitmap[y][x] << i
          i += lsbFirst ? 1 : -1
        }
        arr.push(val)
      }

    } else {
      for (const row of this.bitmap) {
        let val = 0
        let i = lsbFirst ? 0 : row.length - 1
        for (const pix of row) {
          val |= pix << i

          i += lsbFirst ? 1 : -1
        }
        arr.push(val)
      }
    }

    return arr
  }
}
