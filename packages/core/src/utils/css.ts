export const parseStyles = (styles: String = '') : {[key: string]: string} => {
  return styles
    .split(';')
    .filter((style) => style.split(':').length === 2)
    .map((style) => {
      const [key, value] = style.split(':')
      return [
        key.trim().replace(/-./g, (s) => s.charAt(1).toUpperCase()), 
        value.trim(),
      ]
    })
    .reduce((styleObj, style) => ({
      ...styleObj,
      [style[0]]: style[1],
    }), {})
}