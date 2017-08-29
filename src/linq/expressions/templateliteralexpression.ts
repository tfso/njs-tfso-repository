import { IExpression, Expression, ExpressionType } from './expression';

export interface ITemplateLiteralExpression extends IExpression {
    elements: Array<IExpression>
}

export class TemplateLiteralExpression extends Expression implements ITemplateLiteralExpression {
    constructor(public elements: Array<IExpression>) {
        super(ExpressionType.Array);
    }

    public equal(expression: ITemplateLiteralExpression): boolean {
        if (this.type == expression.type && this.elements.length == expression.elements.length)
        {
            for (let i = 0; i < this.elements.length; i++)
            {
                if (this.elements[i].equal(expression.elements[i]) == false)
                    return false;
            }

            return true;
        }

        return false;
    }
}