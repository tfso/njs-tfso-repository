export declare class LambdaExpression {
    private _expression;
    private _parameters;
    private _lambdaFn;
    constructor(lambda: (...it: Array<any>) => any);
    expression: string;
    parameters: Array<string>;
    lambda: ((...it: Array<any>) => any);
    /**
    * decompilation of a predicate expression extracting the actual expression
    * @param predicate
    * @return string
    */
    private parseExpression(lambda);
}
