"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var expression_1 = require('./expression');
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
var LogicalExpression = (function (_super) {
    __extends(LogicalExpression, _super);
    function LogicalExpression(operator, left, right) {
        _super.call(this, expression_1.ExpressionType.Logical);
        this.operator = operator;
        this.left = left;
        this.right = right;
    }
    return LogicalExpression;
}(expression_1.Expression));
exports.LogicalExpression = LogicalExpression;
//# sourceMappingURL=logicalexpression.js.map