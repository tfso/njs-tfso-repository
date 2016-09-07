"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var expression_1 = require('./expression');
var IdentifierExpression = (function (_super) {
    __extends(IdentifierExpression, _super);
    function IdentifierExpression(name) {
        _super.call(this, expression_1.ExpressionType.Identifier);
        this.name = name;
    }
    return IdentifierExpression;
}(expression_1.Expression));
exports.IdentifierExpression = IdentifierExpression;
//# sourceMappingURL=identifierexpression.js.map