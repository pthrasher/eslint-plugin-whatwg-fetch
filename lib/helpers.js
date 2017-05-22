const util = require('util');
const _ = require('lodash');

function log(obj) {
  console.log(util.inspect(obj, {
    depth: 5,
    colors: true,
    breakLength: 2,
  }));
}

function getPropertyNode(objectExpressionNode) {
  if (objectExpressionNode == null) return null;
  const props = (objectExpressionNode.properties || []);
  return _.find(props, p => {
    if (_.get(p, 'key.name') !== 'method') return false;
    if (_.get(p, 'value.type') !== 'Literal') return false;
    return p
  }) || null;
}

function getVariableInScope(name, context) {
  const vars = (context.getScope().variables || []);
  return _.get(_.find(vars, v => {
    if (!v || v.name !== name) return false;
    return _.get(v, 'defs[0].node.init', false);
  }), 'defs[0].node.init');
}

function getOptionsArgNode(callExpressionNode) {
  return _.get(callExpressionNode, 'arguments[1]', null);
}

function resolveObjectExpression(optionsArgNode, context) {
  if (!optionsArgNode) return null;
  if (optionsArgNode.type === 'ObjectExpression') {
    return optionsArgNode;
  } else if (optionsArgNode.type === 'Identifier') {
    return getVariableInScope(optionsArgNode.name, context)
  }
  
  return null;
}

function getFetchMethodPropertyNode(fetchNode, context) {
  const optionsArgNode = getOptionsArgNode(fetchNode);
  
  // No options specified.
  if (optionsArgNode == null) return null;
  
  const objectExpressionNode = resolveObjectExpression(optionsArgNode, context);
  
  // Can't resolve the node
  if (objectExpressionNode == null) return null;
  
  return getPropertyNode(objectExpressionNode)
}

module.exports = {
  getVariableInScope,
  getOptionsArgNode,
  resolveObjectExpression,
  getPropertyNode,
  getFetchMethodPropertyNode,
  log,
}
