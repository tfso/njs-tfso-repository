import assert = require('assert');

import { WhereOperator } from './../linq/operators/whereoperator';
import { IExpression, ExpressionType  } from './../linq/expressions/expression';
import { LogicalExpression, LogicalOperatorType } from './../linq/expressions/logicalexpression';

interface ICar {
    id: number
    location: string

    registrationYear: number
}

describe("When using WhereOperator", () => {
    beforeEach(() => {

    })

    it("it should interesect expression properties that is common", () => {

        let where = new WhereOperator<ICar>('Javascript', car => (car.registrationYear == 2015 && car.location == 'NO') || car.registrationYear == 2015 || (car.location == 'SE' && car.registrationYear == 2015)),
            intersection = where.getExpressionIntersection();
        

        assert.equal(intersection.length, 1, "Expected one expression from intersection");
        assert.equal(intersection[0].type, ExpressionType.Logical);
        assert.equal((<LogicalExpression>intersection[0]).operator, LogicalOperatorType.Equal);
        assert.equal((<LogicalExpression>intersection[0]).left.type, ExpressionType.Member);
        assert.equal((<LogicalExpression>intersection[0]).right.type, ExpressionType.Literal);
    })

    it("it should interesect expression properties that is common but inverted", () => {

        let where = new WhereOperator<ICar>('Javascript', car => (car.registrationYear >= 2015 && car.location == 'NO') || 2015 <= car.registrationYear || (car.location == 'SE' && car.registrationYear >= 2015)),
            intersection = where.getExpressionIntersection();

        assert.equal(intersection.length, 1, "Expected one expression from intersection");
        assert.equal(intersection[0].type, ExpressionType.Logical);
        assert.equal((<LogicalExpression>intersection[0]).operator, LogicalOperatorType.GreaterOrEqual);
        assert.equal((<LogicalExpression>intersection[0]).left.type, ExpressionType.Member);
        assert.equal((<LogicalExpression>intersection[0]).right.type, ExpressionType.Literal);
    })

    it("it should interesect expression properties that is not common", () => {
        let where = new WhereOperator<ICar>('Javascript', car => (car.registrationYear > 2015 && car.location == 'NO') || car.registrationYear == 2015 || (car.location == 'SE' && car.registrationYear == 2015)),
            intersection = where.getExpressionIntersection();

        assert.equal(intersection.length, 0, "Expected zero expressions from intersection");
    })
});