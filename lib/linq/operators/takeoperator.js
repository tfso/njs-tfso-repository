"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const operator_1 = require("./operator");
class TakeOperator extends operator_1.Operator {
    constructor(count) {
        super(operator_1.OperatorType.Take);
        this.count = count;
    }
    evaluate(items) {
        return items.slice(0, this.count);
    }
}
exports.TakeOperator = TakeOperator;
//# sourceMappingURL=takeoperator.js.map