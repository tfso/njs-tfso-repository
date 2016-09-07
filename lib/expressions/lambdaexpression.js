"use strict";
var LambdaExpression = (function () {
    function LambdaExpression(lambda) {
        this.parseExpression(this._lambdaFn = lambda);
    }
    Object.defineProperty(LambdaExpression.prototype, "expression", {
        get: function () {
            return this._expression;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LambdaExpression.prototype, "parameters", {
        get: function () {
            return this._parameters;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LambdaExpression.prototype, "lambda", {
        get: function () {
            return this._lambdaFn;
        },
        enumerable: true,
        configurable: true
    });
    /**
    * decompilation of a predicate expression extracting the actual expression
    * @param predicate
    * @return string
    */
    LambdaExpression.prototype.parseExpression = function (lambda) {
        var _this = this;
        var regexs = [
            /^\(\s*([^)]*?)\s*\)\s*(?:=>)+\s*([^{]+)$/i,
            /^(?:function\s*)?\(\s*([^)]*?)\s*\)\s*(?:=>)?\s*\{\s*.*?(?:return)\s*(.*?)\;?\s*\}\s*$/i // return statements, including arrow function
        ];
        var raw = lambda.toString();
        regexs.forEach(function (regex) {
            var match;
            if ((match = raw.match(regex)) !== null) {
                _this._parameters = match[1].split(',').map(function (el) { return el.trim(); });
                _this._expression = match[2].replace(/_this/gi, "this");
                return false;
            }
            return true;
        });
    };
    return LambdaExpression;
}());
exports.LambdaExpression = LambdaExpression;
//# sourceMappingURL=lambdaexpression.js.map