"use strict";
const expression_1 = require('./expression');
(function (LogicalOperatorType) {
    LogicalOperatorType[LogicalOperatorType["And"] = 0] = "And";
    LogicalOperatorType[LogicalOperatorType["Or"] = 1] = "Or";
    LogicalOperatorType[LogicalOperatorType["NotEqual"] = 2] = "NotEqual";
    LogicalOperatorType[LogicalOperatorType["LesserOrEqual"] = 3] = "LesserOrEqual";
    LogicalOperatorType[LogicalOperatorType["GreaterOrEqual"] = 4] = "GreaterOrEqual";
    LogicalOperatorType[LogicalOperatorType["Lesser"] = 5] = "Lesser";
    LogicalOperatorType[LogicalOperatorType["Greater"] = 6] = "Greater";
    LogicalOperatorType[LogicalOperatorType["Equal"] = 7] = "Equal"; // ==
})(exports.LogicalOperatorType || (exports.LogicalOperatorType = {}));
var LogicalOperatorType = exports.LogicalOperatorType;
class LogicalExpression extends expression_1.Expression {
    constructor(operator, left, right) {
        super(expression_1.ExpressionType.Logical);
        this.operator = operator;
        this.left = left;
        this.right = right;
    }
}
exports.LogicalExpression = LogicalExpression;
//# sourceMappingURL=logicalexpression.js.map