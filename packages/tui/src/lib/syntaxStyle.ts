import { RGBA, SyntaxStyle } from "@opentui/core";

const syntaxStyle = SyntaxStyle.fromStyles({
  string: { fg: RGBA.fromIndex(13) },
  "string.special.key": { fg: RGBA.fromIndex(14) },
  "string.special": { fg: RGBA.fromIndex(5) },
  number: { fg: RGBA.fromIndex(3) },
  "constant.builtin": { fg: RGBA.fromIndex(5) },
  boolean: { fg: RGBA.fromIndex(5) },
  escape: { fg: RGBA.fromIndex(5) },
  comment: { fg: RGBA.fromIndex(4) },
  label: { fg: RGBA.fromIndex(13) },
  type: { fg: RGBA.fromIndex(2), bold: true },
  attribute: { fg: RGBA.fromIndex(5) },
  property: { fg: RGBA.fromIndex(14) },
  "punctuation.delimiter": {},
  "punctuation.bracket": {},
  "punctuation.special": { fg: RGBA.fromIndex(5) },
  operator: {},
});

export default syntaxStyle;
