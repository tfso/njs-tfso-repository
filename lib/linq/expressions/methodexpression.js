"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expression_1 = require("./expression");
class MethodExpression extends expression_1.Expression {
    constructor(name, parameters, caller) {
        super(expression_1.ExpressionType.Method);
        this.name = name;
        this.parameters = parameters;
        this.caller = caller;
    }
}
exports.MethodExpression = MethodExpression;
//# sourceMappingURL=methodexpression.js.map