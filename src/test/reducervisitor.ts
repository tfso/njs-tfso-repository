import * as assert from 'assert';
import * as Expr from './../linq/expressions/expressionvisitor';
import { ReducerVisitor } from './../linq/expressions/reducervisitor';

describe("When using Reducer for ExpressionVisitor", () => {
    var reducer: ReducerVisitor,
        expr: Expr.IExpression;

    beforeEach(() => {
        reducer = new ReducerVisitor({ number: 5, array: [8,7,6,5,4,3,2,1] });
    })

    it("should evaluate a simple expression with binary operation", () => {

        expr = reducer.visitLambda(() => 2 + 3);

        assert.ok(expr.type == Expr.ExpressionType.Literal, "Expected a literal");
        assert.ok((<Expr.ILiteralExpression>expr).value == 5, "Expected a literal of value 5");
    })

    it("should evaluate a expression with binary operation", () => {

        expr = reducer.visitLambda(() => this.number + 3);

        //assert.equal(reducer.evaluate(expr, { number: 5 }), 8);

        assert.ok(expr.type == Expr.ExpressionType.Literal, "Expected a literal");
        assert.ok((<Expr.ILiteralExpression>expr).value == 8, "Expected a literal of value 8");
    })

    it("should evaluate expression", () => {

        expr = reducer.visitLambda(() => this.number == 2 + 3);

        assert.ok(expr.type == Expr.ExpressionType.Literal, "Expected a literal");
        assert.ok((<Expr.ILiteralExpression>expr).value == true, "Expected a literal of value 'true'");
    })

    it("should reduce expresion to a minimal expression", () => {

        expr = reducer.visitLambda(() => this.unknown == 2 + 3);

        assert.ok(expr.type == Expr.ExpressionType.Logical, "Expected a logical expression");
        assert.ok((<Expr.ILogicalExpression>expr).operator == Expr.LogicalOperatorType.Equal, "Expected a logical expression with operator equal");
        assert.ok((<Expr.ILogicalExpression>expr).left.type == Expr.ExpressionType.Member, "Expected a member expression at left side");
        assert.ok((<Expr.ILogicalExpression>expr).right.type == Expr.ExpressionType.Literal, "Expected a literal expression at right side");
        assert.ok((<Expr.ILiteralExpression>(<Expr.ILogicalExpression>expr).right).value == 5, "Expected a literal expression at right side of value 5");
    })

    it("should have a solvable expression using valid scope", () => {

        expr = reducer.visitLambda(() => this.number == 2 + 3);

        assert.ok(reducer.isSolvable == true, "Expected a solvable expression");
        assert.ok(expr.type == Expr.ExpressionType.Literal, "Expected a literal expression");
        assert.ok((<Expr.ILiteralExpression>expr).value == true, "Expected the literal value to be true");
    })

    it("should have a solvable expression using valid scope", () => {

        expr = reducer.visitLambda(() => this.number == 2 + 3);

        assert.ok(reducer.isSolvable == true, "Expected a solvable expression");
    })

    it("should have a unsolvable expression using unknown scope", () => {
        expr = reducer.visitLambda(() => this.unknown == 2 + 3);

        assert.ok(reducer.isSolvable == false, "Expected a unsolvable expression");
    })

    it("should have a unsolvable expression using valid scope that isn't passed in", () => {

        reducer = new ReducerVisitor();
        expr = reducer.visitLambda(() => this.number == 2 + 3);

        assert.ok(reducer.isSolvable == false, "Expected a unsolvable expression");
    })

    it("should have a solvable expression using valid scope that is passed into constructor", () => {

        reducer = new ReducerVisitor({ number: 5 });
        expr = reducer.visitLambda(() => this.number == 2 + 3);

        assert.ok(reducer.isSolvable == true, "Expected a solvable expression");
        assert.ok(expr.type == Expr.ExpressionType.Literal, "Expected a literal");
        assert.ok((<Expr.ILiteralExpression>expr).value == true, "Expected a literal of value 'true'");
    })

    it("should have a solvable expression using valid parameter", () => {
        reducer = new ReducerVisitor();
        expr = reducer.visitLambda((myobject: any) => myobject.number == 2 + 3);

        assert.ok(reducer.isSolvable == true, "Expected a solvable expression");
    })

    it("should have a solvable expression using valid parameter", () => {

        expr = reducer.visitLambda((myobject: any) => myobject.number == 2 + 3);

        assert.ok(reducer.isSolvable == true, "Expected a solvable expression");
        assert.ok(expr.type == Expr.ExpressionType.Literal, "Expected a literal");
        assert.ok((<Expr.ILiteralExpression>expr).value == true, "Expected a literal of value 'true'");
    })

    it("should have a solvable expression using named parameters", () => {
        reducer = new ReducerVisitor();
        expr = reducer.visitLambda((myobject: any, num: number, letter: string) => myobject.number == 2 + 3 && num == 5 && letter == 'a', 5, 'a');

        assert.ok(reducer.isSolvable == true, "Expected a solvable expression");
        assert.ok(expr.type == Expr.ExpressionType.Logical, "Expected a logical expression");

    })

    it("should have a solvable expression using named parameters", () => {

        expr = reducer.visitLambda((myobject: any, num: number, letter: string) => myobject.number == 2 + 3 && num == 5 && letter == 'a', 5, 'a');

        assert.ok(reducer.isSolvable == true, "Expected a solvable expression");
        assert.ok(expr.type == Expr.ExpressionType.Literal, "Expected a literal");
        assert.ok((<Expr.ILiteralExpression>expr).value == true, "Expected a literal of value 'true'");
    })

    it("should have a solvable expression using object parameters", () => {
        reducer = new ReducerVisitor({
            subobject: {
                number: 5
            }
        });

        expr = reducer.visitLambda((myobject: any, data: any, letter: string) => myobject.subobject.number == 2 + 3 && data.number == 5 && data.letter == 'a' && letter == 'b', { number: 5, letter: 'a' }, 'b');

        assert.ok(reducer.isSolvable == true, "Expected a solvable expression");
        assert.ok(expr.type == Expr.ExpressionType.Literal, "Expected a literal");
        assert.ok((<Expr.ILiteralExpression>expr).value == true, "Expected a literal of value 'true'");

    })

    it("should not overwrite global/this parameters with input parameters", () => {
        reducer = new ReducerVisitor({
            number: 5
        });

        expr = reducer.visitLambda((myobject: any, number: any) => myobject.number == 2 + 3 && number == 6, 6);

        assert.ok(reducer.isSolvable == true, "Expected a solvable expression");
        assert.ok(expr.type == Expr.ExpressionType.Literal, "Expected a literal");
        assert.ok((<Expr.ILiteralExpression>expr).value == true, "Expected a literal of value 'true'");

    })

    it("should handle conditional expression for success", () => {

        expr = reducer.visitLambda(() => this.number == 5 ? true : false);

        assert.ok(reducer.isSolvable == true, "Expected a solvable expression");
        assert.ok(expr.type == Expr.ExpressionType.Literal, "Expected a literal");
        assert.ok((<Expr.ILiteralExpression>expr).value == true, "Expected a literal of value 'true'");
    })

    it("should handle conditional expression for failure", () => {

        expr = reducer.visitLambda(() => this.number > 5 ? true : false);

        assert.ok(reducer.isSolvable == true, "Expected a solvable expression");
        assert.ok(expr.type == Expr.ExpressionType.Literal, "Expected a literal");
        assert.ok((<Expr.ILiteralExpression>expr).value == false, "Expected a literal of value 'false'");
    })

    it("should handle index expressions for variable with index as literal", () => {

        expr = reducer.visitLambda(() => this.array[3] == 5);

        assert.ok(reducer.isSolvable == true, "Expected a solvable expression");
        assert.ok(expr.type == Expr.ExpressionType.Literal, "Expected a literal");
        assert.ok((<Expr.ILiteralExpression>expr).value == true, "Expected a literal of value 'false'");
    })

    it("should handle index expressions for variable with index as expression", () => {

        expr = reducer.visitLambda(() => this.array[1+2] == 5);

        assert.ok(reducer.isSolvable == true, "Expected a solvable expression");
        assert.ok(expr.type == Expr.ExpressionType.Literal, "Expected a literal");
        assert.ok((<Expr.ILiteralExpression>expr).value == true, "Expected a literal of value 'false'");
    })

    it("should handle index expressions for array literal with index as literal", () => {

        expr = reducer.visitLambda(() => [8, 7, 6, 5, 4][3] == 5);

        assert.ok(reducer.isSolvable == true, "Expected a solvable expression");
        assert.ok(expr.type == Expr.ExpressionType.Literal, "Expected a literal");
        assert.ok((<Expr.ILiteralExpression>expr).value == true, "Expected a literal of value 'false'");
    })

    it("should handle index expressions for array literal with index as expression", () => {

        expr = reducer.visitLambda(() => [8, 7, 6, 5, 4][1+2] == 5);

        assert.ok(reducer.isSolvable == true, "Expected a solvable expression");
        assert.ok(expr.type == Expr.ExpressionType.Literal, "Expected a literal");
        assert.ok((<Expr.ILiteralExpression>expr).value == true, "Expected a literal of value 'false'");
    })

    it("should handle index expressions for array literal of expression with index as expression", () => {

        expr = reducer.visitLambda(() => [4+4, 5+2, 3+3, 2+3, 2+2][1 + 2] == 5);

        assert.ok(reducer.isSolvable == true, "Expected a solvable expression");
        assert.ok(expr.type == Expr.ExpressionType.Literal, "Expected a literal");
        assert.ok((<Expr.ILiteralExpression>expr).value == true, "Expected a literal of value 'false'");
    })

    it("should handle index expressions for array literal of expression and variables with index as expression", () => {

        expr = reducer.visitLambda(() => this.array[[8, 7, 6, this.number, 4][1 + 2]] == 3);

        assert.ok(reducer.isSolvable == true, "Expected a solvable expression");
        assert.ok(expr.type == Expr.ExpressionType.Literal, "Expected a literal");
        assert.ok((<Expr.ILiteralExpression>expr).value == true, "Expected a literal of value 'false'");
    })
})
