"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const whereoperator_1 = require("./../linq/operators/whereoperator");
const expression_1 = require("./../linq/expressions/expression");
const logicalexpression_1 = require("./../linq/expressions/logicalexpression");
describe("When using WhereOperator", () => {
    beforeEach(() => {
    });
    it("should intersect expression properties that is only and'ed", () => {
        let where = new whereoperator_1.WhereOperator('Javascript', car => car.registrationYear == 2015 && car.location == 'NO' && car.id > 5), intersection = where.getExpressionIntersection();
        assert.equal(intersection.length, 3, "Expected trhee expressions from intersection");
    });
    it("should interesect expression properties that is common", () => {
        let where = new whereoperator_1.WhereOperator('Javascript', car => (car.registrationYear == 2015 && car.location == 'NO') || car.registrationYear == 2015 || (car.location == 'SE' && car.registrationYear == 2015)), intersection = where.getExpressionIntersection();
        assert.equal(intersection.length, 1, "Expected one expression from intersection");
        assert.equal(intersection[0].type, expression_1.ExpressionType.Logical);
        assert.equal(intersection[0].operator, logicalexpression_1.LogicalOperatorType.Equal);
        assert.equal(intersection[0].left.type, expression_1.ExpressionType.Identifier);
        assert.equal(intersection[0].right.type, expression_1.ExpressionType.Literal);
    });
    it("should interesect expression properties that is common but inverted", () => {
        let where = new whereoperator_1.WhereOperator('Javascript', car => (car.registrationYear >= 2015 && car.location == 'NO') || 2015 <= car.registrationYear || (car.location == 'SE' && car.registrationYear >= 2015)), intersection = where.getExpressionIntersection();
        assert.equal(intersection.length, 1, "Expected one expression from intersection");
        assert.equal(intersection[0].type, expression_1.ExpressionType.Logical);
        assert.equal(intersection[0].operator, logicalexpression_1.LogicalOperatorType.GreaterOrEqual);
        assert.equal(intersection[0].left.type, expression_1.ExpressionType.Identifier);
        assert.equal(intersection[0].right.type, expression_1.ExpressionType.Literal);
    });
    it("should interesect expression properties that is not common", () => {
        let where = new whereoperator_1.WhereOperator('Javascript', car => (car.registrationYear > 2015 && car.location == 'NO') || car.registrationYear == 2015 || (car.location == 'SE' && car.registrationYear == 2015)), intersection = where.getExpressionIntersection();
        assert.equal(intersection.length, 0, "Expected zero expressions from intersection");
    });
    it("should intersect expression properties and simplify them", () => {
        let where = new whereoperator_1.WhereOperator('Javascript', car => car.registrationYear >= 2015), intersection = where.getExpressionIntersection();
        assert.equal(intersection.length, 1, "Expected one expression from intersection");
        assert.equal(intersection[0].type, expression_1.ExpressionType.Logical);
        assert.equal(intersection[0].operator, logicalexpression_1.LogicalOperatorType.GreaterOrEqual);
        assert.equal(intersection[0].left.type, expression_1.ExpressionType.Identifier);
        assert.equal(intersection[0].left.name, "registrationYear");
        assert.equal(intersection[0].right.type, expression_1.ExpressionType.Literal);
        assert.equal(intersection[0].right.value, 2015);
    });
    it("should intersect inverted expression properties and simplify them", () => {
        let where = new whereoperator_1.WhereOperator('Javascript', car => 2015 <= car.registrationYear), intersection = where.getExpressionIntersection();
        assert.equal(intersection.length, 1, "Expected one expression from intersection");
        assert.equal(intersection[0].type, expression_1.ExpressionType.Logical);
        assert.equal(intersection[0].operator, logicalexpression_1.LogicalOperatorType.GreaterOrEqual);
        assert.equal(intersection[0].left.type, expression_1.ExpressionType.Identifier);
        assert.equal(intersection[0].left.name, "registrationYear");
        assert.equal(intersection[0].right.type, expression_1.ExpressionType.Literal);
        assert.equal(intersection[0].right.value, 2015);
    });
    it("should intersect OData expression properties and simplify them", () => {
        let where = new whereoperator_1.WhereOperator('OData', "registrationYear ge 2015"), intersection = where.getExpressionIntersection();
        assert.equal(intersection.length, 1, "Expected one expression from intersection");
        assert.equal(intersection[0].type, expression_1.ExpressionType.Logical);
        assert.equal(intersection[0].operator, logicalexpression_1.LogicalOperatorType.GreaterOrEqual);
        assert.equal(intersection[0].left.type, expression_1.ExpressionType.Identifier);
        assert.equal(intersection[0].left.name, "registrationYear");
        assert.equal(intersection[0].right.type, expression_1.ExpressionType.Literal);
        assert.equal(intersection[0].right.value, 2015);
    });
    it("should intersect inverted OData expression properties and simplify them", () => {
        let where = new whereoperator_1.WhereOperator('OData', "2015 le registrationYear"), intersection = where.getExpressionIntersection();
        assert.equal(intersection.length, 1, "Expected one expression from intersection");
        assert.equal(intersection[0].type, expression_1.ExpressionType.Logical);
        assert.equal(intersection[0].operator, logicalexpression_1.LogicalOperatorType.GreaterOrEqual);
        assert.equal(intersection[0].left.type, expression_1.ExpressionType.Identifier);
        assert.equal(intersection[0].left.name, "registrationYear");
        assert.equal(intersection[0].right.type, expression_1.ExpressionType.Literal);
        assert.equal(intersection[0].right.value, 2015);
    });
});
//# sourceMappingURL=whereoperator.js.map