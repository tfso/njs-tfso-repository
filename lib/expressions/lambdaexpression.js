"use strict";
class LambdaExpression {
    constructor(lambda) {
        this.parseExpression(this._lambdaFn = lambda);
    }
    get expression() {
        return this._expression;
    }
    get parameters() {
        return this._parameters;
    }
    get lambda() {
        return this._lambdaFn;
    }
    /**
    * decompilation of a predicate expression extracting the actual expression
    * @param predicate
    * @return string
    */
    parseExpression(lambda) {
        var regexs = [
            /^\(\s*([^)]*?)\s*\)\s*(?:=>)+\s*([^{]+)$/i,
            /^(?:function\s*)?\(\s*([^)]*?)\s*\)\s*(?:=>)?\s*\{\s*.*?(?:return)\s*(.*?)\;?\s*\}\s*$/i // return statements, including arrow function
        ];
        var raw = lambda.toString();
        regexs.forEach((regex) => {
            var match;
            if ((match = raw.match(regex)) !== null) {
                this._parameters = match[1].split(',').map((el) => el.trim());
                this._expression = match[2].replace(/_this/gi, "this");
                return false;
            }
            return true;
        });
    }
}
exports.LambdaExpression = LambdaExpression;
//# sourceMappingURL=lambdaexpression.js.map