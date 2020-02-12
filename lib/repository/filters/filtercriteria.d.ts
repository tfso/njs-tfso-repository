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
    protected get expression(): ILogicalExpression;
    protected getMemberName(expression: IExpression): string;
    get property(): string;
    get wildcard(): "none" | "left" | "right" | "both";
    get operator(): "==" | "!=" | "<=" | ">=" | "<" | ">";
    get value(): any;
    private getValue;
    get isValid(): boolean;
    static visit(expression: ILogicalExpression): Array<IFilterCriteria>;
    private cleanWildcard;
}
