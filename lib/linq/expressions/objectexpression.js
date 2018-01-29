"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expression_1 = require("./expression");
class ObjectExpression extends expression_1.Expression {
    constructor(properties) {
        super(expression_1.ExpressionType.Object);
        this.properties = properties;
    }
    equal(expression) {
        if (this.type == expression.type && this.properties.length == expression.properties.length) {
            for (let i = 0; i < this.properties.length; i++) {
                if (this.properties[i].key.equal(expression.properties[i].key) == false || this.properties[i].value.equal(expression.properties[i].value) == false)
                    return false;
            }
            return true;
        }
        return false;
    }
    toString() {
        return `{${this.properties.map(property => `"${property.key.toString()}": ${property.value.toString()}`).join(', ')}}`;
    }
}
exports.ObjectExpression = ObjectExpression;
//# sourceMappingURL=objectexpression.js.map