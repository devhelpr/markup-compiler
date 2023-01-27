// eslint-disable-next-line @typescript-eslint/no-unused-vars

import { compileMarkup } from '@devhelpr/markup-compiler';
import { useEffect, useState } from 'react';

export function App() {
  const [result, setResult] = useState<string>('');
  useEffect(() => {
    const ast = compileMarkup(
      `<div><div><div><div><h2>TITLE</h2><p>subtitle</p></div></div></div></div>`
    );
    console.log('ast', ast);
    if (ast) {
      setResult(JSON.stringify(ast, null, 2));
    } else {
      setResult('error parsing');
    }
  }, []);
  return <pre>{result.toString()}</pre>;
}

export default App;
