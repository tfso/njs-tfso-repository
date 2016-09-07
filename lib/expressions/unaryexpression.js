"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var expression_1 = require('./expression');
(function (UnaryAffixType) {
    UnaryAffixType[UnaryAffixType["Postfix"] = 0] = "Postfix";
    UnaryAffixType[UnaryAffixType["Prefix"] = 1] = "Prefix";
})(exports.UnaryAffixType || (exports.UnaryAffixType = {}));
var UnaryAffixType = exports.UnaryAffixType;
(function (UnaryOperatorType) {
    UnaryOperatorType[UnaryOperatorType["Increment"] = 0] = "Increment";
    UnaryOperatorType[UnaryOperatorType["Decrement"] = 1] = "Decrement";
    UnaryOperatorType[UnaryOperatorType["Invert"] = 2] = "Invert";
    UnaryOperatorType[UnaryOperatorType["Negative"] = 3] = "Negative";
    UnaryOperatorType[UnaryOperatorType["Positive"] = 4] = "Positive";
    UnaryOperatorType[UnaryOperatorType["Complement"] = 5] = "Complement"; // ~
})(exports.UnaryOperatorType || (exports.UnaryOperatorType = {}));
var UnaryOperatorType = exports.UnaryOperatorType;
var UnaryExpression = (function (_super) {
    __extends(UnaryExpression, _super);
    function UnaryExpression(operator, affix, argument) {
        _super.call(this, expression_1.ExpressionType.Unary);
        this.operator = operator;
        this.affix = affix;
        this.argument = argument;
    }
    return UnaryExpression;
}(expression_1.Expression));
exports.UnaryExpression = UnaryExpression;
//# sourceMappingURL=unaryexpression.js.map