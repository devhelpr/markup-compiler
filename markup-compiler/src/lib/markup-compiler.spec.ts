
import { compileMarkup } from './markup-compiler';

describe('MarkupCompiler', () => {
  it('should return an ast tree', () => {
   
    expect(compileMarkup("<markup><test></test></markup>")).toBeTruthy();
  });

  it('should return an ast tree', () => {
   
    expect(compileMarkup("<markup><test>hello</test></markup>")).toBeTruthy();
  });
});
