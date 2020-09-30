"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Operator = exports.OperatorType = void 0;
var OperatorType;
(function (OperatorType) {
    OperatorType[OperatorType["Where"] = 0] = "Where";
    OperatorType[OperatorType["Take"] = 1] = "Take";
    OperatorType[OperatorType["Skip"] = 2] = "Skip";
    OperatorType[OperatorType["OrderBy"] = 3] = "OrderBy";
    OperatorType[OperatorType["Select"] = 4] = "Select";
    OperatorType[OperatorType["Join"] = 5] = "Join";
    OperatorType[OperatorType["SkipWhile"] = 6] = "SkipWhile";
    OperatorType[OperatorType["Slice"] = 7] = "Slice";
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