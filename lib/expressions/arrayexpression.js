"use strict";
const expression_1 = require('./expression');
class ArrayExpression extends expression_1.Expression {
    constructor(elements) {
        super(expression_1.ExpressionType.Array);
        this.elements = elements;
    }
}
exports.ArrayExpression = ArrayExpression;
//# sourceMappingURL=arrayexpression.js.map