import { Parser } from "./compiler/parser";

export function compileMarkup(markup : string) {
  const markupParser = new Parser();
  return markupParser.parse(markup);
}