"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const operator_1 = require("./operator");
class SkipOperator extends operator_1.Operator {
    constructor(count) {
        super(operator_1.OperatorType.Skip);
        this.count = count;
    }
    evaluate(items) {
        return items.slice(this.count);
    }
}
exports.SkipOperator = SkipOperator;
//# sourceMappingURL=skipoperator.js.map