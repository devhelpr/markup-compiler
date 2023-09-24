import { compileMarkup } from './markup-compiler';

describe('MarkupCompiler', () => {
  it('should return valid ast trees', () => {
    expect(compileMarkup('<markup><test></test></markup>')).toBeTruthy();
    expect(compileMarkup('<markup><test>hello</test></markup>')).toBeTruthy();
    expect(
      compileMarkup('<markup><test>123hello</test></markup>')
    ).toBeTruthy();
    expect(
      compileMarkup(`
      <markup>
        <test>123hello</test>
      </markup>`)
    ).toBeTruthy();

    expect(
      compileMarkup(`
      <markup>
        <test>123hello</test>
        <abcd>dit is een test</abcd>
      </markup>`)
    ).toBeTruthy();

    expect(
      compileMarkup(`
      <div>
        <h2>123hello</h2>
        <p>dit is een test</p>
      </div>`)
    ).toBeTruthy();

    expect(
      compileMarkup(`
      <div><div><div><div><h2>TITLE</h2><p>subtitle</p></div></div></div></div>`)
    ).toBeTruthy();

    expect(
      compileMarkup(`
      <div>
        <h2 test="hello">123hello</h2>
        <p>dit is een test</p>
      </div>`)
    ).toBeTruthy();
  });

  it('should not return valid ast trees', () => {
    expect(() => compileMarkup('<markup></test>')).toThrow();
    expect(() => compileMarkup('<123markup></123markup>')).toThrow();
    expect(() => compileMarkup('<markup><test></test>')).toThrow();
    expect(() => compileMarkup('<markup><test>hello')).toThrow();
    expect(() => compileMarkup('<markup><test>123hello')).toThrow();
  });

  it('should return valid ast tree', () => {
    const ast = compileMarkup('<markup><test>hello</test></markup>');
    expect(ast).toBeTruthy();
    if (
      ast &&
      ast.body.body &&
      ast.body.body.length === 1 &&
      ast.body.body[0].body &&
      ast.body.body[0].body.length === 1
    ) {
      expect(ast.body.tagName).toBe('markup');
      expect(ast.body.body[0].tagName).toBe('test');
      expect(ast.body.body[0].body[0].value).toBe('hello');
    } else {
      expect(true).toBe(false);
    }
  });

  it('should return valid ast tree with a property', () => {
    const ast = compileMarkup(`<markup abc="def">hello</markup>`);
    expect(ast).toBeTruthy();
    if (
      ast &&
      ast.body &&
      ast.body.properties &&
      ast.body.properties.length === 1
    ) {
      expect(ast.body.tagName).toBe('markup');
      expect(ast.body.properties[0].propertyName).toBe('abc');
      expect(ast.body.properties[0].value).toBe('def');
    } else {
      expect(true).toBe(false);
    }
  });

  it('should return valid ast tree with an expression', () => {
    const ast = compileMarkup(`<markup>{hello}</markup>`);
    expect(ast).toBeTruthy();
    if (ast && ast.body.body && ast.body.body.length === 1) {
      expect(ast.body.tagName).toBe('markup');
      expect(ast.body.body[0].type).toBe('EXPRESSION');
      expect(ast.body.body[0].value).toBe('hello');
    } else {
      expect(true).toBe(false);
    }
  });

  it('shouldnt return valid ast tree when not starting with a tag', () => {
    const ast = compileMarkup(`test<markup>test</markup>`);
    expect(ast).toBeFalsy();
  });

  it('should return valid ast tree when random tokens after closing tag', () => {
    const ast = compileMarkup(`<markup>test</markup>test`);
    expect(ast).toBeTruthy();
  });
});

/*
  <for:each items={list} as="item">
    <div>{listItem}</div>
  </for:each>

  compileMarkup(html, list)
  
  
*/
