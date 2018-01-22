import { IExpression } from './interfaces/iexpression';
import { ExpressionType } from './expressiontype';

import { ILiteralExpression } from './interfaces/iliteralexpression';
import { ICompoundExpression } from './interfaces/icompoundexpression';
import { IIdentifierExpression } from './interfaces/iidentifierexpression';
import { IMemberExpression } from './interfaces/imemberexpression';
import { IMethodExpression } from './interfaces/imethodexpression';
import { IUnaryExpression } from './interfaces/iunaryexpression';
import { IBinaryExpression } from './interfaces/ibinaryexpression';
import { ILogicalExpression } from './interfaces/ilogicalexpression';
import { IConditionalExpression } from './interfaces/iconditionalexpression';
import { IArrayExpression } from './interfaces/iarrayexpression';
import { IIndexExpression } from './interfaces/iindexexpression';
import { ITemplateLiteralExpression } from './interfaces/itemplateliteralexpression';
import { IObjectExpression } from './interfaces/iobjectexpression';

import { IExpressionVisitor } from './interfaces/iexpressionvisitor';

export abstract class Expression implements IExpression {
    private _type: ExpressionType;

    constructor(type: ExpressionType) { //(predicate: (it: Object) => boolean, parameters?: any) {
        this._type = type;
    }

    get type() {
        return this._type;
    }

    set type(value) {
        this._type = value;
    }

    public accept<T extends IExpressionVisitor>(visitor: T) {
        let expression: IExpression;

        // add this as parent to stack for next acceptance/visit
        visitor.stack.push(this);

        switch (this.type) {
            case ExpressionType.Literal:
                expression = visitor.visitLiteral(<ILiteralExpression><Object>this); break;

            case ExpressionType.Compound:
                expression = visitor.visitCompound(<ICompoundExpression><Object>this); break;

            case ExpressionType.Identifier:
                expression = visitor.visitIdentifier(<IIdentifierExpression><Object>this); break;

            case ExpressionType.Member:
                expression = visitor.visitMember(<IMemberExpression><Object>this); break;

            case ExpressionType.Method:
                expression = visitor.visitMethod(<IMethodExpression><Object>this); break;

            case ExpressionType.Unary:
                expression = visitor.visitUnary(<IUnaryExpression><Object>this); break;

            case ExpressionType.Binary:
                expression = visitor.visitBinary(<IBinaryExpression><Object>this); break;

            case ExpressionType.Logical:
                expression = visitor.visitLogical(<ILogicalExpression><Object>this); break;

            case ExpressionType.Conditional:
                expression = visitor.visitConditional(<IConditionalExpression><Object>this); break;

            case ExpressionType.Array:
                expression = visitor.visitArray(<IArrayExpression><Object>this); break;

            case ExpressionType.Index:
                expression = visitor.visitIndex(<IIndexExpression><Object>this); break;

            case ExpressionType.TemplateLiteral:
                expression = visitor.visitTemplateLiteral(<ITemplateLiteralExpression><Object>this); break;

            case ExpressionType.Object:
                expression = visitor.visitObject(<IObjectExpression><Object>this); break;
        }

        // remove it from stack
        visitor.stack.pop();

        // return the newly visited expression
        return expression;
    }

    public abstract equal(expression: IExpression): boolean
}

export { IExpression, ExpressionType }