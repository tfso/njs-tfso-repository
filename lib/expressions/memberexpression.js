"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var expression_1 = require('./expression');
var MemberExpression = (function (_super) {
    __extends(MemberExpression, _super);
    function MemberExpression(object, property) {
        _super.call(this, expression_1.ExpressionType.Member);
        this.object = object;
        this.property = property;
    }
    return MemberExpression;
}(expression_1.Expression));
exports.MemberExpression = MemberExpression;
//# sourceMappingURL=memberexpression.js.map