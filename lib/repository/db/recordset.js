"use strict";
var RecordSet = (function () {
    function RecordSet(records, affected, executionTime) {
        if (affected === void 0) { affected = 0; }
        if (executionTime === void 0) { executionTime = 0; }
        this.records = records;
        this.affected = affected;
        this.executionTime = executionTime;
    }
    Object.defineProperty(RecordSet.prototype, "length", {
        get: function () {
            return Array.isArray(this.records) ? this.records.length : 0;
        },
        enumerable: true,
        configurable: true
    });
    return RecordSet;
}());
exports.RecordSet = RecordSet;
//# sourceMappingURL=recordset.js.map