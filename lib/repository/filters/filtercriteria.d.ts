import { IExpression, ILogicalExpression } from './../../linq/expressions/expressionvisitor';
export interface IFilterCriteria {
    property: string;
    operator: string;
    value: any;
    wildcard: 'none' | 'left' | 'right' | 'both';
    isValid: boolean;
}
export declare class FilterCriteria implements IFilterCriteria {
    private _expression;
    constructor(expression: ILogicalExpression);
    protected readonly expression: ILogicalExpression;
    protected getMemberName(expression: IExpression): string;
    readonly property: string;
    readonly wildcard: "left" | "right" | "none" | "both";
    readonly operator: "==" | "!=" | "<=" | ">=" | "<" | ">";
    readonly value: any;
    private getValue;
    readonly isValid: boolean;
    static visit(expression: ILogicalExpression): Array<IFilterCriteria>;
    private cleanWildcard;
}
