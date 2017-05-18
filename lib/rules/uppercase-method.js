const helpers = require('../helpers');
const _ = require('lodash');


module.exports = {
  meta: {
    fixable: 'code',
  },
  
  create(context) {
    return {
      CallExpression(node) {
        if (node.callee.name !== 'fetch') return;
        const methodProperty = helpers.getFetchMethodPropertyNode(node, context);
        
        // can't resolve the property
        if (methodProperty == null) return;
        
        const methodValue = _.get(methodProperty, 'value.value');
        
        if (methodValue == null) return;
          
        if (methodValue.toUpperCase() !== methodValue) {
          context.report({
            message: `${methodValue} should be ${methodValue.toUpperCase()}`,
            node: methodProperty.value,
            fix(fixer) {
              return fixer.replaceText(
                methodProperty.value,
                methodProperty.value.raw.toUpperCase()
              );
            },
          });
        }
      },
    };
  },
};
