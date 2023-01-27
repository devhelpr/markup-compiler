import { IASTNode, IASTTextNode, IASTTree } from '../interfaces/ast';
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

      this._eat('<');
      const tagName = this._lookahead.value;
      this._eat('IDENTIFIER');
      this._eat('>');

      const body = this.getMarkup();

      this._eat('</');
      const endTagName = this._lookahead.value;
      if (tagName !== endTagName) {
        throw new SyntaxError(
          `Unexpected token: "${endTagName}", expected: "${tagName}".`
        );
      }
      this._eat('IDENTIFIER');
      this._eat('>');

      return {
        type: 'Markup',
        tagName: tagName,
        body,
      };
    }
    return false;
  };

  private getMarkup = (
    tagName?: string,
    level?: number
  ): IASTNode[] | IASTTree | false => {
    if (!this._lookahead) {
      return false;
    }

    let body: IASTNode[] | false = false;
    if (this._lookahead.type === '<') {
      while (this._lookahead && this._lookahead.type === '<') {
        if (!body) {
          body = [];
        }

        this._eat('<');
        const tagName = this._lookahead.value;
        this._eat('IDENTIFIER');
        this._eat('>', ['TEXT', '</', '<']);

        const markupBody = this.getMarkup(tagName, (level ?? 0) + 1);
        //console.log('na this.getMarkup', level, tagName, markupBody);
        this._eat('</');
        const endTagName = this._lookahead.value;
        if (tagName !== endTagName) {
          throw new SyntaxError(
            `Unexpected token: "${endTagName}", expected: "${tagName}".`
          );
        }
        this._eat('IDENTIFIER');
        this._eat('>');
        if (Array.isArray(markupBody)) {
          body = [...body, ...(markupBody as unknown as IASTNode[])];
        } else {
          if (level === undefined) {
            return markupBody as unknown as IASTTree;
          }
          return {
            type: 'Markup',
            tagName: tagName,
            body: markupBody as unknown as IASTNode[] | IASTTree | false,
          } as IASTTree;
        }
      }
      return {
        type: 'Markup',
        tagName: tagName,
        body: body as unknown as IASTNode[] | IASTTree | false,
      } as IASTTree;
    } else {
      if (this._lookahead.type === '</' && tagName) {
        body = [
          {
            type: 'EMPTY',
            tagName: tagName,
          } as IASTNode,
        ];
      } else if (this._lookahead.type === 'TEXT' && tagName) {
        body = [
          {
            type: 'TEXT',
            tagName: tagName,
            value: this._lookahead.value,
          } as IASTTextNode,
        ];

        this._eat('TEXT');
      } else {
        throw new Error(
          `Unexpected end of input, expected: "TEXT" or "IDENTIFIER". received: "${this._lookahead.type}" with tagName ${tagName}.`
        );
      }
    }

    return body;
  };

  _isEndOfCode = false;
  _eat = (tokenType: string, specificNextToken?: string[]) => {
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
    this._lookahead =
      this._tokenizer && this._tokenizer.getNextToken(specificNextToken);
    if (this._tokenizer && !this._tokenizer.hasMoreTokens()) {
      this._isEndOfCode = true;
    }
    return token;
  };
}
