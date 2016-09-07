"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var expression_1 = require('./expression');
var LiteralExpression = (function (_super) {
    __extends(LiteralExpression, _super);
    function LiteralExpression(value) {
        _super.call(this, expression_1.ExpressionType.Literal);
        this.value = value;
    }
    return LiteralExpression;
}(expression_1.Expression));
exports.LiteralExpression = LiteralExpression;
//# sourceMappingURL=literalexpression.js.map