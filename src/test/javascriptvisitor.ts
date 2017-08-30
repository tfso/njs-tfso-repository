import * as assert from 'assert';
import * as Expr from './../linq/expressions/expressionvisitor';
import { JavascriptVisitor } from './../linq/expressions/javascriptvisitor';

describe("When using JavascriptVisitor", () => {
    var parser: JavascriptVisitor,
        expr: Expr.IExpression;

    beforeEach(() => {
        parser = new JavascriptVisitor({ number: 5, string: 'abc', decimal: 5.50, date: new Date("2017-05-10T06:48:00Z"), object: { number: 7 } });
    })

    it("should evaluate a simple expression with binary operation", () => {
        expr = parser.visitLambda(() => 2 + 3);

        assert.equal(expr.type, Expr.ExpressionType.Literal);
        assert.equal((<Expr.LiteralExpression>expr).value, 5);
    })

    it("should be able to do string operations at literal", () => {
        expr = parser.visitLambda(() => "ABC".toLowerCase());

        assert.equal(expr.type, Expr.ExpressionType.Literal);
        assert.equal((<Expr.LiteralExpression>expr).value, 'abc');
    })

    it("should be able to do string operations at variables", () => {
        expr = parser.visitLambda(() => this.string.toUpperCase());

        assert.equal(expr.type, Expr.ExpressionType.Literal);
        assert.equal((<Expr.LiteralExpression>expr).value, 'ABC');
    })
})