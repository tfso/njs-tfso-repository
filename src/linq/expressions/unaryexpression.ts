import { IUnaryExpression, UnaryOperatorType, UnaryAffixType } from './interfaces/iunaryexpression';
import { IExpression, Expression, ExpressionType } from './expression';

export class UnaryExpression extends Expression implements IUnaryExpression {
    constructor(public operator: UnaryOperatorType, public affix: UnaryAffixType, public argument: IExpression) {
        super(ExpressionType.Unary);
    }

    public equal(expression: IUnaryExpression) {
        return (this.type == expression.type && this.operator == expression.operator && this.affix == expression.affix && this.argument.equal(expression.argument));
    }
}

export { IUnaryExpression, UnaryOperatorType, UnaryAffixType }