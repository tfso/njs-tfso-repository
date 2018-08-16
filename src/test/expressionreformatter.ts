import * as assert from 'assert'

import Enumerable, { IEnumerable, OperatorType, Sql, SqlLanguage } from './../linq/enumerable'
import { IExpression, ILogicalExpression, LogicalExpression, LogicalOperatorType } from './../linq/expressions/expressionvisitor'

import { SkipOperator } from './../linq/operators/skipoperator'
import { WhereOperator } from './../linq/operators/whereoperator'


import { ReducerVisitor } from './../linq/expressions/reducervisitor'
import { createReadStream } from 'fs';



class Reformatter<T> {

    constructor(private enumerable: Enumerable<T>) {

    }

    public where(): string { 
        let where = this.enumerable.operations.first(WhereOperator)

        if(where) 
            return new Where(where.expression).toString()
    }

    public toString(language?: SqlLanguage) {

    }
}

class ReformatterLogicalExpression extends LogicalExpression {
    constructor(operator: LogicalOperatorType, left: IExpression, right: IExpression) {
        super(operator, left, right)
    }
}

interface IProperty {
    column: string
    name: string
    value: any
}

class Where<T> {
    constructor(private expression: IExpression) {
        
        // if(expression)
        //     this.expression = super.visit(expression)
    }

    public get properties(): Array<IProperty> {
        return null
    }

    public * getProperties(): IterableIterator<IProperty> {

    }

    public * getExpressionIntersection(): IterableIterator<ILogicalExpression> {
        let intersection: Array<ILogicalExpression> = []

        for(let group of this.getExpressionGroups())
            intersection = intersection == null ? Array.from(group) : intersection.filter(expr => intersection.some(intersect => expr.equal(intersect)))
        
        yield *intersection
    }

    public * getExpressionUnion(): IterableIterator<ILogicalExpression> {
        let union: Array<ILogicalExpression> = [];

        for(let group of this.getExpressionGroups())
            union.concat( Array.from(group).filter(expr => union.some(el => !expr.equal(el))))
        
        yield *union
    }

    public getExpressionGroups(): Iterable<IterableIterator<ILogicalExpression>>
    public * getExpressionGroups(expression?: IExpression): Iterable<IterableIterator<ILogicalExpression>> {

    }

    public toString(language?: SqlLanguage) {
        return '';
    }
}

class Select<T> {
    constructor() {

    }
}

class OrderBy<T> {
    constructor() {

    }
}

class Skip<T> {
    constructor() {

    }
}

class Take<T> {
    constructor() {

    }
}


it("should intersection filter properties that is common ", () => {
    let enumerable = new Enumerable<ICar>().where((car: ICar) => (car.registrationYear == 2015 && car.location == 'NO') || car.registrationYear == 2015 || (car.location == 'SE' && car.registrationYear == 2015)),
        reformatter = new Reformatter(enumerable)

    let test = enumerable    
        .from(new Cars([{ id: 1, location: 'NO', registrationYear: 1998, registrationDate: new Date(), type: { make: 'Toyota', model: 'Yaris' } }]))
        .toArray()

    debugger
       
    // assert.ok(intersection.length == 1, "Expected one criteria from intersection");
    // assert.ok(intersection[0].property == "registrationYear", "Expected property to be 'registrationYear'");
})


class Cars implements Sql<ICar>, Iterable<ICar> {
    public constructor(private items: Array<ICar>) {

    }

    public get language() {
        return 'sql-ms'
    }

    public get table() {
        return 'cars'
    }

    public remap(propertyName: string) {
        return propertyName.slice(0, 1).toUpperCase() + propertyName.slice(1)
    }

    private * iterator() {
        yield *this.items;
    }

    [Symbol.iterator] = (): IterableIterator<ICar> => this.iterator();
}

interface ICar {

    id: number
    location: string

    registrationYear: number
    registrationDate: Date

    type: {
        make: string
        model: string
    }
}