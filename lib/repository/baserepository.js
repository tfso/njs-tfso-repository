"use strict";
var filters_1 = require('./filters/filters');
var BaseRepository = (function () {
    function BaseRepository() {
    }
    BaseRepository.prototype.beginTransaction = function () {
        return Promise.resolve();
    };
    BaseRepository.prototype.commitTransaction = function () {
        return Promise.resolve();
    };
    BaseRepository.prototype.rollbackTransaction = function () {
        return Promise.resolve();
    };
    /**
     * returns a IFilters if the predicate is solvable, otherwise it throws an error
     * @param predicate
     * @param parameters
     */
    BaseRepository.prototype.getFilters = function (predicate) {
        var parameters = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            parameters[_i - 1] = arguments[_i];
        }
        return new (filters_1.Filters.bind.apply(filters_1.Filters, [void 0].concat([predicate], parameters)))();
    };
    BaseRepository.prototype.getPredicateFn = function (predicate) {
        var parameters = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            parameters[_i - 1] = arguments[_i];
        }
        return function (entity) {
            return predicate.apply({}, [entity].concat(parameters));
        };
    };
    return BaseRepository;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BaseRepository;
//# sourceMappingURL=baserepository.js.map