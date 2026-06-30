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
  markup: { fg: RGBA.fromIndex(6) },
  "markup.heading": { bold: true },
  "markup.strong": { bold: true },
  "markup.italic": { italic: true },
  "markup.raw": { fg: RGBA.fromIndex(3) },
  "markup.link": { fg: RGBA.fromIndex(5), underline: true },
  "markup.link.url": { fg: RGBA.fromIndex(14), underline: true },
  keyword: { fg: RGBA.fromIndex(5) },
  "character.special": { fg: RGBA.fromIndex(5) },
});

export default syntaxStyle;
