"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expression_1 = require("./expression");
class LiteralExpression extends expression_1.Expression {
    constructor(value) {
        super(expression_1.ExpressionType.Literal);
        this.value = value;
    }
    equal(expression) {
        return this.type == expression.type && this.value == expression.value;
    }
}
exports.LiteralExpression = LiteralExpression;
//# sourceMappingURL=literalexpression.js.map