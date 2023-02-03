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
- [ ] support for self-closing tags like <br/> or <br />
- [ ] support for other characters in text like ! or ? etc...
- [ ] full support for jsx spec: https://facebook.github.io/jsx/