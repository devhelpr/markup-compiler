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
  });

  it('should not return valid ast trees', () => {
    expect(compileMarkup('<markup></test>')).toBeFalsy();
    expect(compileMarkup('<123markup></123markup>')).toBeFalsy();
    expect(compileMarkup('<markup><test></test>')).toBeFalsy();
    expect(compileMarkup('<markup><test>hello')).toBeFalsy();
    expect(compileMarkup('<markup><test>123hello')).toBeFalsy();
  });
});
