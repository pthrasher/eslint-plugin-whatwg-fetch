# eslint-plugin-whatwg-fetch

rules related to whatwg-fetch

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-whatwg-fetch`:

```
$ npm install eslint-plugin-whatwg-fetch --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-whatwg-fetch` globally.

## Usage

Add `whatwg-fetch` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "whatwg-fetch"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "whatwg-fetch/valid-method": 2,
        "whatwg-fetch/uppercase-method": 2
    }
}
```





