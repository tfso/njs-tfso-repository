"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Benchmark = require("benchmark");
const templateliteralvisitor_1 = require("./linq/expressions/templateliteralvisitor");
var suite = new Benchmark.Suite;
var generateTemplateString = (function () {
    var cache = {};
    function generateTemplate(template) {
        var fn = cache[template];
        if (!fn) {
            // Replace ${expressions} (etc) with ${map.expressions}.
            var sanitized = template
                .replace(/\$\{([\s]*[^;\s\{]+[\s]*)\}/g, function (_, match) {
                return `\$\{map.${match.trim()}\}`;
            })
                .replace(/(\$\{(?!map\.)[^}]+\})/g, '');
            fn = Function('map', `return \`${sanitized}\``);
        }
        return fn;
    }
    ;
    return generateTemplate;
})();
var template = generateTemplateString('template string adds ${number} like nothing');
var expression = new templateliteralvisitor_1.TemplateLiteralVisitor().visitLambda(() => `template string adds ${2 + number} like nothing`);
var number = 5;
// add tests 
suite
    .add('TemplateLiteral', function () {
    `template strings adds ${2 + number} like nothing`;
})
    .add('RepositoryLiteral', function () {
    templateliteralvisitor_1.TemplateLiteralVisitor.evaluate(expression, { number: number });
})
    .add('Eval', function () {
    eval('`template string adds ${2 + number} like nothing`');
})
    .add('Function', function () {
    new Function('number', 'return `template string adds ${2 + number} like nothing`;')(5);
})
    .add('RegExp Replace', function () {
    template({ number: 2 + number });
})
    .on('cycle', function (event) {
    console.log(String(event.target));
})
    .on('complete', function () {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
})
    .run({ 'async': true });
// logs: 
// => RegExp#test x 4,161,532 +-0.99% (59 cycles) 
// => String#indexOf x 6,139,623 +-1.00% (131 cycles) 
// => Fastest is String#indexOf  
//# sourceMappingURL=benchmark.js.map