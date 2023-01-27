// eslint-disable-next-line @typescript-eslint/no-unused-vars

import { compileMarkup } from '@devhelpr/markup-compiler';
import { useEffect, useState } from 'react';

export function App() {
  const [result, setResult] = useState<string>('');
  useEffect(() => {
    // `<div><div><div><div><div><p>hello</p></div><h2>TITLE</h2><p>subtitle</p></div></div></div></div>`
    // `<div1><div2><p>hello</p></div2><h2>TITLE</h2></div1>`
    const ast = compileMarkup(
      `<div>
        <div>
          <div>
            <div>
              <div>
                <p>hello</p>
              </div>
              <h2>TITLE</h2>
              <p>subtitle</p>
            </div>
          </div>
        </div>
      </div>`
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
