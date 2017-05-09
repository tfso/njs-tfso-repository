"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const filters_1 = require("./filters/filters");
const whereoperator_1 = require("./../linq/operators/whereoperator");
class BaseRepository {
    constructor() {
    }
    beginTransaction() {
        return Promise.resolve();
    }
    commitTransaction() {
        return Promise.resolve();
    }
    rollbackTransaction() {
        return Promise.resolve();
    }
    /**
     * returns a IFilters if the predicate is solvable, otherwise it throws an error
     * @param predicate
     * @param parameters
     */
    getFilters(query) {
        let expression;
        for (let operator of query.operations.values())
            if (operator instanceof whereoperator_1.WhereOperator) {
                expression = operator.expression;
                break;
            }
        return new filters_1.Filters(expression);
    }
    getPredicateFn(query) {
        let expression;
        for (let operator of query.operations.values())
            if (operator instanceof whereoperator_1.WhereOperator) {
                return operator.predicate;
            }
        return (entity) => {
            return true;
        };
    }
}
exports.default = BaseRepository;
//# sourceMappingURL=baserepository.js.map