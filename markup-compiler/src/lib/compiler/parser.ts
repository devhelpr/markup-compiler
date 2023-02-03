import { IASTTree, IASTTreeNode, IASTTreeProperty } from '../interfaces/ast';
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

  /*
  1. search for < open tag token
    .. start parsing markup
  */

  parse = (expression: string): IASTTree | false => {
    this._string = expression;
    this._isEndOfCode = false;

    if (this._tokenizer) {
      this._tokenizer.init(this._string);
      this._lookahead = this._tokenizer.getNextToken();
      if (this._lookahead && this._lookahead.type === '<') {
        const node = this.parseMarkup();
        if (node) {
          return {
            body: node,
          };
        }
      }
    }
    return false;
  };

  /*
    1. parse open tag (identifier, optional properties and closing >)
        parse children
    3. assign children to body
    4. return ASTTreeNode
  */

  parseMarkup = (): IASTTreeNode => {
    if (this._lookahead && this._lookahead.type === '<') {
      this._eat('<');
      if (this._lookahead && this._lookahead.type === 'IDENTIFIER') {
        const tagName = this._lookahead.value;
        this._eat('IDENTIFIER');
        const properties = this.parseProperties();
        if (this._lookahead && this._lookahead.type === '>') {
          this._eat('>', ['TEXT', '</', '<', '{', '}', null] as (
            | string
            | null
          )[]);

          const childNodes = this.parseMarkupChildren();
          if (childNodes) {
            this._eat('</');
            const closingTagName = this._lookahead.value;
            this._eat('IDENTIFIER');
            this._eat('>');
            if (tagName !== closingTagName) {
              throw new Error(
                `Invalid markup, expected closing tag for ${tagName}, found ${closingTagName}`
              );
            }
            return {
              type: 'Markup',
              tagName,
              properties,
              body: childNodes,
            };
          }
        } else {
          throw new Error('Invalid markup, expected closing >');
        }
      } else {
        throw new Error('Invalid markup, expected identifier');
      }
    }
    throw new Error('Invalid markup, expected opening >');
  };

  parseProperties = (): IASTTreeProperty[] => {
    const properties: IASTTreeProperty[] = [];
    while (this._lookahead && this._lookahead.type === 'IDENTIFIER') {
      const propertyName = this._lookahead.value;
      this._eat('IDENTIFIER');
      this._eat('=');
      if (this._lookahead.type === 'STRING') {
        const value = this._lookahead.value.slice(1, -1);
        this._eat('STRING');
        properties.push({ propertyName, value });
      } else {
        throw new SyntaxError(
          `Unexpected token while parsing property: "${this._lookahead.value}", expected: "STRING".`
        );
      }
    }
    return properties;
  };

  /*
     1. parse children
      .. create childrenNodes : IASTTreeNode[]

      .. if text found, add to children
      .. if markup (< open tag found) found, recurse and add result to children
      .. if expression found (starts with { followed by.. TEXT ... and closing}), add to children
      .. if closing tag </ found and identifier is parent tag, return children
      .. continue until closing tag found and identifier is parent tags

  */
  parseMarkupChildren = (): IASTTreeNode[] => {
    const nodes: IASTTreeNode[] = [];
    while (this._lookahead && this._lookahead.type !== '</') {
      if (this._lookahead.type === 'TEXT') {
        nodes.push({
          type: 'TEXT',
          tagName: '',
          value: this._lookahead.value,
        });
        this._eat('TEXT');
      } else if (this._lookahead.type === '<') {
        nodes.push(this.parseMarkup());
      } else if (this._lookahead.type === '{') {
        nodes.push(this.parseExpression());
      } else {
        throw new Error('Invalid markup, unexpected token');
      }
    }
    return nodes;
  };

  parseExpression = (): IASTTreeNode => {
    this._eat('{', ['TEXT']);

    const expression = this._lookahead.value;

    this._eat('TEXT');
    this._eat('}', ['TEXT', '</', '<', '{', '}', null] as (string | null)[]);
    return {
      type: 'EXPRESSION',
      tagName: '',
      value: expression,
    };
  };

  _isEndOfCode = false;
  _eat = (tokenType: string, specificNextToken?: (string | null)[]) => {
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
