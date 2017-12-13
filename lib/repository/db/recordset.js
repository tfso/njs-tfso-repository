"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RecordSet {
    constructor(records, affected = 0, executionTime = 0, _totalLength = -1) {
        this.records = records;
        this.affected = affected;
        this.executionTime = executionTime;
        this._totalLength = _totalLength;
    }
    get length() {
        return Array.isArray(this.records) ? this.records.length : 0;
    }
    get totalLength() {
        return this._totalLength == -1 ? this.length : this._totalLength;
    }
    get meta() {
        return {
            affected: this.affected,
            totalLength: this.totalLength,
            length: this.length,
            executionTime: this.executionTime
        };
    }
}
exports.RecordSet = RecordSet;
//# sourceMappingURL=recordset.js.map