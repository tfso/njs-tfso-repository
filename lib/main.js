"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baserepository_1 = require("./repository/baserepository");
//export { Query } from './repository/db/query';
//export { IRecordSet, RecordSet } from './repository/db/recordset';
var enumerable_1 = require("./linq/enumerable");
exports.Enumerable = enumerable_1.default;
exports.OperatorType = enumerable_1.OperatorType;
exports.default = baserepository_1.default;
const enumerable_2 = require("./linq/enumerable");
class CarRepository extends baserepository_1.default {
    constructor() {
        super();
    }
    read(id) {
        return Promise.reject(new Error('Not implemented'));
    }
    readAll(predicate) {
        return Promise.reject(new Error('Not implemented'));
    }
    delete(entity) {
        return Promise.reject(new Error('Not implemented'));
    }
    update(entity) {
        return Promise.reject(new Error('Not implemented'));
    }
    create(entity) {
        return Promise.reject(new Error('Not implemented'));
    }
    exposeFilters(query) {
        return super.getCriteria(query);
    }
}
var repository = new CarRepository();
var list = repository.exposeFilters(new enumerable_2.default().where(car => car.type.make == "Toyota"));
if (list[0].property == 'type.make') {
}
//# sourceMappingURL=main.js.map