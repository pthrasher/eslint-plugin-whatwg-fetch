const rule = require("../../../lib/rules/uppercase-method");
const RuleTester = require("eslint").RuleTester;
const _ = require('lodash');
    
function makeErrorMessage(method) {
  return `${method} should be ${method.toUpperCase()}`;
}

function simpleTestCase(method) {
  return `fetch('foo', {method:'${method}'});`;
}

function advancedTestCase(method) {
  return `
  function myFunc() {
    const opts = {
      method: '${method}'
    };
    
    fetch('foo', opts);
  }
  myFunc();
  `;
}

function makeValidTestCaseSet(method) {
  return [
    simpleTestCase(method),
    advancedTestCase(method),
  ];
}

function makeInvalidTestCaseSet(invalidMethod) {
  const errMsg = makeErrorMessage(invalidMethod);
  return [
    {
      code: simpleTestCase(invalidMethod),
      errors: [ errMsg ],
      output: simpleTestCase(invalidMethod.toUpperCase()),
    },
    {
      code: advancedTestCase(invalidMethod),
      errors: [ errMsg ],
      output: advancedTestCase(invalidMethod.toUpperCase()),
    },
  ];
}

const invalidMethods = [
  'get',
  'head',
  'POsT',
  'PUt',
  'DelETE',
  'trace',
  'Options',
  'Connect',
  'patch',
  'chickeN',
  'kALE',
  'bEEf',
];

const validMethods = invalidMethods.map(m => m.toUpperCase());


const ruleTester = new RuleTester({
  "parser": "babel-eslint",
  "parserOptions": {
    "ecmaVersion": 7,
    "ecmaFeatures": {
      "experimentalObjectRestSpread": true,
      "jsx": true
    },
  }
});

ruleTester.run("uppercase-method", rule, {
  valid: _.flatten(validMethods.map(makeValidTestCaseSet)),
  invalid: _.flatten(invalidMethods.map(makeInvalidTestCaseSet)),
});