import { IExpression, ILogicalExpression } from './../../linq/expressions/expressionvisitor';
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
    protected getMemberName(expression: IExpression): string;
    readonly property: string;
    readonly operator: string;
    readonly value: any;
    readonly isValid: boolean;
    static visit(expression: ILogicalExpression): Array<IFilterCriteria>;
}
