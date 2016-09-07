"use strict";
var assert = require('assert');
var Expr = require('./../expressions/expressionvisitor');
describe("When using ExpressionVisitor for binary Lambda Expression", function () {
    var visitor, expr;
    beforeEach(function () {
        visitor = new Expr.ExpressionVisitor;
    });
    it("it should return a binary operation", function () {
        expr = visitor.visitLambda(function () { return 5 + 2; });
        console.log(expr.toString());
        assert.ok(expr.type == Expr.ExpressionType.Binary, "Expected a BinaryExpression");
        assert.ok(expr.left.type == Expr.ExpressionType.Literal, "Expected a literal at left side");
        assert.ok(expr.right.type == Expr.ExpressionType.Literal, "Expected a lteral at right side");
        assert.ok(expr.left.value == 5, "Expected number 5 at left side");
        assert.ok(expr.right.value == 2, "Expected number 5 at right side");
    });
    it("it should handle binary operation for addition", function () {
        expr = visitor.visitLambda(function () { return 5 + 2; });
        assert.ok(expr.type == Expr.ExpressionType.Binary, "Expected a BinaryExpression");
        assert.ok(expr.operator == Expr.BinaryOperatorType.Addition, "Expected a binary operation of addition");
    });
    it("it should handle binary operation for addition for negative number", function () {
        expr = visitor.visitLambda(function () { return 5 + -2; });
        assert.ok(expr.type == Expr.ExpressionType.Binary, "Expected a BinaryExpression");
        assert.ok(expr.operator == Expr.BinaryOperatorType.Addition, "Expected a binary operation of addition");
        assert.ok(expr.right.type == Expr.ExpressionType.Unary, "Expected a unary expression at right side of addition");
    });
    it("it should handle binary operation for addition for positive number", function () {
        expr = visitor.visitLambda(function () { return 5 + +2; });
        assert.ok(expr.type == Expr.ExpressionType.Binary, "Expected a BinaryExpression");
        assert.ok(expr.operator == Expr.BinaryOperatorType.Addition, "Expected a binary operation of addition");
        assert.ok(expr.right.type == Expr.ExpressionType.Unary, "Expected a unary expression at right side of addition");
    });
    it("it should handle binary operation for subtraction", function () {
        expr = visitor.visitLambda(function () { return 5 - 2; });
        assert.ok(expr.type == Expr.ExpressionType.Binary, "Expected a BinaryExpression");
        assert.ok(expr.operator == Expr.BinaryOperatorType.Subtraction, "Expected a binary operation of subtraction");
    });
    it("it should handle binary operation for subtraction for negative number", function () {
        expr = visitor.visitLambda(function () { return 5 - -2; });
        assert.ok(expr.type == Expr.ExpressionType.Binary, "Expected a BinaryExpression");
        assert.ok(expr.operator == Expr.BinaryOperatorType.Subtraction, "Expected a binary operation of subtraction");
        assert.ok(expr.right.type == Expr.ExpressionType.Unary, "Expected a unary expression at right side of substraction");
    });
    it("it should handle binary operation for subtraction for positive number", function () {
        expr = visitor.visitLambda(function () { return 5 - +2; });
        assert.ok(expr.type == Expr.ExpressionType.Binary, "Expected a BinaryExpression");
        assert.ok(expr.operator == Expr.BinaryOperatorType.Subtraction, "Expected a binary operation of subtraction");
        assert.ok(expr.right.type == Expr.ExpressionType.Unary, "Expected a unary expression at right side of substraction");
    });
    it("it should handle binary operation for multiplication", function () {
        expr = visitor.visitLambda(function () { return 5 * 2; });
        assert.ok(expr.type == Expr.ExpressionType.Binary, "Expected a BinaryExpression");
        assert.ok(expr.operator == Expr.BinaryOperatorType.Multiplication, "Expected a binary operation of multiplication");
    });
    it("it should handle binary operation for division", function () {
        expr = visitor.visitLambda(function () { return 5 / 2; });
        assert.ok(expr.type == Expr.ExpressionType.Binary, "Expected a BinaryExpression");
        assert.ok(expr.operator == Expr.BinaryOperatorType.Division, "Expected a binary operation of division");
    });
    it("it should handle binary operation for modulus", function () {
        expr = visitor.visitLambda(function () { return 5 % 2; });
        assert.ok(expr.type == Expr.ExpressionType.Binary, "Expected a BinaryExpression");
        assert.ok(expr.operator == Expr.BinaryOperatorType.Modulus, "Expected a binary operation of modulus");
    });
    it("it should handle binary operation for and", function () {
        expr = visitor.visitLambda(function () { return 5 & 2; });
        assert.ok(expr.type == Expr.ExpressionType.Binary, "Expected a BinaryExpression");
        assert.ok(expr.operator == Expr.BinaryOperatorType.And, "Expected a binary operation of and");
    });
    it("it should handle binary operation for or", function () {
        expr = visitor.visitLambda(function () { return 5 | 2; });
        assert.ok(expr.type == Expr.ExpressionType.Binary, "Expected a BinaryExpression");
        assert.ok(expr.operator == Expr.BinaryOperatorType.Or, "Expected a binary operation of or");
    });
    it("it should handle binary operation for left shift", function () {
        expr = visitor.visitLambda(function () { return 5 << 2; });
        assert.ok(expr.type == Expr.ExpressionType.Binary, "Expected a BinaryExpression");
        assert.ok(expr.operator == Expr.BinaryOperatorType.LeftShift, "Expected a binary operation of left shift");
    });
    it("it should handle binary operation for right shift", function () {
        expr = visitor.visitLambda(function () { return 5 >> 2; });
        assert.ok(expr.type == Expr.ExpressionType.Binary, "Expected a BinaryExpression");
        assert.ok(expr.operator == Expr.BinaryOperatorType.RightShift, "Expected a binary operation of right shift");
    });
    it("it should handle binary operation for zero-fill right shift", function () {
        expr = visitor.visitLambda(function () { return 5 >>> 2; });
        assert.ok(expr.type == Expr.ExpressionType.Binary, "Expected a BinaryExpression");
        assert.ok(expr.operator == Expr.BinaryOperatorType.RightShift, "Expected a binary operation of right shift");
    });
    it("it should handle binary operation for exlusive or", function () {
        expr = visitor.visitLambda(function () { return 5 ^ 2; });
        assert.ok(expr.type == Expr.ExpressionType.Binary, "Expected a BinaryExpression");
        assert.ok(expr.operator == Expr.BinaryOperatorType.ExclusiveOr, "Expected a binary operation of exclusive or");
    });
});
//# sourceMappingURL=expressionvisitor_binary_expression.js.map