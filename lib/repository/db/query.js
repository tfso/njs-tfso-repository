"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Query = void 0;
const enumerable_1 = require("./../../linq/enumerable");
const whereoperator_1 = require("./../../linq/operators/whereoperator");
class Query {
    constructor() {
        //protected onFulfilled: (value: IRecordSet<TEntity>) => any | PromiseLike<any>;
        //protected onRejected: (error: any) => any | PromiseLike<any>;
        this._parameters = {};
        this._maxExecutionTime = 5000;
        switch (arguments.length) {
            case 1:
                if (typeof arguments[1] == 'object')
                    this.query = arguments[0];
                else
                    this._maxExecutionTime = Number(arguments[0]) || 5000;
                break;
            case 2:
                this.query = arguments[0];
                this._maxExecutionTime = Number(arguments[1]);
                break;
        }
        this._hasRun = false;
    }
    get query() {
        if (this._query == null)
            this._query = new enumerable_1.default();
        return this._query;
    }
    set query(value) {
        this._query = value;
        if (value != null) {
            for (let operator of value.operations.values())
                if (operator instanceof whereoperator_1.WhereOperator) {
                    this._predicateFootprint = operator.toString();
                    break;
                }
        }
    }
    set commandText(query) {
        if (this._promise)
            throw new Error('Query promise is executed, impossible to change commandText');
        this._commandText = query;
    }
    get commandText() {
        return this._commandText;
    }
    get parameters() {
        return this._parameters;
    }
    execute(onFulfilled, onRejected) {
        var stamped = Date.now();
        if (!this._promise) {
            this._promise = this.executeQuery()
                .then((recordset) => {
                if (recordset.executionTime > this._maxExecutionTime || (recordset.executionTime == 0 && (Date.now() - stamped) > this._maxExecutionTime))
                    console.warn(`[WARNING]: Long running query (${(recordset.executionTime > 0 ? recordset.executionTime : Date.now() - stamped)}ms). Consider narrow down the result length (${recordset.length}pcs)${this._predicateFootprint && this._predicateFootprint.length > 0 ? " for predicate " + this._predicateFootprint : ""};\n    ${this.commandText}`);
                return recordset;
            });
        }
        return this._promise
            .then(onFulfilled, onRejected);
    }
    then(onFulfilled, onRejected) {
        return this.execute(onFulfilled, onRejected);
    }
    catch(onRejected) {
        return this.execute(undefined, onRejected);
    }
}
exports.Query = Query;
//# sourceMappingURL=query.js.map