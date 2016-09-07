"use strict";
var Query = (function () {
    function Query(predicate) {
        this._parameters = {};
        this._predicate = predicate;
        this._hasRun = false;
    }
    Object.defineProperty(Query.prototype, "predicate", {
        get: function () {
            if (this._predicate == null)
                return function (entity) { return true; };
            return this._predicate;
        },
        set: function (value) {
            this._predicate = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Query.prototype, "commandText", {
        get: function () {
            return this._commandText;
        },
        set: function (query) {
            this._commandText = query;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Query.prototype, "parameters", {
        get: function () {
            return this._parameters;
        },
        enumerable: true,
        configurable: true
    });
    Query.prototype.execute = function () {
        var _this = this;
        var stamped = Date.now();
        return this.executeQuery()
            .then(function (recordset) {
            if (recordset.executionTime > 1000 || (recordset.executionTime == 0 && (Date.now() - stamped) > 1000))
                console.warn("[WARNING]: Long running query (" + (recordset.executionTime > 0 ? recordset.executionTime : Date.now() - stamped) + "ms). Consider narrow down the result length (" + recordset.length + "pcs);\n   " + _this.commandText);
            if (!_this.onFulfilled)
                return Promise.resolve(recordset);
            return _this.onFulfilled(recordset);
        }, function (err) {
            if (!_this.onRejected)
                return Promise.reject(err);
            return _this.onRejected(err);
        });
    };
    Query.prototype.then = function (onFulfilled, onRejected) {
        if (this._hasRun == true)
            throw new Error('Query is not thread safe currently, please dispose Query after use');
        this._hasRun = true;
        this.onFulfilled = onFulfilled;
        this.onRejected = onRejected;
        return this.execute();
    };
    Query.prototype.catch = function (onRejected) {
        if (this._hasRun == true)
            throw new Error('Query is not thread safe currently, please dispose Query after use');
        this.onRejected = onRejected;
        return this.execute();
    };
    return Query;
}());
exports.Query = Query;
//# sourceMappingURL=query.js.map