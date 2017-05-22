import { Operator, OperatorType } from './operator';
import { ExpressionVisitor, IExpression, ExpressionType, IMemberExpression, IIdentifierExpression } from './../expressions/expressionvisitor';

export class JoinOperator<TEntity, TInner, TResult> extends Operator<TResult> {
    private outerProperty: IExpression;
    private innerProperty: IExpression;

    constructor(outerKey: (a: TEntity) => void, innerKey: (b: TInner) => void, public selector: (a: TEntity, b: Iterator<TInner>) => TResult) {
        super(OperatorType.Join);


        this.outerProperty = new ExpressionVisitor().visitLambda(outerKey);
        this.innerProperty = new ExpressionVisitor().visitLambda(innerKey);
    }

    public getOuterKey(outerItem: TEntity): any { 
        if (this.outerProperty.type == ExpressionType.Member && (<IMemberExpression>this.outerProperty).property.type == ExpressionType.Identifier) {
            let property: IIdentifierExpression = <IIdentifierExpression>(<IMemberExpression>this.outerProperty).property;

            return outerItem[property.name];
        }        

        return null;
    }

    public getInnerKey(innerItem: TInner): any {
        if (this.innerProperty.type == ExpressionType.Member && (<IMemberExpression>this.innerProperty).property.type == ExpressionType.Identifier) {
            let property: IIdentifierExpression = <IIdentifierExpression>(<IMemberExpression>this.innerProperty).property;

            return innerItem[property.name];
        }

        return null;
    }

    public * evaluate(outer: Iterable<TEntity>, inner: Iterable<TInner>): IterableIterator<TResult> {
        let idx = 0;

        for (let a of outer) {
            let list: Array<TInner> = [];

            for (let b of inner) {
                if (this.getOuterKey(a) == this.getInnerKey(b)) list.push(b);
            }

            let tmp = this.selector(a, list[Symbol.iterator]());

            yield tmp;
        }
    }
}