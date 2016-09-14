"use strict";
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
})(exports.ExpressionType || (exports.ExpressionType = {}));
var ExpressionType = exports.ExpressionType;
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
        switch (this.type) {
            case ExpressionType.Literal:
                return visitor.visitLiteral(this);
            case ExpressionType.Compound:
                return visitor.visitCompound(this);
            case ExpressionType.Identifier:
                return visitor.visitIdentifier(this);
            case ExpressionType.Member:
                return visitor.visitMember(this);
            case ExpressionType.Method:
                return visitor.visitMethod(this);
            case ExpressionType.Unary:
                return visitor.visitUnary(this);
            case ExpressionType.Binary:
                return visitor.visitBinary(this);
            case ExpressionType.Logical:
                return visitor.visitLogical(this);
            case ExpressionType.Conditional:
                return visitor.visitConditional(this);
            case ExpressionType.Array:
                return visitor.visitArray(this);
        }
    }
}
exports.Expression = Expression;
//# sourceMappingURL=expression.js.map