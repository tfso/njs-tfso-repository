"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expression_1 = require("./expression");
var LogicalOperatorType;
(function (LogicalOperatorType) {
    LogicalOperatorType[LogicalOperatorType["And"] = 0] = "And";
    LogicalOperatorType[LogicalOperatorType["Or"] = 1] = "Or";
    LogicalOperatorType[LogicalOperatorType["NotEqual"] = 2] = "NotEqual";
    LogicalOperatorType[LogicalOperatorType["LesserOrEqual"] = 3] = "LesserOrEqual";
    LogicalOperatorType[LogicalOperatorType["GreaterOrEqual"] = 4] = "GreaterOrEqual";
    LogicalOperatorType[LogicalOperatorType["Lesser"] = 5] = "Lesser";
    LogicalOperatorType[LogicalOperatorType["Greater"] = 6] = "Greater";
    LogicalOperatorType[LogicalOperatorType["Equal"] = 7] = "Equal"; // ==
})(LogicalOperatorType = exports.LogicalOperatorType || (exports.LogicalOperatorType = {}));
class LogicalExpression extends expression_1.Expression {
    constructor(operator, left, right) {
        super(expression_1.ExpressionType.Logical);
        this.operator = operator;
        this.left = left;
        this.right = right;
    }
    equal(expression) {
        if (this.type == expression.type && this.operator == expression.operator && this.left.equal(expression.left) && this.right.equal(expression.right))
            return true;
        switch (this.operator) {
            case LogicalOperatorType.And:
            case LogicalOperatorType.Or:
            case LogicalOperatorType.NotEqual:
            case LogicalOperatorType.Equal:
                return this.operator == expression.operator && this.left.equal(expression.right) && this.right.equal(expression.left);
            case LogicalOperatorType.Greater:// 5 > 2 == 2 < 5
                return expression.operator == LogicalOperatorType.Lesser && this.left.equal(expression.right) && this.right.equal(expression.left);
            case LogicalOperatorType.GreaterOrEqual:// 5 >= 2 == 2 <= 5
                return expression.operator == LogicalOperatorType.LesserOrEqual && this.left.equal(expression.right) && this.right.equal(expression.left);
            case LogicalOperatorType.Lesser:// 5 < 2 == 2 > 5
                return expression.operator == LogicalOperatorType.Greater && this.left.equal(expression.right) && this.right.equal(expression.left);
            case LogicalOperatorType.LesserOrEqual:// 5 <= 2 == 2 >= 5
                return expression.operator == LogicalOperatorType.GreaterOrEqual && this.left.equal(expression.right) && this.right.equal(expression.left);
        }
        return false;
    }
}
exports.LogicalExpression = LogicalExpression;
//# sourceMappingURL=logicalexpression.js.map