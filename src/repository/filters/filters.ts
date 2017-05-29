//import { IFilter, Filter } from './filter';
//import { IFilterCriteria, FilterCriteria } from './filtercriteria';

//import { IExpression, ExpressionType, ILogicalExpression } from './../../linq/expressions/expression';

//export interface IFilters {
//    groups: Array<IFilter>

//    getUnion(): Array<IFilterCriteria>
//    getIntersection(): Array<IFilterCriteria>
//}

//export class Filters<TEntity> implements IFilters {
//    private _groups: Array<IFilter> = [];

//    constructor(expression: IExpression) {
//        if (expression != null && expression.type == ExpressionType.Logical)
//            this._groups = Filter.visit(<ILogicalExpression>expression);
//    }

//    public get groups() {
//        return this._groups;
//    }

//    public getUnion() {
//        if (this._groups.length == 0)
//            return new Array<IFilterCriteria>();

//        return this.groups.reduce((res, v, idx, arr) => {
//            return new Filter(res.criteria.concat(v.criteria));
//        }).criteria;
//    }

//    public getIntersection() {
//        if (this.groups.length == 0)
//            return new Array<IFilterCriteria>();

//        return this.groups.reduce((res, v, idx, arr) => {
//            var criteria = res.criteria.filter((criteria) => {
//                for (let crit of v.criteria)
//                    if (criteria.property == crit.property && criteria.operator == crit.operator && criteria.value == crit.value) return true;

//                return false;
//            })

//            return new Filter(criteria);
//        }).criteria
//    }
//}