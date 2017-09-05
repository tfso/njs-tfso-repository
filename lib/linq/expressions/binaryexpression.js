"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expression_1 = require("./expression");
var BinaryOperatorType;
(function (BinaryOperatorType) {
    BinaryOperatorType[BinaryOperatorType["Subtraction"] = 0] = "Subtraction";
    BinaryOperatorType[BinaryOperatorType["Addition"] = 1] = "Addition";
    BinaryOperatorType[BinaryOperatorType["Division"] = 2] = "Division";
    BinaryOperatorType[BinaryOperatorType["Multiplication"] = 3] = "Multiplication";
    BinaryOperatorType[BinaryOperatorType["Modulus"] = 4] = "Modulus";
    BinaryOperatorType[BinaryOperatorType["And"] = 5] = "And";
    BinaryOperatorType[BinaryOperatorType["Or"] = 6] = "Or";
    BinaryOperatorType[BinaryOperatorType["ExclusiveOr"] = 7] = "ExclusiveOr";
    BinaryOperatorType[BinaryOperatorType["LeftShift"] = 8] = "LeftShift";
    BinaryOperatorType[BinaryOperatorType["RightShift"] = 9] = "RightShift";
})(BinaryOperatorType = exports.BinaryOperatorType || (exports.BinaryOperatorType = {}));
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
                case BinaryOperatorType.Addition:
                case BinaryOperatorType.Multiplication:
                case BinaryOperatorType.ExclusiveOr:
                case BinaryOperatorType.And:
                case BinaryOperatorType.Or:
                    return this.left.equal(expression.right) && this.right.equal(expression.left);
            }
        }
        return false;
    }
}
exports.BinaryExpression = BinaryExpression;
//# sourceMappingURL=binaryexpression.js.map