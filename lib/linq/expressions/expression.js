"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ExpressionType;
(function (ExpressionType) {
    ExpressionType[ExpressionType["Compound"] = 0] = "Compound";
    ExpressionType[ExpressionType["Identifier"] = 1] = "Identifier";
    ExpressionType[ExpressionType["Member"] = 2] = "Member";
    ExpressionType[ExpressionType["Literal"] = 3] = "Literal";
    ExpressionType[ExpressionType["Method"] = 4] = "Method";
    ExpressionType[ExpressionType["Unary"] = 5] = "Unary";
    ExpressionType[ExpressionType["Binary"] = 6] = "Binary";
    ExpressionType[ExpressionType["Logical"] = 7] = "Logical";
    ExpressionType[ExpressionType["Conditional"] = 8] = "Conditional";
    ExpressionType[ExpressionType["Array"] = 9] = "Array";
    ExpressionType[ExpressionType["Index"] = 10] = "Index";
    ExpressionType[ExpressionType["TemplateLiteral"] = 11] = "TemplateLiteral";
    ExpressionType[ExpressionType["Object"] = 12] = "Object";
})(ExpressionType = exports.ExpressionType || (exports.ExpressionType = {}));
class Expression {
    constructor(type) {
        this._type = type;
    }
    get type() {
        return this._type;
    }
    set type(value) {
        this._type = value;
    }
    accept(visitor) {
        let expression;
        // add this as parent to stack for next acceptance/visit
        visitor.stack.push(this);
        switch (this.type) {
            case ExpressionType.Literal:
                expression = visitor.visitLiteral(this);
                break;
            case ExpressionType.Compound:
                expression = visitor.visitCompound(this);
                break;
            case ExpressionType.Identifier:
                expression = visitor.visitIdentifier(this);
                break;
            case ExpressionType.Member:
                expression = visitor.visitMember(this);
                break;
            case ExpressionType.Method:
                expression = visitor.visitMethod(this);
                break;
            case ExpressionType.Unary:
                expression = visitor.visitUnary(this);
                break;
            case ExpressionType.Binary:
                expression = visitor.visitBinary(this);
                break;
            case ExpressionType.Logical:
                expression = visitor.visitLogical(this);
                break;
            case ExpressionType.Conditional:
                expression = visitor.visitConditional(this);
                break;
            case ExpressionType.Array:
                expression = visitor.visitArray(this);
                break;
            case ExpressionType.Index:
                expression = visitor.visitIndex(this);
                break;
            case ExpressionType.TemplateLiteral:
                expression = visitor.visitTemplateLiteral(this);
                break;
            case ExpressionType.Object:
                expression = visitor.visitObject(this);
                break;
        }
        // remove it from stack
        visitor.stack.pop();
        // return the newly visited expression
        return expression;
    }
}
exports.Expression = Expression;
//# sourceMappingURL=expression.js.map