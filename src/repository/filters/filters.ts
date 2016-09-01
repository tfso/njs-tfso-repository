import { IFilter, Filter } from './filter';
import { IFilterCriteria, FilterCriteria } from './filtercriteria';

import { LambdaExpression } from './../../expressions/lambdaexpression';
import { ReducerVisitor, Expression, ExpressionType, ILogicalExpression } from './../../expressions/reducervisitor';

export interface IFilters {
    groups: Array<IFilter>

    getUnion(): Array<IFilterCriteria>
    getIntersection(): Array<IFilterCriteria>
}

export class Filters<TEntity> implements IFilters {
    private _groups: Array<IFilter> = [];

    constructor(predicate: (it: TEntity) => boolean, ...parameters: any[]) {

        var lambda = new LambdaExpression(predicate),
            visitor = new ReducerVisitor();

        var expression = visitor.visitLambda(predicate, ...parameters);

        if (visitor.isSolvable == true) {
            if (expression != null && expression.type == ExpressionType.Logical)
                this._groups = Filter.visit(<ILogicalExpression>expression);
        } else {
            throw new Error('Predicate is not solvable');
        }
    }

    public get groups() {
        return this._groups;
    }

    public getUnion() {
        if (this._groups.length == 0)
            return new Array<IFilterCriteria>();

        return this.groups.reduce((res, v, idx, arr) => {
            return new Filter(res.criteria.concat(v.criteria));
        }).criteria;
    }

    public getIntersection() {
        if (this.groups.length == 0)
            return new Array<IFilterCriteria>();

        return this.groups.reduce((res, v, idx, arr) => {
            var criteria = res.criteria.filter((criteria) => {
                for (let crit of v.criteria)
                    if (criteria.property == crit.property && criteria.operator == crit.operator && criteria.value == crit.value) return true;

                return false;
            })

            return new Filter(criteria);
        }).criteria
    }
}