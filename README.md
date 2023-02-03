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

- [ ]BUG - "text text" with whitespace is split when reading as child nodes.
            ... removing the null includes enters in the text value

- [ ] support for properties where the value is an expression like: {...}
- [ ] improved unit testing for the parsing result/ast...
- [ ] support for self-closing tags like <br/> or <br />
- [ ] support for other characters in text like ! or ? etc...
- [ ] full support for jsx spec: https://facebook.github.io/jsx/