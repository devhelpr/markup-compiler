# MarkupCompiler


## Publishing


... manually increase version or .. npm version ...
yarn nx build @devhelpr/markup-compiler

cd dist/markup-compiler
npm publish --access public
(login to npm first.. "npm login")


# test library

npm run test @devhelpr/markup-compiler


# TODO

- [ ] combining markup/jsx parser and expression-compier
        .. in such a way that expressions in markup can contain { } without escaping them
        .. the expression compiler should be in the lead .. and markup parsing should be optional!
     
- [ ] improved unit testing for the parsing result/ast...
- [ ] support for self-closing tags like <br/> or <br />
- [ ] support for other characters in text like ! or ? etc...
- [ ] full support for jsx spec: https://facebook.github.io/jsx/

