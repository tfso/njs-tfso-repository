import { Operator, OperatorType } from './operator';
import { ExpressionVisitor, IExpression, ExpressionType, IMemberExpression, IIdentifierExpression } from './../expressions/expressionvisitor';

export class OrderByOperator<TEntity> extends Operator<TEntity> {
    private _expression: IExpression;

    constructor(public property: (it: TEntity) => void) {
        super(OperatorType.OrderBy);

        this._expression = new ExpressionVisitor().visitLambda(property);
    }

    public evaluate(items: TEntity[]): TEntity[] {
        if (this._expression.type != ExpressionType.Member)
            throw new TypeError('Order by is expecting a member property as sorting property');

        var memberProperty: IExpression = (<IMemberExpression>this._expression).property,
            property: IIdentifierExpression;

        if (memberProperty.type != ExpressionType.Identifier)
            throw new TypeError('Order by is expecting a member property as sorting property');

        property = <IIdentifierExpression>memberProperty;

        items.sort((a, b) => {
            return a[property.name] == b[property.name] ? 0 : a[property.name] < b[property.name] ? -1 : 1;
        })

        return items;
    }
}