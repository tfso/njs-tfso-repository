import { ILiteralExpression } from './literalexpression';
import { ICompoundExpression } from './compoundexpression';
import { IIdentifierExpression } from './identifierexpression';
import { IMemberExpression } from './memberexpression';
import { IMethodExpression } from './methodexpression';
import { IUnaryExpression } from './unaryexpression';
import { IBinaryExpression } from './binaryexpression';
import { ILogicalExpression } from './logicalexpression';
import { IConditionalExpression } from './conditionalexpression';
import { IArrayExpression } from './arrayexpression';
import { IIndexExpression } from './indexexpression';

import { ExpressionVisitor } from './expressionvisitor';

export enum ExpressionType {
    Compound,

    Identifier,
    Member,
    Literal,
    Method,
    Unary,
    Binary,
    Logical,
    Conditional,
    Array,
    Index
}

export interface IExpression {
    type: ExpressionType

    accept<T extends ExpressionVisitor>(visitor: T): IExpression
    equal(expression: IExpression): boolean;
}

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

    public accept<T extends ExpressionVisitor>(visitor: T) {
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
        }

        // remove it from stack
        visitor.stack.pop();

        // return the newly visited expression
        return expression;
    }

    public abstract equal(expression: IExpression): boolean
}

export { ILiteralExpression, ICompoundExpression, IIdentifierExpression, IMemberExpression, IMethodExpression, IUnaryExpression, IBinaryExpression, ILogicalExpression, IConditionalExpression, IArrayExpression }
