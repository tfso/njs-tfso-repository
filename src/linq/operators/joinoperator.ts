import Enumerable, { IEnumerable } from './../enumerable';
import { Operator, OperatorType } from './operator';
import { ExpressionVisitor, IExpression, ExpressionType, IMemberExpression, IIdentifierExpression } from './../expressions/expressionvisitor';

export enum JoinType {
    Inner, 
    Left
}


export class JoinOperator<TEntity, TInner, TResult> extends Operator<TResult> {
    private outerProperty: IExpression;
    private innerProperty: IExpression;

    constructor(private joinType: JoinType, outerKey: (a: TEntity) => void, innerKey: (b: TInner) => void, private selector: (a: TEntity, b: IEnumerable<TInner>) => TResult, private indexing: boolean = false) {
        super(OperatorType.Join);

        this.outerProperty = new ExpressionVisitor().visitLambda(outerKey);
        this.innerProperty = new ExpressionVisitor().visitLambda(innerKey);
    }

    private getPropertyName(expr: IExpression): string {
        if (this.outerProperty.type == ExpressionType.Member && (<IMemberExpression>this.outerProperty).property.type == ExpressionType.Identifier)
            return (<IIdentifierExpression>(<IMemberExpression>this.outerProperty).property).name;

        return undefined;
    }

    public getOuterKey(outerItem: TEntity): any { 
        let propertyName: string;
        
        if ((propertyName = this.getPropertyName(this.outerProperty))) 
            return outerItem[propertyName];
    
        return null;
    }

    public getInnerKey(innerItem: TInner): any {
        let propertyName: string;

        if ((propertyName = this.getPropertyName(this.innerProperty)))
            return innerItem[propertyName];

        return null;
    }

    public * evaluate(outer: Iterable<TEntity>, inner: Iterable<TInner>): IterableIterator<TResult> {
        let keyvalues = new Map<any, Array<TInner>>(),
            outerAr: Array<TEntity> = [],
            outerKeys: Array<any> = [];

        if (this.indexing === true) {
            for (let a of outer) {
                outerAr.push(a); outerKeys.push(this.getOuterKey(a));
            }
            outer = <any>outerAr;
        }

        // only able to iterate through once, but build up a Map of <innerKey, TInner[]> to make join match fast 
        for (let b of inner[Symbol.iterator].call(inner, { keyProperty: this.getPropertyName(this.innerProperty), keys: outerKeys })) {
            let key: any,
                values: TInner[];

            if ((values = keyvalues.get(key = this.getInnerKey(b))) == null)
                keyvalues.set(key, values = []);

            values.push(b);
        }

        for (let a of outer) {
            let values: TInner[];

            switch (this.joinType) {
                case JoinType.Inner:
                    if (values = keyvalues.get(this.getOuterKey(a)))
                        yield this.selector(a, new Enumerable<TInner>(values))

                    break;

                case JoinType.Left:
                    if ((values = keyvalues.get(this.getOuterKey(a))) == null)
                        values = [];

                    yield this.selector(a, new Enumerable<TInner>(values));
                    break;
            }
        }

        keyvalues.clear();
    }

    public async * evaluateAsync(outer: AsyncIterable<TEntity>, inner: AsyncIterable<TInner>): AsyncIterableIterator<TResult> {
        let keyvalues = new Map<any, Array<TInner>>(),
            outerAr: Array<TEntity> = [],
            outerKeys: Array<any> = [];

        if (this.indexing === true) {
            for await (let a of outer) {
                outerAr.push(a); outerKeys.push(this.getOuterKey(a));
            }
            outer = <any>outerAr;
        }

        for await (let b of inner[Symbol.asyncIterator].call(inner, { keyProperty: this.getPropertyName(this.innerProperty), keys: outerKeys }) ) {
            let key: any,
                values: TInner[];

            if ((values = keyvalues.get(key = this.getInnerKey(b))) == null)
                keyvalues.set(key, values = []);

            values.push(b);
        }

        for await (let a of outer) {
            let values: TInner[];

            switch(this.joinType) {
                case JoinType.Inner:
                    if (values = keyvalues.get(this.getOuterKey(a)))
                        yield this.selector(a, new Enumerable<TInner>(values))

                    break;

                case JoinType.Left:
                    if((values = keyvalues.get(this.getOuterKey(a))) == null)
                        values = [];

                    yield this.selector(a, new Enumerable<TInner>(values));
                    break;
            }
        }

        keyvalues.clear();
    }
}