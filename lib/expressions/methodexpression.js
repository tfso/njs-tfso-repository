"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var expression_1 = require('./expression');
var MethodExpression = (function (_super) {
    __extends(MethodExpression, _super);
    function MethodExpression(name, parameters, caller) {
        _super.call(this, expression_1.ExpressionType.Method);
        this.name = name;
        this.parameters = parameters;
        this.caller = caller;
    }
    return MethodExpression;
}(expression_1.Expression));
exports.MethodExpression = MethodExpression;
//# sourceMappingURL=methodexpression.js.map