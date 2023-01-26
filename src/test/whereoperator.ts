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

        assert.equal(intersection.length, 3, "Expected three expressions from intersection");
    });

    it("should interesect expression properties that is common", () => {
        let where = new WhereOperator<ICar>('Javascript', car => (car.registrationYear == 2015 && car.location == 'NO') || car.registrationYear == 2015 || (car.location == 'SE' && car.registrationYear == 2015)),
            intersection = where.getExpressionIntersection();

        assert.equal(intersection.length, 1, "Expected one expression from intersection");
        assert.equal(intersection[0].type, ExpressionType.Logical);
        assert.equal((<ILogicalExpression>intersection[0]).operator, LogicalOperatorType.Equal);
        assert.equal((<ILogicalExpression>intersection[0]).left.type, ExpressionType.Identifier);
        assert.equal((<ILogicalExpression>intersection[0]).right.type, ExpressionType.Literal);
    })

    it("should interesect expression properties that is common but inverted", () => {
        let where = new WhereOperator<ICar>('Javascript', car => (car.registrationYear >= 2015 && car.location == 'NO') || 2015 <= car.registrationYear || (car.location == 'SE' && car.registrationYear >= 2015)),
            intersection = where.getExpressionIntersection();

        assert.equal(intersection.length, 1, "Expected one expression from intersection");
        assert.equal(intersection[0].type, ExpressionType.Logical);
        assert.equal((<ILogicalExpression>intersection[0]).operator, LogicalOperatorType.GreaterOrEqual);
        assert.equal((<ILogicalExpression>intersection[0]).left.type, ExpressionType.Identifier);
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
        let where = new WhereOperator<ICar>('OData', "2015 le registrationYear"),
            intersection = where.getExpressionIntersection();

        assert.equal(intersection.length, 1, "Expected one expression from intersection");
        assert.equal(intersection[0].type, ExpressionType.Logical);
        assert.equal((<ILogicalExpression>intersection[0]).operator, LogicalOperatorType.GreaterOrEqual);

        assert.equal((<ILogicalExpression>intersection[0]).left.type, ExpressionType.Identifier);
        assert.equal((<IIdentifierExpression>(<ILogicalExpression>intersection[0]).left).name, "registrationYear");

        assert.equal((<ILogicalExpression>intersection[0]).right.type, ExpressionType.Literal);
        assert.equal((<ILiteralExpression>(<ILogicalExpression>intersection[0]).right).value, 2015);
    });

    it("should be able to count expression properties", () => {
        let where = new WhereOperator<ICar>('Javascript', car => (car.registrationYear >= 2015 && car.location == 'NO') || 2015 <= car.registrationYear || (car.location == 'SE' && car.registrationYear >= 2015)),
            counts = where.getExpressionCount();

        assert.equal(counts, 5);
    })

    it("should be able to count expression properties for odata", () => {
        let where = new WhereOperator<ICar>('OData', `date ge 2023-01-01 and date le 2023-02-01 and contains(tolower(invoiceNo), tolower('invhoi2'))`),
            counts = where.getExpressionCount();

        assert.equal(counts, 3);
    })


    it("should be able to count and find intersections", () => {
        let where = new WhereOperator<ICar>('OData', `date ge 2023-01-01 and date le 2023-02-01 and contains(tolower(invoiceNo), tolower('invhoi2'))`),
            intersection = where.getExpressionIntersection(),
            counts = where.getExpressionCount();

        assert.equal(counts, intersection.length);
    })

    it("should be able to count expression properties where there is difference", () => {
        let where = new WhereOperator<ICar>('Javascript', car => (car.registrationYear >= 2015 && car.location == 'NO') || 2015 <= car.registrationYear || (car.location == 'SE' && car.registrationYear >= 2015)),
            intersection = where.getExpressionIntersection(),
            counts = where.getExpressionCount();

        assert.notEqual(counts, intersection);
    })

    it("should get union expression properties", () => {
        let where = new WhereOperator<ICar>('Javascript', car => (car.registrationYear == 2015 && car.location == 'NO') || car.registrationYear == 2015 || (car.location == 'SE' && car.registrationYear == 2015)),
            intersection = where.getExpressionUnion();

        assert.equal(intersection.length, 5, "Expected 5 expression from union");
    })

    it("should get expression groups", () => {
        let where = new WhereOperator<ICar>('Javascript', car => (car.registrationYear == 2015 && car.location == 'NO') || car.registrationYear == 2015 || (car.location == 'SE' && car.registrationYear == 2015)),
            groups = Array
                        .from(where.getExpressionGroups())
                        .map(group => Array.from(group));

        assert.equal(groups.length, 3, "Expected 3 expression groups");
        assert.equal(groups[0].length, 2);
        assert.equal(groups[1].length, 1);
        assert.equal(groups[2].length, 2);
    })
});