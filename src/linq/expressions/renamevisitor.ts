import { IExpression, Expression, ExpressionType } from './expression';
import { IIdentifierExpression, IdentifierExpression } from './identifierexpression';

import { ExpressionVisitor } from './expressionvisitor';

export class RenameVisitor extends ExpressionVisitor {
    private renames: Map<string, string>;

    constructor(...renames: Array<{ from: string, to: string }>) {
        super();

        this.renames = new Map();
        
        for (let rename of renames)
            if (typeof (rename) == 'object' && typeof rename.from == 'string' && rename.from.length > 0)
                this.renames.set(rename.from, rename.to);
    }

    public visit(expression: IExpression): IExpression {
        return expression.accept(this);
    }

    public visitIdentifier(expression: IIdentifierExpression): IExpression {
        let name;

        if ((name = this.renames.get(expression.name)) == null)
            name = expression.name;

        return super.visitIdentifier(new IdentifierExpression(name));
    }
}
