"use strict";
const filters_1 = require('./filters/filters');
class Repository {
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
    getFilters(predicate, ...parameters) {
        return new filters_1.Filters(predicate, ...parameters);
    }
    getPredicateFn(predicate, ...parameters) {
        return (entity) => {
            return predicate.apply({}, [entity].concat(parameters));
        };
    }
}
exports.Repository = Repository;
//# sourceMappingURL=repository.js.map