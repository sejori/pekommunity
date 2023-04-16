export const accumulatedStyles = {
  css: ""
}

export const css = (input: TemplateStringsArray) => {
  const string = String(input)
  accumulatedStyles.css.concat(string)
  return string
}