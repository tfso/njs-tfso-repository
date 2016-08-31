import assert = require('assert');
import * as Expr from './../expressions/expressionvisitor';

describe("When using ExpressionVisitor for member Lambda expression", () => {
    var visitor: Expr.ExpressionVisitor,
        expr: Expr.IExpression;

    beforeEach(() => {
        visitor = new Expr.ExpressionVisitor;
    })

    it("it should return a member expression", () => {
        expr = visitor.visitLambda(() => this.num);

        assert.ok(expr.type == Expr.ExpressionType.Member, "Expected a MemberExpression");
        assert.ok((<Expr.IMemberExpression>expr).object.type == Expr.ExpressionType.Identifier, "Expected a identifier as object");
        assert.ok((<Expr.IMemberExpression>expr).property.type == Expr.ExpressionType.Identifier, "Expected a identifier as property");
    })

    it("it should return a member expression with array indexer", () => {
        expr = visitor.visitLambda(() => this.ar[5]);

        assert.ok(expr.type == Expr.ExpressionType.Member, "Expected a MemberExpression");
        assert.ok((<Expr.IMemberExpression>expr).object.type == Expr.ExpressionType.Identifier, "Expected a identifier as object");
        assert.ok((<Expr.IMemberExpression>expr).property.type == Expr.ExpressionType.Member, "Expected a new member as property");
        assert.ok((<Expr.IMemberExpression>(<Expr.IMemberExpression>expr).property).object.type == Expr.ExpressionType.Identifier, "Expected that member property has a member as a identifier");
        assert.ok((<Expr.IMemberExpression>(<Expr.IMemberExpression>expr).property).property.type == Expr.ExpressionType.Array, "Expected that member property has a property as an array");
    })
})
