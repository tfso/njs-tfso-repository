"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const operator_1 = require("./operator");
const reducervisitor_1 = require("./../expressions/reducervisitor");
const odatavisitor_1 = require("./../expressions/odatavisitor");
class WhereOperator extends operator_1.Operator {
    constructor(predicateType, predicate, ...parameters) {
        super(operator_1.OperatorType.Where);
        //this._parameters = parameters;
        switch (predicateType) {
            case 'Javascript':
                let visitor;
                this._expression = (visitor = new reducervisitor_1.ReducerVisitor()).visitLambda(predicate, ...parameters);
                this._footprint = new Object(predicate).toString();
                this._predicate = (entity) => {
                    return predicate.apply({}, [entity].concat(parameters)) === true;
                };
                if (visitor.isSolvable == false)
                    throw new Error('Predicate is not solvable');
                break;
            case 'OData':
                this._expression = new odatavisitor_1.ODataVisitor().visitOData(predicate);
                this._footprint = predicate;
                this._predicate = (entity) => {
                    return odatavisitor_1.ODataVisitor.evaluate(this._expression, entity) === true;
                };
                break;
        }
    }
    //public get parameters(): any[] {
    //    return this._parameters;
    //}
    get predicate() {
        return this._predicate == null ? () => true : this._predicate;
    }
    get expression() {
        return this._expression;
    }
    set expression(value) {
        this._expression = value;
    }
    evaluate(items) {
        return items.filter(entity => this._predicate(entity));
    }
    toString() {
        return this._footprint; // should be this._expression.toString() sooner or later
    }
}
exports.WhereOperator = WhereOperator;
//# sourceMappingURL=whereoperator.js.map