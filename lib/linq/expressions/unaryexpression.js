"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expression_1 = require("./expression");
var UnaryAffixType;
(function (UnaryAffixType) {
    UnaryAffixType[UnaryAffixType["Postfix"] = 0] = "Postfix";
    UnaryAffixType[UnaryAffixType["Prefix"] = 1] = "Prefix";
})(UnaryAffixType = exports.UnaryAffixType || (exports.UnaryAffixType = {}));
var UnaryOperatorType;
(function (UnaryOperatorType) {
    UnaryOperatorType[UnaryOperatorType["Increment"] = 0] = "Increment";
    UnaryOperatorType[UnaryOperatorType["Decrement"] = 1] = "Decrement";
    UnaryOperatorType[UnaryOperatorType["Invert"] = 2] = "Invert";
    UnaryOperatorType[UnaryOperatorType["Negative"] = 3] = "Negative";
    UnaryOperatorType[UnaryOperatorType["Positive"] = 4] = "Positive";
    UnaryOperatorType[UnaryOperatorType["Complement"] = 5] = "Complement"; // ~
})(UnaryOperatorType = exports.UnaryOperatorType || (exports.UnaryOperatorType = {}));
class UnaryExpression extends expression_1.Expression {
    constructor(operator, affix, argument) {
        super(expression_1.ExpressionType.Unary);
        this.operator = operator;
        this.affix = affix;
        this.argument = argument;
    }
    equal(expression) {
        return (this.type == expression.type && this.operator == expression.operator && this.affix == expression.affix && this.argument.equal(expression.argument));
    }
}
exports.UnaryExpression = UnaryExpression;
//# sourceMappingURL=unaryexpression.js.map