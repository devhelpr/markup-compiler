// eslint-disable-next-line @typescript-eslint/no-unused-vars

import { compileMarkup } from '@devhelpr/markup-compiler';
import { useEffect, useState } from 'react';

export function App() {
  const [result, setResult] = useState<string>('');
  useEffect(() => {
    // const ast = compileMarkup(`
    // <div></div>`);

    // const ast = compileMarkup(`
    // <div>test</div>`);

    // const ast = compileMarkup(`
    // <div>
    //   <div>
    //     <div>
    //       <div4>
    //         <div3>
    //           <p>hello</p>
    //         </div3>
    //         <h2>TITLE</h2>
    //         <p2>subtitle</p2>
    //       </div4>
    //     </div>
    //   </div>
    // </div>`);

    // const ast = compileMarkup(
    //   `<div1><div2><p>hello</p></div2><h2>TITLE</h2></div1>`
    // );

    // const ast = compileMarkup(
    //   `<div class="bg-black" >
    //     <div>
    //       <div>
    //         <div3 style="background: black;">
    //           <p>hello</p>
    //           <div2>
    //             <i>lorem{test}ipsum1</i>
    //             <i>lorem ipsum2</i>
    //           </div2>
    //         </div3>
    //       </div>
    //     </div>
    //   </div>`
    // );

    // const ast = compileMarkup(`<Dropdown>
    //   <Menu>
    //   test
    //     <MenuItem>Do{xyz}Something</MenuItem>
    //     <MenuItem helper={a+b} test="value">test{test}test</MenuItem>
    //     <MenuItem>Do Something Else</MenuItem>
    //   </Menu>
    // </Dropdown>`);
    try {
      const ast = compileMarkup(`<markup></test>`);

      // <div>

      // test test
      //   <p>paragraph</p>
      // </div>`);

      if (ast) {
        setResult(`${ast && JSON.stringify(ast, null, 2)}`);
      }
    } catch {
      setResult('error parsing');
    }
  }, []);
  return <pre>{result.toString()}</pre>;
}

export default App;
