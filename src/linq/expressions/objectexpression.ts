import { IObjectExpression, IObjectProperty } from './interfaces/iobjectexpression';
import { IExpression, Expression, ExpressionType } from './expression';

export class ObjectExpression extends Expression implements IObjectExpression {
    constructor(public properties: Array<IObjectProperty>) {
        super(ExpressionType.Object);
    }

    public equal(expression: IObjectExpression): boolean {
        if (this.type == expression.type && this.properties.length == expression.properties.length)
        {
            for (let i = 0; i < this.properties.length; i++)
            {
                if (this.properties[i].key.equal(expression.properties[i].key) == false || this.properties[i].value.equal(expression.properties[i].value) == false)
                    return false;
            }

            return true;
        }

        return false;
    }
}

export { IObjectExpression, IObjectProperty }