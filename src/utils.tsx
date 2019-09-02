import locales from "./locale.json";
import { TypographyProps } from "@material-ui/core/Typography";

export type Locale = keyof typeof locales;
function ascOrEq(...numbers: number[]) {
  for (let i = 0; i < numbers.length - 1; i++) {
    if (!(numbers[i] <= numbers[i + 1])) return false;
  }
  return true;
}

export function getCharType(code: number) {
  if (ascOrEq(49, code, 57)) {
    return "numeric";
  }
  if (ascOrEq(65, code, 90)) {
    return "latin";
  }
  if (ascOrEq(97, code, 122)) {
    return "latin";
  }
  if (ascOrEq(1040, code, 1103)) {
    return "cyrillic";
  }
  return "other";
}

export function mapColors(
  type: ReturnType<typeof getCharType>,
): TypographyProps["color"] {
  switch (type) {
    case "latin":
      return "textPrimary";
    case "cyrillic":
      return "textSecondary";
    case "numeric":
      return "primary";
    default:
      return "error";
  }
}
