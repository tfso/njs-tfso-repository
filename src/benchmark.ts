import * as Benchmark from 'benchmark'
import { TemplateLiteralVisitor } from './linq/expressions/templateliteralvisitor'




var suite = new Benchmark.Suite;




var generateTemplateString = (function () {
    var cache = {};

    function generateTemplate(template) {

        var fn = cache[template];

        if (!fn)
        {

            // Replace ${expressions} (etc) with ${map.expressions}.

            var sanitized = template
                .replace(/\$\{([\s]*[^;\s\{]+[\s]*)\}/g, function (_, match) {
                    return `\$\{map.${match.trim()}\}`;
                })
                // Afterwards, replace anything that's not ${map.expressions}' (etc) with a blank string.
                .replace(/(\$\{(?!map\.)[^}]+\})/g, '');

            fn = Function('map', `return \`${sanitized}\``);

        }

        return fn;
    };

    return generateTemplate;
})();
var template = generateTemplateString('template string adds ${number} like nothing');

var expression = new TemplateLiteralVisitor().visitLambda(() => `template string adds ${2 + number} like nothing`);

var number = 5;
// add tests 
suite
    .add('TemplateLiteral', function () {
        `template strings adds ${2 + number++} like nothing`;
    })
    .add('RepositoryLiteral', function () {
        TemplateLiteralVisitor.evaluate(expression, { number: number++ });
    })
    .add('Eval', function () {
        eval('`template string adds ${2 + number} like nothing`');
    })
    .add('Function', function () {
        new Function('number', 'return `template string adds ${2 + number++} like nothing`;')(5);
    })
    .add('RegExp Replace', function () {
        template({ number: 2 + number++ });
    })
    // add listeners 
    .on('cycle', function (event) {
        console.log(String(event.target));
    })
    .on('complete', function () {
        console.log('Fastest is ' + this.filter('fastest').map('name'));
    })
    // run async 
    .run({ 'async': true });

// logs: 
// => RegExp#test x 4,161,532 +-0.99% (59 cycles) 
// => String#indexOf x 6,139,623 +-1.00% (131 cycles) 
// => Fastest is String#indexOf 