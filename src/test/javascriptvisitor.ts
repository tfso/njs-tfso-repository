import * as assert from 'assert';
import * as Expr from './../linq/expressions/expressionvisitor';
import { JavascriptVisitor } from './../linq/expressions/javascriptvisitor';

describe("When using JavascriptVisitor", () => {
    var reducer: JavascriptVisitor,
        vars = { number: 5, string: 'abc', decimal: 5.50, date: new Date("2017-05-10T06:48:00Z"), object: { number: 7 } };

    beforeEach(() => {
        reducer = new JavascriptVisitor();
    })

    it("should evaluate a simple expression with binary operation", () => {
        let reduced = reducer.visitLambda(() => 2 + 3),
            expr = reducer.evaluate(reduced, vars);

        assert.equal(expr.type, Expr.ExpressionType.Literal);
        assert.equal((<Expr.LiteralExpression>expr).value, 5);
    })

    it("should be able to do string operations at literal", () => {
        let reduced = reducer.visitLambda(() => "ABC".toLowerCase()),
            expr = reducer.evaluate(reduced, vars);

        assert.equal(expr.type, Expr.ExpressionType.Literal);
        assert.equal((<Expr.LiteralExpression>expr).value, 'abc');
    })

    it("should be able to do string operations at variables", () => {
        let reduced = reducer.visitLambda(() => this.string.toUpperCase()),
            expr = reducer.evaluate(reduced, vars);

        assert.equal(expr.type, Expr.ExpressionType.Literal);
        assert.equal((<Expr.LiteralExpression>expr).value, 'ABC');
    })

    it("should evaluate a expression with date as type", () => {
        let reduced = reducer.visitLambda(() => new Date('2017-06-01Z') > this.date),
            expr = reducer.evaluate(reduced, vars);

        assert.equal(expr.type, Expr.ExpressionType.Literal);
        assert.equal((<Expr.LiteralExpression>expr).value, true);
    })

})