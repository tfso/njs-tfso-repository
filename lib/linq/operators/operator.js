"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var OperatorType;
(function (OperatorType) {
    OperatorType[OperatorType["Where"] = 1] = "Where";
    OperatorType[OperatorType["Take"] = 2] = "Take";
    OperatorType[OperatorType["Skip"] = 4] = "Skip";
    OperatorType[OperatorType["OrderBy"] = 8] = "OrderBy";
    OperatorType[OperatorType["Select"] = 16] = "Select";
    OperatorType[OperatorType["Join"] = 32] = "Join";
})(OperatorType = exports.OperatorType || (exports.OperatorType = {}));
class Operator {
    constructor(type) {
        this.type = type;
        this.removed = false;
    }
    remove() {
        this.removed = true;
    }
}
exports.Operator = Operator;
//# sourceMappingURL=operator.js.map