# tfso-repository
 Initially it was a CRUD repository using JavaScript as a boolean predicate for filtering data, but has gotten more work for Linq/Enumerable.
 
 ## Linq
 class Enumerable is supposed to do what Linq is doing for .NET, but it is an early state. It supports Javascript and OData filters, so you may write ```query.where(it => it.name.toLowerCase() == "donald").take(5)``` as well as ```query.where('tolower(name) eq "donald"').take(5)```

Enumerable has support for where,take,skip,orderBy,first, and it's exposing operators stack as well. Each operator can be extracted and removed if you want to do your own operator handling. Whether where-expression is Javascript or OData you can analyze the query part by part by its expression as AST (Abstract Syntax Tree).

Take a look at test for Enumerable at https://github.com/tfso/njs-tfso-repository/tree/master/src/test/enumerable.ts to see some examples.

## AST
Evaluating the result of the boolean predicate is done by a ODataVisitor (running special methods as tolower, substring etc) for OData and  native Javascript function (for performance) for Javascript. There is also a RenameVisitor and a ReducerVisitor (to compact the AST tree, eg reducing binary expression 5 + 3 to literal 8).

For example of visitors and other tests for expressions take a look at the tests at https://github.com/tfso/njs-tfso-repository/tree/master/src/test to understand how it actually work.

## Repository
Abstract class for CRUD operations, where readAll is using Enumerable to make flexible read operations. You can extract and analyze the where operator to narrow down you database query, and rerun the predicate at the result to return exact what the user wants.

## Future
This respository is work in progress and there will be added more to it
- More operators for IEnumerable
- IEnumerable parsing OData ($skip,$take,$filter etc) instead of only having IEnumerable.where() supporting OData.
- Better handling of IEnumerable for Repository such as analyzing and maybe transforming it to sql queries.
