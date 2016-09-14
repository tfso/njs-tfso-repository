"use strict";
const expression_1 = require('./expression');
class MemberExpression extends expression_1.Expression {
    constructor(object, property) {
        super(expression_1.ExpressionType.Member);
        this.object = object;
        this.property = property;
    }
}
exports.MemberExpression = MemberExpression;
//# sourceMappingURL=memberexpression.js.map