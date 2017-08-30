import * as assert from 'assert';
import * as Expr from './../linq/expressions/expressionvisitor';
import { TemplateLiteralVisitor } from './../linq/expressions/templateliteralvisitor';

describe("When using TemplateLiteral for ExpressionVisitor", () => {
    var template: TemplateLiteralVisitor,
        expr: Expr.IExpression;

    beforeEach(() => {
        template = new TemplateLiteralVisitor({ number: 5, array: [8, 7, 6, 5, 4, 3, 2, 1] });
    })

    it("should handle a simple template literal", () => {
        let expr = template.visitLambda(() => `My number is ${this.number} and my next is ${this.number + 1}`);


        var number: number,
            expression = new TemplateLiteralVisitor().visitLambda(() => `template string adds ${2 + number} like nothing`);

        let value = TemplateLiteralVisitor.evaluate(expression, { number: 5 });


        assert.ok(template.isSolvable == true, "Expected a solvable expression");
        assert.ok(expr.type == Expr.ExpressionType.Literal, "Expected a literal");
        assert.ok((<Expr.ILiteralExpression>expr).value == 'My number is 5 and my next is 6');
    })
})