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
  [/^<\//, '</'],
  [/^</, '<'],
  [/^>/, '>'],
  [/^\//, '/'],

  // identifiers
  [/^[a-z,A-Z]\w+/, 'IDENTIFIER'],

  // strings
  [/^"[^"]*"/, 'STRING'],
  [/^'[^']*'/, 'STRING'],
  [/^(\w| |^<>(<\/))+/, 'TEXT'],
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
  getNextToken = (specificNextToken?: string[]): IToken | null => {
    if (!this.hasMoreTokens()) {
      return null;
    }
    const string = this.string.slice(this.cursor);

    for (const [regexp, tokenType] of Specifcation) {
      if (specificNextToken && specificNextToken.indexOf(tokenType) === -1) {
        continue;
      }
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
