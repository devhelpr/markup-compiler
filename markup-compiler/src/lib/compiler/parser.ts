import {
  IASTNode,
  IASTTextNode,
  IASTTree,
  IPropertyValue,
} from '../interfaces/ast';
import { Body } from './constants';
import { Tokenizer } from './tokenizer';

interface ITagNode {
  properties: IPropertyValue[];
  tagName: string;
}
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
      return this.getMarkup() as unknown as IASTTree;
    }
    return false;
  };
  /*
      <div>
        <div>
          <div>test</div>
          <div>test</div>
        </div>
        <p>test</p>
      </div>

      <div>test</div>

      <div>
        <div>test</div>
      </div>

      <div>
        <div>test</div>
        <div>test</div>
      </div>

  */

  private getMarkup = (
    tagName?: string,
    level?: number
  ): IASTNode[] | IASTTree | IASTTextNode | false => {
    if (!this._lookahead) {
      return false;
    }
    const tagStack: ITagNode[] = [];
    let currentTagName = tagName || '';
    let nodes: (IASTNode | IASTTextNode)[] = [];
    let quit = false;
    while (
      this._lookahead &&
      (this._lookahead.type === '<' || this._lookahead.type === '</') &&
      !quit
    ) {
      if (this._lookahead.type === '<') {
        // <

        this._eat('<');
        const tagName = this._lookahead.value;
        currentTagName = tagName;

        this._eat('IDENTIFIER');
        const properties: IPropertyValue[] = [];
        while (this._lookahead && this._lookahead.type === 'IDENTIFIER') {
          const propertyName = this._lookahead.value;
          this._eat('IDENTIFIER');
          this._eat('=');
          if (this._lookahead.type === 'STRING') {
            const value = this._lookahead.value;
            this._eat('STRING');
            properties.push({ propertyName, value });
          } else {
            throw new SyntaxError(
              `Unexpected token: "${this._lookahead.value}", expected: "STRING".`
            );
          }
        }
        tagStack.push({ tagName, properties });
        this._eat('>', ['TEXT', '</', '<', null] as (string | null)[]);

        if (this._lookahead.type === 'TEXT') {
          console.log('TEXT', currentTagName, this._lookahead.value);
          nodes.push({
            type: 'TEXT',
            tagName: currentTagName,
            value: this._lookahead.value,
          });
          this._eat('TEXT');

          this._eat('</');
          const endTagName = this._lookahead.value;
          const poppedtag = tagStack.pop();
          if (poppedtag === undefined || poppedtag.tagName !== endTagName) {
            throw new SyntaxError(
              `Unexpected token: "${endTagName}", expected: "${currentTagName}".`
            );
          }
          this._eat('IDENTIFIER');
          this._eat('>');
          if (tagStack.length === 0) {
            quit = true;
            if (nodes.length === 1 && nodes[0].type === 'TEXT') {
              return {
                type: 'Markup',
                tagName: poppedtag.tagName,
                properties: poppedtag.properties,
                value: (nodes[0] as unknown as IASTTextNode).value,
              };
            } else {
              return {
                type: 'Markup',
                tagName: poppedtag.tagName,
                properties: poppedtag.properties,
                body: nodes,
              };
            }
          }
        } else if (this._lookahead.type === '<') {
          const markup = this.getMarkup(currentTagName, level ? level + 1 : 1);
          if (markup !== false) {
            if (Array.isArray(markup)) {
              console.log(markup);
              nodes = [...nodes, ...markup];
            } else {
              console.log(markup);
              nodes.push(markup);
            }
          }
        }
      } else {
        this._eat('</');
        const endTagName = this._lookahead.value;
        const poppedtag = tagStack.pop();
        if (poppedtag === undefined || poppedtag.tagName !== endTagName) {
          throw new SyntaxError(
            `Unexpected token: "${endTagName}", expected: "${poppedtag}".`
          );
        }
        this._eat('IDENTIFIER');
        this._eat('>');
        if (tagStack.length === 0) {
          quit = true;
          if (nodes.length === 1 && nodes[0].type === 'TEXT') {
            return {
              type: 'Markup',
              tagName: poppedtag.tagName,
              properties: poppedtag.properties,
              value: (nodes[0] as unknown as IASTTextNode).value,
            };
          } else {
            return {
              type: 'Markup',
              tagName: poppedtag.tagName,
              properties: poppedtag.properties,
              body: nodes,
            };
          }
        }
      }
    }
    if (tagStack.length > 0) {
      throw new SyntaxError(
        `Unexpected items still on stack: ${tagStack.length}.`
      );
    }
    return nodes;
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
