const Specifcation: any[] = [
  // white-space
  [/^\s+/, null],

  // comments
  [/^\/\/.*/, null],
  [/^\/\*[\s\S]*?\*\//, null],

  // symbols , delimiters
  [/^;/, ';'],
  [/^:/, ':'],
  [/^\{/, '{'],
  [/^\}/, '}'],
  [/^\(/, '('],
  [/^\)/, ')'],
  [/^,/, ','],
  [/^\./, '.'],
  [/^\[/, '['],
  [/^\]/, ']'],
  [/^\<\//, '</'],
  [/^\</, '<'],
  [/^>/, '>'],
  [/^\//, '/'],

  // keywords

  // numbers
  [/^0[x][0-9a-fA-F]+/, 'HEXNUMBER'],
  [/^\d+\.?\d*/, 'NUMBER'],

  // identifiers
  [/^\w+/, 'IDENTIFIER'],


  // strings
  [/^"[^"]*"/, 'STRING'],
  [/^'[^']*'/, 'STRING'],
];

export interface IToken {
  type: string;
  value: string;
}

export class Tokenizer {
  private string = ';';
  private cursor = 0;

  init = (inputString: string) => {
    this.string = inputString;
    this.cursor = 0;
  };

  hasMoreTokens = () => {
    return this.cursor < this.string.length;
  };
  getNextToken = (): IToken | null => {
    if (!this.hasMoreTokens()) {
      return null;
    }
    const string = this.string.slice(this.cursor);

    for (const [regexp, tokenType] of Specifcation) {
      const tokenValue = this.match(regexp as RegExp, string);
      if (tokenValue == null) {
        continue;
      }
      if (tokenType == null) {
        return this.getNextToken();
      }
      return {
        type: tokenType,
        value: tokenValue,
      };
    }

    throw new SyntaxError(`Unexpected token: "${string[0]}"`);
  };

  private match = (regexp: RegExp, string: string) => {
    const matched = regexp.exec(string);
    if (matched == null) {
      return null;
    }
    this.cursor += matched[0].length;
    return matched[0];
  };
}
