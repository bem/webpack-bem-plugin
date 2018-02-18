# Webpack BEM plugin

Simple steps to use [BEM](https://en.bem.info/methodology/quick-start/) in your [React](https://reactjs.org/) project:

1. Write components as [bem-react-core](https://github.com/bem/bem-react-core) declarations
2. Use [bem-import-notation](https://github.com/bem/bem-sdk/tree/master/packages/import-notation#notation) to `import` or `require` components
3. Define project structure in `bemrc` config file
4. Build project using [webpack](https://github.com/webpack/webpack) and **[Webpack-BEM-plugin](https://github.com/bem/webpack-bem-plugin)**
5. Enjoy :wink:

## Examples

> npm run build-examples

Each example has its `public/*.html`.

* Char table ([source](https://github.com/bem/webpack-bem-plugin/tree/master/examples/char-table)) `js` `no-sets` `no-babel`
* Few components ([source](https://github.com/bem/webpack-bem-plugin/tree/master/examples/few-componetns)) `js/css` `sets` `babel`
* Promo ([source](https://github.com/bem/webpack-bem-plugin/tree/master/examples/promo)) `js/css` `sets` `library` `babel`

## Plugin options

|Name|Type|Description|
|----|----|-----------|
| **`[techs]`** | `{String[]}` | List of techs in project to build. Default is `['js']` |
| **`[techMap]`** | `{Object}` | Maps techs to actual file extensions. Tech with no mapping treated as file extension as is. Example of custom mapping: `{ js: 'react.js' }` |
| **`[libs]`** | `{Object}` | Stores inline `bemrc` configurations for some libraries. Use when a library has not its `bemrc` file and adding it in library codebase is complicated |

## Run tests

> npm test

## Known issues

* [Small tests](https://github.com/bem/webpack-bem-plugin/issues/3)
* [Flat](https://en.bem.info/methodology/filestructure/#flat)-scheme [is not supported](https://github.com/bem/webpack-bem-plugin/issues/6))
* [No windows support](https://github.com/bem/webpack-bem-plugin/issues/4)
* [No i18n support](https://github.com/bem/webpack-bem-plugin/issues/7)

## License

Code and documentation copyright 2018 YANDEX LLC. Code released under the [Mozilla Public License 2.0](LICENSE.txt).
