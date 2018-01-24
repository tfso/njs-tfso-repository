"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ibinaryexpression_1 = require("./interfaces/ibinaryexpression");
exports.BinaryOperatorType = ibinaryexpression_1.BinaryOperatorType;
const expression_1 = require("./expression");
class BinaryExpression extends expression_1.Expression {
    constructor(operator, left, right) {
        super(expression_1.ExpressionType.Binary);
        this.operator = operator;
        this.left = left;
        this.right = right;
    }
    equal(expression) {
        if (this.operator == expression.operator && this.left.equal(expression.left) && this.right.equal(expression.right))
            return true;
        if (this.operator == expression.operator) {
            switch (this.operator) {
                case ibinaryexpression_1.BinaryOperatorType.Addition:
                case ibinaryexpression_1.BinaryOperatorType.Multiplication:
                case ibinaryexpression_1.BinaryOperatorType.ExclusiveOr:
                case ibinaryexpression_1.BinaryOperatorType.And:
                case ibinaryexpression_1.BinaryOperatorType.Or:
                    return this.left.equal(expression.right) && this.right.equal(expression.left);
            }
        }
        return false;
    }
}
exports.BinaryExpression = BinaryExpression;
//# sourceMappingURL=binaryexpression.js.map