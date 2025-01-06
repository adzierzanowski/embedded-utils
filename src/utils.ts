export type ClassDef = [
  element?: string,
  mod?: string,
  predicate?: (() => boolean) | boolean
]

export const useBEM = (baseClass: string) => {
  const classBuilder = (...defs: ClassDef[]) => {

    const classList = []

    for (const def of defs) {
      let className = `${baseClass}`

      const [ element, mod, predicate ] = def

      if (element !== undefined)  {
        className += `__${element}`
      }

      if (mod !== undefined) {
        className += `--${mod}`
      }

      if (
        predicate === undefined
          || (typeof(predicate) === 'boolean' && predicate)
          || (predicate instanceof Function && predicate())) {
        classList.push(className)
      }
    }

    return classList.join(' ')
  }

  return classBuilder
}

export const leftPad = (text: string, n: number, fill = '0') => {
  const missingCount = n > text.length ? n - text.length : 0
  return new Array(missingCount).fill(fill).join('') + text
}
