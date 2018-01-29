"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const Expr = require("./../linq/expressions/expressionvisitor");
const templateliteralvisitor_1 = require("./../linq/expressions/templateliteralvisitor");
describe("When using TemplateLiteral for ExpressionVisitor", () => {
    var template, vars = { number: 5, array: [8, 7, 6, 5, 4, 3, 2, 1] };
    beforeEach(() => {
        template = new templateliteralvisitor_1.TemplateLiteralVisitor((value) => {
            switch (typeof value) {
                case 'object':
                    if (value.hasOwnProperty('key'))
                        return '<a href="#' + value['key'] + '">' + value['value'] + '</a>';
                    else
                        return '<a href="#' + value['value'] + '">' + value['value'] + '</a>';
                default:
                    return value;
            }
        });
    });
    var number = 5;
    it("should handle a simple template literal", () => {
        let reduced = template.visitLambda(() => `My number is ${this.number} and my next is ${this.number + 1}`), expr = template.evaluate(reduced, vars);
        //assert.ok(template.isSolvable == true, "Expected a solvable expression");
        assert.ok(expr.type == Expr.ExpressionType.Literal, "Expected a literal");
        assert.ok(expr.value == 'My number is 5 and my next is 6');
    });
    it("should handle objects as expression", () => {
        let reduced = template.visitLambda(() => `My number is ${{ key: 0 + 1, value: this.number + 1 }} and my next is ${this.number + 1}`);
        assert.equal(reduced.type, Expr.ExpressionType.TemplateLiteral);
        assert.equal(reduced.elements.length, 4);
        assert.equal(reduced.elements[1].type, Expr.ExpressionType.Object);
        assert.equal(reduced.elements[3].type, Expr.ExpressionType.Binary);
        let expr = template.evaluate(reduced, vars);
        assert.ok(expr.value == 'My number is <a href="#1">6</a> and my next is 6');
    });
    it("should reduce it as much as possible", () => {
        let reduced = template.visitLambda(() => `My number is ${this.number} and my next is ${5 + 1}`);
        assert.equal(reduced.type, Expr.ExpressionType.TemplateLiteral);
        assert.equal(reduced.elements.length, 4);
        assert.equal(reduced.elements[3].type, Expr.ExpressionType.Literal);
        assert.equal(reduced.elements[3].value, '6');
        let compiled = template.evaluate(reduced, vars);
        assert.ok(compiled.value == 'My number is 5 and my next is 6');
    });
    it("should handle the signature of tagged template literals", () => {
        let expr = template.visitLambda(() => `My number is ${5} and my next is ${5 + 1}`);
        let es6literal = tag `My number is ${5} and my next is ${5 + 1}`;
        assert.equal(expr.type, Expr.ExpressionType.TemplateLiteral);
        assert.equal(expr.elements.length, 4);
        assert.equal(expr.literals.length, 2);
        assert.equal(expr.expressions.length, 2);
        for (let literal of expr.literals)
            assert.equal(literal.value, es6literal.literals.shift());
        for (let expression of expr.expressions)
            assert.equal(expression.value, es6literal.expressions.shift());
    });
    it("should handle template literal expression as string", () => {
        let expr = template.visitLambdaExpression('`My number is ${5} and my next is ${5 + 1}`');
        assert.equal(expr.type, Expr.ExpressionType.TemplateLiteral);
        assert.equal(expr.elements.length, 4);
        assert.equal(expr.literals.length, 2);
        assert.equal(expr.expressions.length, 2);
    });
    it("should handle a complex template literal", () => {
        let reduced = template.visitLambda(() => `My answer is ${{ 'Yes': 1, 'No': 0 }[this.answer] == 1 ? 'Yeah' : 'Nope'} all ${5 + 2} days`);
        let firstAnswer = template.evaluate(reduced, { answer: 'Yes' });
        assert.ok(firstAnswer.value == 'My answer is Yeah all 7 days');
        let secondAnswer = template.evaluate(reduced, { answer: 'No' });
        assert.ok(secondAnswer.value == 'My answer is Nope all 7 days');
    });
});
function tag(parts, ...expressions) {
    return {
        literals: Array.from(parts),
        expressions: Array.from(expressions)
    };
}
//# sourceMappingURL=templateliteralvisitor.js.map