import * as assert from 'assert';
import * as Expr from './../linq/expressions/expressionvisitor';
import { TemplateLiteralVisitor } from './../linq/expressions/templateliteralvisitor';

describe("When using TemplateLiteral for ExpressionVisitor", () => {
    var template: TemplateLiteralVisitor,
        vars = { number: 5, array: [8, 7, 6, 5, 4, 3, 2, 1] }

    beforeEach(() => {
        template = new TemplateLiteralVisitor((value) => {
            switch (typeof value)
            {
                case 'object':
                    if ((<Object>value).hasOwnProperty('key'))
                        return '<a href="#' + value['key'] + '">' + value['value'] + '</a>';
                    else
                        return '<a href="#' + value['value'] + '">' + value['value'] + '</a>';
                        
                default:
                    return value;
            }
        });
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

    it("should handle objects as expression", () => {

        let reduced = template.visitLambda(() => `My number is ${{ key: 0 + 1, value: this.number + 1 }} and my next is ${this.number + 1}`)
            
        assert.equal(reduced.type, Expr.ExpressionType.TemplateLiteral);
        assert.equal((<Expr.ITemplateLiteralExpression>reduced).elements.length, 4);

        assert.equal((<Expr.ITemplateLiteralExpression>reduced).elements[1].type, Expr.ExpressionType.Object);
        assert.equal((<Expr.ITemplateLiteralExpression>reduced).elements[3].type, Expr.ExpressionType.Binary);

        let expr = template.evaluate(reduced, vars);

        assert.ok((<Expr.ILiteralExpression>expr).value == 'My number is <a href="#1">6</a> and my next is 6');
    })
})