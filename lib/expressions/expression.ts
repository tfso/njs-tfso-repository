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
    Array
}

export interface IExpression {
    type: ExpressionType

    accept(visitor: any): IExpression
}

export class Expression implements IExpression {
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

    public accept(visitor: any) {
        switch (this.type) {
            case ExpressionType.Literal:
                return visitor.visitLiteral(<ILiteralExpression><Object>this);

            case ExpressionType.Compound:
                return visitor.visitCompound(<ICompoundExpression><Object>this);

            case ExpressionType.Identifier:
                return visitor.visitIdentifier(<IIdentifierExpression><Object>this);

            case ExpressionType.Member:
                return visitor.visitMember(<IMemberExpression><Object>this);

            case ExpressionType.Method:
                return visitor.visitMethod(<IMethodExpression><Object>this);

            case ExpressionType.Unary:
                return visitor.visitUnary(<IUnaryExpression><Object>this);

            case ExpressionType.Binary:
                return visitor.visitBinary(<IBinaryExpression><Object>this);

            case ExpressionType.Logical:
                return visitor.visitLogical(<ILogicalExpression><Object>this);

            case ExpressionType.Conditional:
                return visitor.visitConditional(<IConditionalExpression><Object>this);

            case ExpressionType.Array:
                return visitor.visitArray(<IArrayExpression><Object>this);
        }
    }
}

export { ILiteralExpression, ICompoundExpression, IIdentifierExpression, IMemberExpression, IMethodExpression, IUnaryExpression, IBinaryExpression, ILogicalExpression, IConditionalExpression, IArrayExpression }
