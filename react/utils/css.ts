export const accumulatedStyles = ""
export const css = (input: TemplateStringsArray) => {
  const string = String(input)
  accumulatedStyles.concat(string)
  return string
}