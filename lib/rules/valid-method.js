const helpers = require('../helpers');
const _ = require('lodash');
const Matcher = require('did-you-mean');

const httpMethods = [
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
const validMethods = new Set(httpMethods);

const suggest = new Matcher(httpMethods.join(' '));
suggest.ignoreCase();


module.exports = {
  create(context) {
    return {
      CallExpression(node) {
        if (node.callee.name !== 'fetch') return;
        const methodProperty = helpers.getFetchMethodPropertyNode(node, context);
        
        // can't resolve the property
        if (methodProperty == null) return;
        
        const methodValue = _.get(methodProperty, 'value.value');
        
        if (methodValue == null) return;
        
        if (!validMethods.has(methodValue.toUpperCase())) {
          const closestMatch = suggest.get(methodValue);
          const extra = closestMatch == null
            ? ''
            : ` did you mean: '${closestMatch}'?`;
          context.report({
            message: `Invalid HTTP method '${methodValue}'${extra}`,
            node: methodProperty.value,
          });
        }
      },
    };
  },
};
