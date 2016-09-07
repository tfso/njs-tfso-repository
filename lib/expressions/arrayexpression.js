"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var expression_1 = require('./expression');
var ArrayExpression = (function (_super) {
    __extends(ArrayExpression, _super);
    function ArrayExpression(elements) {
        _super.call(this, expression_1.ExpressionType.Array);
        this.elements = elements;
    }
    return ArrayExpression;
}(expression_1.Expression));
exports.ArrayExpression = ArrayExpression;
//# sourceMappingURL=arrayexpression.js.map