import { Parser } from './compiler/parser';

export function compileMarkup(markup: string) {
  try {
    const markupParser = new Parser();
    return markupParser.parse(markup);
  } catch (error) {
    //console.error(error);
    //return false;
    throw new Error(error as string);
  }
}
