// eslint-disable-next-line @typescript-eslint/no-unused-vars

import { compileMarkup } from '@devhelpr/markup-compiler';
import { useEffect, useState } from 'react';

export function App() {
  const [result, setResult] = useState<string>('');
  useEffect(() => {
    const ast = compileMarkup(
      `<markup>
      <test>123hello</test>
      <abcd></abcd>
    </markup>`
    );
    console.log('ast', ast);
    if (ast) {
      setResult(ast.type);
    } else {
      setResult('error parsing');
    }
  }, []);
  return <>{result.toString()}</>;
}

export default App;
