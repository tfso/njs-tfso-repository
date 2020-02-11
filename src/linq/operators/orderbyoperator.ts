import { Operator, OperatorType } from './operator';
import { ExpressionVisitor, IExpression, ExpressionType, IMemberExpression, IIdentifierExpression } from './../expressions/expressionvisitor';

export class OrderByOperator<TEntity> extends Operator<TEntity> {
    public property: string | number | symbol

    constructor(property: string | keyof TEntity | ((it: TEntity) => void)) {
        super(OperatorType.OrderBy);

        if(typeof property == 'function') {
            let expression = new ExpressionVisitor().visitLambda(property);

            if (expression.type != ExpressionType.Member)
                throw new TypeError('Order by is expecting a member property as sorting property');

            if ((<IMemberExpression>expression).property.type != ExpressionType.Identifier)
                throw new TypeError('Order by is expecting a member property as sorting property');

            this.property = (<IIdentifierExpression>(<IMemberExpression>expression).property).name
        }
        else {
            this.property = property
        }
    }

    public * evaluate(items: Iterable<TEntity>): IterableIterator<TEntity> {
        let ar = Array.from(items);
        ar.sort((a, b) => {
            return a[this.property] == b[this.property] ? 0 : a[this.property] < b[this.property] ? -1 : 1;
        })

        yield* ar;
    }

    public async * evaluateAsync(items: AsyncIterable<TEntity>): AsyncIterableIterator<TEntity> {
        let ar: Array<TEntity> = [];
        for await(let item of items)
            ar.push(item);

        ar.sort((a, b) => {
            return a[this.property] == b[this.property] ? 0 : a[this.property] < b[this.property] ? -1 : 1;
        })

        yield* ar;   
    }
}