"use strict";
class RecordSet {
    constructor(records, affected = 0, executionTime = 0) {
        this.records = records;
        this.affected = affected;
        this.executionTime = executionTime;
    }
    get length() {
        return Array.isArray(this.records) ? this.records.length : 0;
    }
}
exports.RecordSet = RecordSet;
//# sourceMappingURL=recordset.js.map