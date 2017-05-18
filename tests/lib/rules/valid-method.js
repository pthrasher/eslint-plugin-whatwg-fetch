const rule = require("../../../lib/rules/valid-method");
const RuleTester = require("eslint").RuleTester;
const _ = require('lodash');
    
function makeErrorMessage(method, closestMatch) {
  const extra = closestMatch == null
    ? ''
    : ` did you mean: '${closestMatch}'?`;
  return `Invalid HTTP method '${method}'${extra}`;
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
  const errMsg = makeErrorMessage(invalidMethod[0], invalidMethod[1]);
  return [
    {
      code: simpleTestCase(invalidMethod[0]),
      errors: [ errMsg ],
    },
    {
      code: advancedTestCase(invalidMethod[0]),
      errors: [ errMsg ],
    },
  ];
}

const invalidMethods = [
  ['CHICKEN', null],
  ['KALE', null],
  ['BEEF', null],
  ['PLUNDER', null],
  ['GEET', 'GET'],
  ['HED', 'HEAD'],
  ['OPTOINS', 'OPTIONS'],
  ['opions', 'OPTIONS'],
  ['puts', 'PUT'],
  ['POTS', 'POST'],
];

const validMethods = [
  'GET',
  'HEAD',
  'POST',
  'PUT',
  'DELETE',
  'TRACE',
  'OPTIONS',
  'CONNECT',
  'PATCH',
];


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

ruleTester.run("valid-method", rule, {
  valid: _.flatten(validMethods.map(makeValidTestCaseSet)),
  invalid: _.flatten(invalidMethods.map(makeInvalidTestCaseSet)),
});