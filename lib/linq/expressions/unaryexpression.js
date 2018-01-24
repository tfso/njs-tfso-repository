"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const iunaryexpression_1 = require("./interfaces/iunaryexpression");
exports.UnaryOperatorType = iunaryexpression_1.UnaryOperatorType;
exports.UnaryAffixType = iunaryexpression_1.UnaryAffixType;
const expression_1 = require("./expression");
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