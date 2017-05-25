import Enumerable, { IEnumerable } from './../enumerable';
import { Operator, OperatorType } from './operator';
import { ExpressionVisitor, IExpression, ExpressionType, IMemberExpression, IIdentifierExpression } from './../expressions/expressionvisitor';

export class JoinOperator<TEntity, TInner, TResult> extends Operator<TResult> {
    private outerProperty: IExpression;
    private innerProperty: IExpression;

    constructor(outerKey: (a: TEntity) => void, innerKey: (b: TInner) => void, public selector: (a: TEntity, b: IEnumerable<TInner>) => TResult) {
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
        let keyvalues = new Map<any, Array<TInner>>();

        // only able to iterate through once, but build up a Map of <innerKey, TInner[]> to make join match fast 
        for (let b of inner) {
            let key: any,
                values: TInner[];

            if ((values = keyvalues.get(key = this.getInnerKey(b))) == null)
                keyvalues.set(key, values = []);

            values.push(b);
        }

        for (let a of outer) {
            let values: TInner[];

            if (values = keyvalues.get(this.getOuterKey(a))) {
                yield this.selector(a, new Enumerable<TInner>(values))
            }
        }
    }

    public async * evaluateAsync(outer: AsyncIterable<TEntity>, inner: AsyncIterable<TInner>): AsyncIterableIterator<TResult> {
        let keyvalues = new Map<any, Array<TInner>>();

        for await (let b of inner) {
            let key: any,
                values: TInner[];

            if ((values = keyvalues.get(key = this.getInnerKey(b))) == null)
                keyvalues.set(key, values = []);

            values.push(b);
        }

        for await (let a of outer) {
            let values: TInner[];

            if (values = keyvalues.get(this.getOuterKey(a))) {
                yield this.selector(a, new Enumerable<TInner>(values))
            }
        }
    }
}