import { ILogicalExpression } from './../../linq/expressions/expressionvisitor';
import { IFilterCriteria } from './filtercriteria';
export interface IFilter {
    criteria: Array<IFilterCriteria>;
}
export declare class Filter implements IFilter {
    private _criteria;
    constructor(criteria: Array<IFilterCriteria>);
    readonly criteria: IFilterCriteria[];
    static visit(expression: ILogicalExpression): Array<IFilter>;
}
