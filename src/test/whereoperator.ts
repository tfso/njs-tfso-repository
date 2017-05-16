import assert = require('assert');

import { WhereOperator } from './../linq/operators/whereoperator';
import { IExpression, ExpressionType  } from './../linq/expressions/expression';
import { ILogicalExpression, LogicalOperatorType } from './../linq/expressions/logicalexpression';
import { IIdentifierExpression } from './../linq/expressions/identifierexpression';
import { ILiteralExpression } from './../linq/expressions/literalexpression';

interface ICar {
    id: number
    location: string

    registrationYear: number
}

describe("When using WhereOperator", () => {
    beforeEach(() => {

    })

    it("should intersect expression properties that is only and'ed", () => {
        let where = new WhereOperator<ICar>('Javascript', car => car.registrationYear == 2015 && car.location == 'NO' && car.id > 5),
            intersection = where.getExpressionIntersection();

        assert.equal(intersection.length, 3, "Expected trhee expressions from intersection");
    });

    it("should interesect expression properties that is common", () => {
        let where = new WhereOperator<ICar>('Javascript', car => (car.registrationYear == 2015 && car.location == 'NO') || car.registrationYear == 2015 || (car.location == 'SE' && car.registrationYear == 2015)),
            intersection = where.getExpressionIntersection();

        assert.equal(intersection.length, 1, "Expected one expression from intersection");
        assert.equal(intersection[0].type, ExpressionType.Logical);
        assert.equal((<ILogicalExpression>intersection[0]).operator, LogicalOperatorType.Equal);
        assert.equal((<ILogicalExpression>intersection[0]).left.type, ExpressionType.Member);
        assert.equal((<ILogicalExpression>intersection[0]).right.type, ExpressionType.Literal);
    })

    it("should interesect expression properties that is common but inverted", () => {
        let where = new WhereOperator<ICar>('Javascript', car => (car.registrationYear >= 2015 && car.location == 'NO') || 2015 <= car.registrationYear || (car.location == 'SE' && car.registrationYear >= 2015)),
            intersection = where.getExpressionIntersection();

        assert.equal(intersection.length, 1, "Expected one expression from intersection");
        assert.equal(intersection[0].type, ExpressionType.Logical);
        assert.equal((<ILogicalExpression>intersection[0]).operator, LogicalOperatorType.GreaterOrEqual);
        assert.equal((<ILogicalExpression>intersection[0]).left.type, ExpressionType.Member);
        assert.equal((<ILogicalExpression>intersection[0]).right.type, ExpressionType.Literal);
    })

    it("should interesect expression properties that is not common", () => {
        let where = new WhereOperator<ICar>('Javascript', car => (car.registrationYear > 2015 && car.location == 'NO') || car.registrationYear == 2015 || (car.location == 'SE' && car.registrationYear == 2015)),
            intersection = where.getExpressionIntersection();

        assert.equal(intersection.length, 0, "Expected zero expressions from intersection");
    })

    it("should intersect expression properties and simplify them", () => {
        let where = new WhereOperator<ICar>('Javascript', car => car.registrationYear >= 2015),
            intersection = where.getExpressionIntersection();

        assert.equal(intersection.length, 1, "Expected one expression from intersection");
        assert.equal(intersection[0].type, ExpressionType.Logical);
        assert.equal((<ILogicalExpression>intersection[0]).operator, LogicalOperatorType.GreaterOrEqual);

        assert.equal((<ILogicalExpression>intersection[0]).left.type, ExpressionType.Identifier);
        assert.equal((<IIdentifierExpression>(<ILogicalExpression>intersection[0]).left).name, "registrationYear");

        assert.equal((<ILogicalExpression>intersection[0]).right.type, ExpressionType.Literal);
        assert.equal((<ILiteralExpression>(<ILogicalExpression>intersection[0]).right).value, 2015);
    });

    it("should intersect inverted expression properties and simplify them", () => {
        let where = new WhereOperator<ICar>('Javascript', car => 2015 <= car.registrationYear),
            intersection = where.getExpressionIntersection();

        assert.equal(intersection.length, 1, "Expected one expression from intersection");
        assert.equal(intersection[0].type, ExpressionType.Logical);
        assert.equal((<ILogicalExpression>intersection[0]).operator, LogicalOperatorType.GreaterOrEqual);

        assert.equal((<ILogicalExpression>intersection[0]).left.type, ExpressionType.Identifier);
        assert.equal((<IIdentifierExpression>(<ILogicalExpression>intersection[0]).left).name, "registrationYear");

        assert.equal((<ILogicalExpression>intersection[0]).right.type, ExpressionType.Literal);
        assert.equal((<ILiteralExpression>(<ILogicalExpression>intersection[0]).right).value, 2015);
    });

    it("should intersect OData expression properties and simplify them", () => {
        let where = new WhereOperator<ICar>('OData', "registrationYear ge 2015"),
            intersection = where.getExpressionIntersection();

        assert.equal(intersection.length, 1, "Expected one expression from intersection");
        assert.equal(intersection[0].type, ExpressionType.Logical);
        assert.equal((<ILogicalExpression>intersection[0]).operator, LogicalOperatorType.GreaterOrEqual);

        assert.equal((<ILogicalExpression>intersection[0]).left.type, ExpressionType.Identifier);
        assert.equal((<IIdentifierExpression>(<ILogicalExpression>intersection[0]).left).name, "registrationYear");

        assert.equal((<ILogicalExpression>intersection[0]).right.type, ExpressionType.Literal);
        assert.equal((<ILiteralExpression>(<ILogicalExpression>intersection[0]).right).value, 2015);
    });

    it("should intersect inverted OData expression properties and simplify them", () => {
        let where = new WhereOperator<ICar>('OData', "2015 le car.registrationYear"),
            intersection = where.getExpressionIntersection();

        assert.equal(intersection.length, 1, "Expected one expression from intersection");
        assert.equal(intersection[0].type, ExpressionType.Logical);
        assert.equal((<ILogicalExpression>intersection[0]).operator, LogicalOperatorType.GreaterOrEqual);

        assert.equal((<ILogicalExpression>intersection[0]).left.type, ExpressionType.Identifier);
        assert.equal((<IIdentifierExpression>(<ILogicalExpression>intersection[0]).left).name, "registrationYear");

        assert.equal((<ILogicalExpression>intersection[0]).right.type, ExpressionType.Literal);
        assert.equal((<ILiteralExpression>(<ILogicalExpression>intersection[0]).right).value, 2015);
    });
});