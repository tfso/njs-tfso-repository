"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const operator_1 = require("./operator");
const expressionvisitor_1 = require("./../expressions/expressionvisitor");
class OrderByOperator extends operator_1.Operator {
    constructor(property) {
        super(operator_1.OperatorType.OrderBy);
        this.property = property;
        this._expression = new expressionvisitor_1.ExpressionVisitor().visitLambda(property);
    }
    evaluate(items) {
        if (this._expression.type != expressionvisitor_1.ExpressionType.Member)
            throw new TypeError('Order by is expecting a member property as sorting property');
        var memberProperty = this._expression.property, property;
        if (memberProperty.type != expressionvisitor_1.ExpressionType.Identifier)
            throw new TypeError('Order by is expecting a member property as sorting property');
        property = memberProperty;
        items.sort((a, b) => {
            return a[property.name] == b[property.name] ? 0 : a[property.name] < b[property.name] ? -1 : 1;
        });
        return items;
    }
}
exports.OrderByOperator = OrderByOperator;
//# sourceMappingURL=orderbyoperator.js.map