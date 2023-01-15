import {
  IASTNode,
  IASTTextNode,
  IASTTree,
} from '../interfaces/ast';
import { Body } from './constants';
import { Tokenizer } from './tokenizer';

export class Parser {
  _string = '';
  _tokenizer: Tokenizer | null = null;
  _lookahead: any = null;

  _currentFunction: string = Body;

  constructor() {
    this._string = '';
    this._tokenizer = new Tokenizer();
  }

  parse = (expression: string): IASTTree | false => {
    this._string = expression;
    this._isEndOfCode = false;

    if (this._tokenizer) {
      this._tokenizer.init(this._string);
      this._lookahead = this._tokenizer.getNextToken();
      return this.getMarkup();
    }
    return false;
  };

  private getMarkup = (): IASTTree | false => {
    if (!this._lookahead) {
      return false;
    }
    this._eat("<");
    const tagName = this._lookahead.value;
    this._eat("IDENTIFIER");
    this._eat(">");
    let body : IASTTree | IASTTextNode | false = false;
    if (this._lookahead.type !== "</") {
      if (this._lookahead.type === "<") {
        body = this.getMarkup();
      } else {
        body = {
          type: "TEXT",
          value : this._lookahead.value
        }
        if (this._lookahead.type === "TEXT") {
          this._eat("TEXT");
        } else {
          this._eat("IDENTIFIER");
        }
      }
    }
    this._eat("</");
    const endTagName = this._lookahead.value;
    if (tagName !== endTagName) {
      throw new SyntaxError(
        `Unexpected token: "${endTagName}", expected: "${tagName}".`
      );
    }
    this._eat("IDENTIFIER");
    this._eat(">");
    return {
      type: 'Markup',
      body
    };
  };



  _isEndOfCode = false;
  _eat = (tokenType: string, ignoreIfEndOfCode = false) => {
    const token = this._lookahead;
    if (token === null) {
      throw new SyntaxError(
        `Unexpected end of input, expected: "${tokenType}".`
      );
    }
    if (token.type !== tokenType) {
      throw new SyntaxError(
        `Unexpected token: "${token.type}", expected: "${tokenType}".`
      );
    }
    if (this._tokenizer && !this._tokenizer.hasMoreTokens()) {
      this._isEndOfCode = true;
    }
    this._lookahead = this._tokenizer && this._tokenizer.getNextToken();
    if (this._tokenizer && !this._tokenizer.hasMoreTokens()) {
      this._isEndOfCode = true;
    }
    return token;
  };
}
