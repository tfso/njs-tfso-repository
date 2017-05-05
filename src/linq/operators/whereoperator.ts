import { Operator, OperatorType } from './operator';

import { IExpression } from './../expressions/expression';

import { ReducerVisitor } from './../expressions/reducervisitor';
import { ODataVisitor } from './../expressions/odatavisitor';

export type PredicateType = 'Javascript' | 'OData';

export class WhereOperator<TEntity> extends Operator<TEntity> {
    private _predicate: (entity: TEntity) => boolean;
    private _expression: IExpression;

    private _footprint: string

    constructor(predicateType: 'OData', predicate: string)
    constructor(predicateType: 'Javascript', predicate: (it: TEntity, ...param: any[]) => boolean, ...parameters: any[])
    constructor(predicateType: PredicateType, predicate: any, ...parameters: any[]) {
        super(OperatorType.Where);

        //this._parameters = parameters;

        switch (predicateType) {
            case 'Javascript':
                let visitor: ReducerVisitor;

                this._expression = (visitor = new ReducerVisitor()).visitLambda(predicate, ...parameters);
                this._footprint = new Object(predicate).toString();
                this._predicate = (entity: TEntity) => {
                    return predicate.apply({}, [entity].concat(parameters)) === true;
                };

                if (visitor.isSolvable == false)
                    throw new Error('Predicate is not solvable');


                break;

            case 'OData':
                this._expression = new ODataVisitor().visitOData(predicate);
                this._footprint = predicate;
                this._predicate = (entity: TEntity) => {
                    return ODataVisitor.evaluate(this._expression, entity) === true;
                }
                
                break;
        }
    }

    //public get parameters(): any[] {
    //    return this._parameters;
    //}

    public get predicate(): (entity: TEntity) => boolean {
        return this._predicate == null ? () => true : this._predicate;
    }

    public get expression(): IExpression {
        return this._expression;
    }

    public evaluate(items: TEntity[]): TEntity[] {
        return items.filter(entity => this._predicate(entity));
    }

    public toString(): string {
        return this._footprint; // should be this._expression.toString() sooner or later
    }
}