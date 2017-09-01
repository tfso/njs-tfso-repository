"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const Expr = require("./../linq/expressions/expressionvisitor");
const templateliteralvisitor_1 = require("./../linq/expressions/templateliteralvisitor");
describe("When using TemplateLiteral for ExpressionVisitor", () => {
    var template, vars = { number: 5, array: [8, 7, 6, 5, 4, 3, 2, 1] };
    beforeEach(() => {
        template = new templateliteralvisitor_1.TemplateLiteralVisitor();
    });
    var number = 5;
    it("should handle a simple template literal", () => {
        let reduced = template.visitLambda(() => `My number is ${this.number} and my next is ${this.number + 1}`), expr = template.evaluate(reduced, vars);
        var expression = new templateliteralvisitor_1.TemplateLiteralVisitor().visitLambda(() => `template string adds ${2 + number} to ${2 + 5} like nothing`);
        let val = templateliteralvisitor_1.TemplateLiteralVisitor.evaluate(expression, { number: number });
        //assert.ok(template.isSolvable == true, "Expected a solvable expression");
        assert.ok(expr.type == Expr.ExpressionType.Literal, "Expected a literal");
        assert.ok(expr.value == 'My number is 5 and my next is 6');
    });
});
//# sourceMappingURL=templateliteralvisitor.js.map