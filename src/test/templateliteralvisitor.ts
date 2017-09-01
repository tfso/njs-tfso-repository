import * as assert from 'assert';
import * as Expr from './../linq/expressions/expressionvisitor';
import { TemplateLiteralVisitor } from './../linq/expressions/templateliteralvisitor';

describe("When using TemplateLiteral for ExpressionVisitor", () => {
    var template: TemplateLiteralVisitor,
        vars = { number: 5, array: [8, 7, 6, 5, 4, 3, 2, 1] }

    beforeEach(() => {
        template = new TemplateLiteralVisitor();
    })

    var number = 5;

    it("should handle a simple template literal", () => {
        let reduced = template.visitLambda(() => `My number is ${this.number} and my next is ${this.number + 1}`),
            expr = template.evaluate(reduced, vars);

        var expression = new TemplateLiteralVisitor().visitLambda(() => `template string adds ${2 + number} to ${2+5} like nothing`);

        let val = TemplateLiteralVisitor.evaluate(expression, { number: number })

        //assert.ok(template.isSolvable == true, "Expected a solvable expression");
        assert.ok(expr.type == Expr.ExpressionType.Literal, "Expected a literal");
        assert.ok((<Expr.ILiteralExpression>expr).value == 'My number is 5 and my next is 6');
    })
})