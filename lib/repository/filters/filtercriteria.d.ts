import { ILogicalExpression } from './../../expressions/expressionvisitor';
export interface IFilterCriteria {
    property: string;
    operator: string;
    value: any;
    isValid: boolean;
}
export declare class FilterCriteria implements IFilterCriteria {
    private _expression;
    constructor(expression: ILogicalExpression);
    protected expression: ILogicalExpression;
    property: string;
    operator: string;
    value: any;
    isValid: boolean;
    static visit(expression: ILogicalExpression): Array<IFilterCriteria>;
}
