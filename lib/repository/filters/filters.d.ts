import { IFilter } from './filter';
import { IFilterCriteria } from './filtercriteria';
import { IExpression } from './../../linq/expressions/expression';
export interface IFilters {
    groups: Array<IFilter>;
    getUnion(): Array<IFilterCriteria>;
    getIntersection(): Array<IFilterCriteria>;
}
export declare class Filters<TEntity> implements IFilters {
    private _groups;
    constructor(expression: IExpression);
    readonly groups: IFilter[];
    getUnion(): IFilterCriteria[];
    getIntersection(): IFilterCriteria[];
}
