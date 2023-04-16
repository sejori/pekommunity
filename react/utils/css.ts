export const accumulatedStyles = {
  css: ""
}

export const css = (input: TemplateStringsArray) => {
  const cssString = String(input)
  accumulatedStyles.css += cssString
  return cssString
}