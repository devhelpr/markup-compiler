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
  });

  it('should not return valid ast trees', () => {
    expect(compileMarkup('<markup></test>')).toBeFalsy();
    expect(compileMarkup('<123markup></123markup>')).toBeFalsy();
    expect(compileMarkup('<markup><test></test>')).toBeFalsy();
    expect(compileMarkup('<markup><test>hello')).toBeFalsy();
    expect(compileMarkup('<markup><test>123hello')).toBeFalsy();
  });
});
