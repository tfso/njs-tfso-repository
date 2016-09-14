"use strict";
const expression_1 = require('./expression');
class IdentifierExpression extends expression_1.Expression {
    constructor(name) {
        super(expression_1.ExpressionType.Identifier);
        this.name = name;
    }
}
exports.IdentifierExpression = IdentifierExpression;
//# sourceMappingURL=identifierexpression.js.map