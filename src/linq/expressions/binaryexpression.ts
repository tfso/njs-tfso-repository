import { IBinaryExpression, BinaryOperatorType } from './interfaces/ibinaryexpression';
import { IExpression, Expression, ExpressionType } from './expression';

export class BinaryExpression extends Expression implements IBinaryExpression {
    constructor(public operator: BinaryOperatorType, public left: IExpression, public right: IExpression) {
        super(ExpressionType.Binary);
    }

    public equal(expression: IBinaryExpression): boolean {
        if (this.operator == expression.operator && this.left.equal(expression.left) && this.right.equal(expression.right))
            return true;

        if (this.operator == expression.operator) {
            switch (this.operator) {
                case BinaryOperatorType.Addition:
                case BinaryOperatorType.Multiplication:
                case BinaryOperatorType.ExclusiveOr:
                case BinaryOperatorType.And:
                case BinaryOperatorType.Or:
                    return this.left.equal(expression.right) && this.right.equal(expression.left);
            }
        }

        return false;
    }
}

export { IBinaryExpression, BinaryOperatorType };