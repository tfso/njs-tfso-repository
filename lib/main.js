"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
if (!Symbol.asyncIterator)
    Symbol.asyncIterator = Symbol.asyncIterator || "__@@asyncIterator__";
const baserepository_1 = require("./repository/baserepository");
var enumerable_1 = require("./linq/enumerable");
Object.defineProperty(exports, "Enumerable", { enumerable: true, get: function () { return enumerable_1.default; } });
Object.defineProperty(exports, "OperatorType", { enumerable: true, get: function () { return enumerable_1.OperatorType; } });
exports.default = baserepository_1.default;
//# sourceMappingURL=main.js.map