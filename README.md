# tfso-repository
Initially it was a CRUD repository using JavaScript as a boolean predicate for filtering data, but has gotten more work for Linq/Enumerable.
 
## Linq
Class Enumerable is supposed to do what Linq is doing for .NET, but it is an early state. It supports Javascript and OData filters, so you may write ```query.where(it => it.name.toLowerCase() == "donald").take(5)``` as well as ```query.where('tolower(name) eq "donald"').take(5)```

Enumerable has support for where,take,skip,orderBy,first, and it's exposing operators stack as well. Each operator can be extracted and removed if you want to do your own operator handling. Whether where-expression is Javascript or OData you can analyze the query part by part by its expression as AST (Abstract Syntax Tree).

Take a look at test for Enumerable at https://github.com/tfso/njs-tfso-repository/tree/master/src/test/enumerable.ts to see some examples.

## AST
Evaluating the result of the boolean predicate is done by a ODataVisitor (running special methods as tolower, substring etc) for OData and native Javascript function (for performance) for Javascript. There is also a RenameVisitor and a ReducerVisitor (to compact the AST tree, eg reducing binary expression 5 + 3 to literal 8).

For example of visitors and other tests for expressions take a look at the tests at https://github.com/tfso/njs-tfso-repository/tree/master/src/test to understand how it actually work.

## Repository
Abstract class for CRUD operations, where readAll is using Enumerable to make flexible read operations. You can extract and analyze the where operator to narrow down your database query, and rerun the predicate at the result to return exact what the user wants.

## Future
This respository is work in progress and there will be added more to it
- More operators for IEnumerable
- Exporting Linq to SQL/Sequalize/OData (client lib) etc
- IEnumerable parsing OData ($skip,$take,$filter etc) instead of only having IEnumerable.where() supporting OData.
- Better handling of IEnumerable for Repository such as analyzing and maybe transforming it to sql queries.
- Seperating repository/db to its own module

# Examples
Enumerable takes iterable objects, either async iterable or iterable. If using async iterable you should use toArrayAsync(), firstAsync() etc (not implemented right now so use ```for await(let x of Enumerable(function* () { yield 1; yield 2; }())``` instead). 

```typescript
let parents = function* () {
    yield { id: 1, reg: 'Dolly Duck',  year: 1937 }
    yield { id: 2, reg: 'Donald', year: 1934 }
    yield { id: 3, reg: 'Skrue McDuck', year: 1947 }
}

let childs = function* () {
    yield { parent: 2, name: 'Ole', year: 1940 }
    yield { parent: 1, name: 'Hetti', year: 1953 }
    yield { parent: 2, name: 'Dole', year: 1940 }
    yield { parent: 2, name: 'Doffen', year: 1940 }
    yield { parent: 1, name: 'Netti', year: 1953 }
}
```

## Join (inner)
```typescript
let donald = new Enumerable(parents())
    .where(it => it.id == 2)
    .join(
        new Enumerable(childs()).select(it => { parent: it.parent, name: it.name }), 
        a => a.id, 
        b => b.parent, 
        (a, b) => Object.assign({}, a, { childs: b.toArray() } )
    )
    .first();

// "{"id":2,"reg":"Donald","year":1934,"childs":[{"parent":2,"name":"Ole"},{"parent":2,"name":"Dole"},{"parent":2,"name":"Doffen"}]}"
```
