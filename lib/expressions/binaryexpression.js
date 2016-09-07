"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var expression_1 = require('./expression');
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
})(exports.BinaryOperatorType || (exports.BinaryOperatorType = {}));
var BinaryOperatorType = exports.BinaryOperatorType;
var BinaryExpression = (function (_super) {
    __extends(BinaryExpression, _super);
    function BinaryExpression(operator, left, right) {
        _super.call(this, expression_1.ExpressionType.Binary);
        this.operator = operator;
        this.left = left;
        this.right = right;
    }
    return BinaryExpression;
}(expression_1.Expression));
exports.BinaryExpression = BinaryExpression;
//# sourceMappingURL=binaryexpression.js.map