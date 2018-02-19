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

    it("should reduce it as much as possible", () => {
        let reduced = template.visitLambda(() => `My number is ${this.number} and my next is ${5 + 1}`)
            
        assert.equal(reduced.type, Expr.ExpressionType.TemplateLiteral);
        assert.equal((<Expr.ITemplateLiteralExpression>reduced).elements.length, 4);

        assert.equal((<Expr.ITemplateLiteralExpression>reduced).elements[3].type, Expr.ExpressionType.Literal);
        assert.equal((<Expr.ILiteralExpression>(<Expr.ITemplateLiteralExpression>reduced).elements[3]).value, '6');

        let compiled = template.evaluate(reduced, vars);
        assert.ok((<Expr.ILiteralExpression>compiled).value == 'My number is 5 and my next is 6');
    })

    it("should handle the signature of tagged template literals", () => {
        let expr = template.visitLambda(() => `My number is ${5} and my next is ${5 + 1}`);
        let es6literal = tag `My number is ${5} and my next is ${5 + 1}`

        assert.equal(expr.type, Expr.ExpressionType.TemplateLiteral);
        assert.equal((<Expr.ITemplateLiteralExpression>expr).elements.length, 4);

        assert.equal((<Expr.ITemplateLiteralExpression>expr).literals.length, 2);
        assert.equal((<Expr.ITemplateLiteralExpression>expr).expressions.length, 2);

        for(let literal of (<Expr.ITemplateLiteralExpression>expr).literals)
            assert.equal(literal.value, es6literal.literals.shift());

        for(let expression of (<Expr.ITemplateLiteralExpression>expr).expressions)
            assert.equal((<Expr.ILiteralExpression>expression).value, es6literal.expressions.shift());
    })

    it("should handle template literal expression as string", () => {
        let expr = template.visitLambdaExpression('`My number is ${5} and my next is ${5 + 1}`');

        assert.equal(expr.type, Expr.ExpressionType.TemplateLiteral);
        assert.equal((<Expr.ITemplateLiteralExpression>expr).elements.length, 4);

        assert.equal((<Expr.ITemplateLiteralExpression>expr).literals.length, 2);
        assert.equal((<Expr.ITemplateLiteralExpression>expr).expressions.length, 2);
    })

    it("should handle a complex template literal", () => {
        let reduced = template.visitLambda(() => `My answer is ${ {'Yes': 1, 'No': 0}[this.answer] == 1 ? 'Yeah' : 'Nope' } all ${5+2} days`);

        let firstAnswer = template.evaluate(reduced, { answer: 'Yes'});
        assert.ok((<Expr.ILiteralExpression>firstAnswer).value == 'My answer is Yeah all 7 days');

        let secondAnswer = template.evaluate(reduced, { answer: 'No'});
        assert.ok((<Expr.ILiteralExpression>secondAnswer).value == 'My answer is Nope all 7 days');
    })

    it("should handle different escaping of placeholders etc", () => {
        assert.equal((<Expr.ILiteralExpression>template.evaluate(template.visitLambda(() => `My answer is \${1} for now`), {})).value, 'My answer is ${1} for now');
        assert.equal((<Expr.ILiteralExpression>template.evaluate(template.visitLambda(() => `My answer is $\{2} for now`), {})).value, 'My answer is ${2} for now');
        assert.equal((<Expr.ILiteralExpression>template.evaluate(template.visitLambda(() => `My answer is \$\{3} for now`), {})).value, 'My answer is ${3} for now');
        assert.equal((<Expr.ILiteralExpression>template.evaluate(template.visitLambda(() => `My value is $4`), {})).value, 'My value is $4');
        assert.equal((<Expr.ILiteralExpression>template.evaluate(template.visitLambda(() => `My value is \$5`), {})).value, 'My value is \\$5');
    })
})

function tag(parts: TemplateStringsArray, ...expressions: Array<any>) {
    return {
        literals: Array.from(parts),
        expressions: Array.from(expressions)
    }
}