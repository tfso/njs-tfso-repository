"use strict";
var _this = this;
var assert = require('assert');
var Expr = require('./../expressions/expressionvisitor');
describe("When using ExpressionVisitor for member Lambda expression", function () {
    var visitor, expr;
    beforeEach(function () {
        visitor = new Expr.ExpressionVisitor;
    });
    it("it should return a member expression", function () {
        expr = visitor.visitLambda(function () { return _this.num; });
        assert.ok(expr.type == Expr.ExpressionType.Member, "Expected a MemberExpression");
        assert.ok(expr.object.type == Expr.ExpressionType.Identifier, "Expected a identifier as object");
        assert.ok(expr.property.type == Expr.ExpressionType.Identifier, "Expected a identifier as property");
    });
    it("it should return a member expression with array indexer", function () {
        expr = visitor.visitLambda(function () { return _this.ar[5]; });
        assert.ok(expr.type == Expr.ExpressionType.Member, "Expected a MemberExpression");
        assert.ok(expr.object.type == Expr.ExpressionType.Identifier, "Expected a identifier as object");
        assert.ok(expr.property.type == Expr.ExpressionType.Member, "Expected a new member as property");
        assert.ok(expr.property.object.type == Expr.ExpressionType.Identifier, "Expected that member property has a member as a identifier");
        assert.ok(expr.property.property.type == Expr.ExpressionType.Array, "Expected that member property has a property as an array");
    });
});
//# sourceMappingURL=expressionvisitor_member_expression.js.map