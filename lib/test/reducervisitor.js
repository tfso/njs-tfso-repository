"use strict";
var _this = this;
var assert = require('assert');
var Expr = require('./../expressions/expressionvisitor');
var reducervisitor_1 = require('./../expressions/reducervisitor');
describe("When using Reducer for ExpressionVisitor", function () {
    var reducer, expr;
    beforeEach(function () {
        reducer = new reducervisitor_1.ReducerVisitor({ number: 5 });
    });
    it("should evaluate a simple expression with binary operation", function () {
        expr = reducer.visitLambda(function () { return 2 + 3; });
        assert.ok(expr.type == Expr.ExpressionType.Literal, "Expected a literal");
        assert.ok(expr.value == 5, "Expected a literal of value 5");
    });
    it("should evaluate a expression with binary operation", function () {
        expr = reducer.visitLambda(function () { return _this.number + 3; });
        assert.ok(expr.type == Expr.ExpressionType.Literal, "Expected a literal");
        assert.ok(expr.value == 8, "Expected a literal of value 8");
    });
    it("should evaluate expression", function () {
        expr = reducer.visitLambda(function () { return _this.number == 2 + 3; });
        assert.ok(expr.type == Expr.ExpressionType.Literal, "Expected a literal");
        assert.ok(expr.value == true, "Expected a literal of value 'true'");
    });
    it("should reduce expresion to a minimal expression", function () {
        expr = reducer.visitLambda(function () { return _this.unknown == 2 + 3; });
        assert.ok(expr.type == Expr.ExpressionType.Logical, "Expected a logical expression");
        assert.ok(expr.operator == Expr.LogicalOperatorType.Equal, "Expected a logical expression with operator equal");
        assert.ok(expr.left.type == Expr.ExpressionType.Member, "Expected a member expression at left side");
        assert.ok(expr.right.type == Expr.ExpressionType.Literal, "Expected a literal expression at right side");
        assert.ok(expr.right.value == 5, "Expected a literal expression at right side of value 5");
    });
    it("should have a solvable expression using valid scope", function () {
        expr = reducer.visitLambda(function () { return _this.number == 2 + 3; });
        assert.ok(reducer.isSolvable == true, "Expected a solvable expression");
        assert.ok(expr.type == Expr.ExpressionType.Literal, "Expected a literal expression");
        assert.ok(expr.value == true, "Expected the literal value to be true");
    });
    it("should have a solvable expression using valid scope", function () {
        expr = reducer.visitLambda(function () { return _this.number == 2 + 3; });
        assert.ok(reducer.isSolvable == true, "Expected a solvable expression");
    });
    it("should have a unsolvable expression using unknown scope", function () {
        expr = reducer.visitLambda(function () { return _this.unknown == 2 + 3; });
        assert.ok(reducer.isSolvable == false, "Expected a unsolvable expression");
    });
    it("should have a unsolvable expression using valid scope that isn't passed in", function () {
        reducer = new reducervisitor_1.ReducerVisitor();
        expr = reducer.visitLambda(function () { return _this.number == 2 + 3; });
        assert.ok(reducer.isSolvable == false, "Expected a unsolvable expression");
    });
    it("should have a solvable expression using valid scope that is passed in", function () {
        reducer = new reducervisitor_1.ReducerVisitor();
        expr = reducer.visitLambda(function () { return _this.number == 2 + 3; }, { number: 5 });
        assert.ok(reducer.isSolvable == true, "Expected a solvable expression");
        assert.ok(expr.type == Expr.ExpressionType.Literal, "Expected a literal");
        assert.ok(expr.value == true, "Expected a literal of value 'true'");
    });
    it("should have a solvable expression using valid parameter", function () {
        expr = reducer.visitLambda(function (myobject) { return myobject.number == 2 + 3; });
        assert.ok(reducer.isSolvable == true, "Expected a solvable expression");
    });
    it("should have a solvable expression using named parameters", function () {
        expr = reducer.visitLambda(function (myobject, num, letter) { return myobject.number == 2 + 3 && num == 5 && letter == 'a'; }, 5, 'a');
        assert.ok(reducer.isSolvable == true, "Expected a solvable expression");
        assert.ok(expr.type == Expr.ExpressionType.Logical, "Expected a logical expression");
    });
});
//# sourceMappingURL=reducervisitor.js.map