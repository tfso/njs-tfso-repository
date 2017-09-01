import { ILogicalExpression } from './../../linq/expressions/expressionvisitor';
export interface IFilterCriteria {
    property: string;
    operator: string;
    value: any;
    isValid: boolean;
}
export declare class FilterCriteria implements IFilterCriteria {
    private _expression;
    constructor(expression: ILogicalExpression);
    protected readonly expression: ILogicalExpression;
    readonly property: string;
    readonly operator: string;
    readonly value: any;
    readonly isValid: boolean;
    static visit(expression: ILogicalExpression): Array<IFilterCriteria>;
}
