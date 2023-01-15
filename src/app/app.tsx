// eslint-disable-next-line @typescript-eslint/no-unused-vars

import { compileMarkup } from "@devhelpr/markup-compiler";
import { useEffect, useState } from "react";

export function App() {
  const [result, setResult] = useState<string>("");
  useEffect(() => {
    const ast = compileMarkup("<hello>123test</hello>");
    if (ast) {
      setResult(ast.type);
    }
  },[])
  return (
    <>
    {result.toString()}
    </>
  );
}

export default App;
