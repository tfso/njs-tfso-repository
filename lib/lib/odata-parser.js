"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let parser = (function () {
    "use strict";
    function peg$subclass(child, parent) {
        function ctor() { this.constructor = child; }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
    }
    function peg$SyntaxError(message, expected, found, location) {
        this.message = message;
        this.expected = expected;
        this.found = found;
        this.location = location;
        this.name = "SyntaxError";
        if (typeof Error.captureStackTrace === "function") {
            Error.captureStackTrace(this, peg$SyntaxError);
        }
    }
    peg$subclass(peg$SyntaxError, Error);
    let buildMessage = function (expected, found) {
        var DESCRIBE_EXPECTATION_FNS = {
            literal: function (expectation) {
                return "\"" + literalEscape(expectation.text) + "\"";
            },
            "class": function (expectation) {
                var escapedParts = "", i;
                for (i = 0; i < expectation.parts.length; i++) {
                    escapedParts += expectation.parts[i] instanceof Array
                        ? classEscape(expectation.parts[i][0]) + "-" + classEscape(expectation.parts[i][1])
                        : classEscape(expectation.parts[i]);
                }
                return "[" + (expectation.inverted ? "^" : "") + escapedParts + "]";
            },
            any: function (expectation) {
                return "any character";
            },
            end: function (expectation) {
                return "end of input";
            },
            other: function (expectation) {
                return expectation.description;
            }
        };
        function hex(ch) {
            return ch.charCodeAt(0).toString(16).toUpperCase();
        }
        function literalEscape(s) {
            return s
                .replace(/\\/g, '\\\\')
                .replace(/"/g, '\\"')
                .replace(/\0/g, '\\0')
                .replace(/\t/g, '\\t')
                .replace(/\n/g, '\\n')
                .replace(/\r/g, '\\r')
                .replace(/[\x00-\x0F]/g, function (ch) { return '\\x0' + hex(ch); })
                .replace(/[\x10-\x1F\x7F-\x9F]/g, function (ch) { return '\\x' + hex(ch); });
        }
        function classEscape(s) {
            return s
                .replace(/\\/g, '\\\\')
                .replace(/\]/g, '\\]')
                .replace(/\^/g, '\\^')
                .replace(/-/g, '\\-')
                .replace(/\0/g, '\\0')
                .replace(/\t/g, '\\t')
                .replace(/\n/g, '\\n')
                .replace(/\r/g, '\\r')
                .replace(/[\x00-\x0F]/g, function (ch) { return '\\x0' + hex(ch); })
                .replace(/[\x10-\x1F\x7F-\x9F]/g, function (ch) { return '\\x' + hex(ch); });
        }
        function describeExpectation(expectation) {
            return DESCRIBE_EXPECTATION_FNS[expectation.type](expectation);
        }
        function describeExpected(expected) {
            var descriptions = new Array(expected.length), i, j;
            for (i = 0; i < expected.length; i++) {
                descriptions[i] = describeExpectation(expected[i]);
            }
            descriptions.sort();
            if (descriptions.length > 0) {
                for (i = 1, j = 1; i < descriptions.length; i++) {
                    if (descriptions[i - 1] !== descriptions[i]) {
                        descriptions[j] = descriptions[i];
                        j++;
                    }
                }
                descriptions.length = j;
            }
            switch (descriptions.length) {
                case 1:
                    return descriptions[0];
                case 2:
                    return descriptions[0] + " or " + descriptions[1];
                default:
                    return descriptions.slice(0, -1).join(", ")
                        + ", or "
                        + descriptions[descriptions.length - 1];
            }
        }
        function describeFound(found) {
            return found ? "\"" + literalEscape(found) + "\"" : "end of input";
        }
        return "Expected " + describeExpected(expected) + " but " + describeFound(found) + " found.";
    };
    function peg$parse(input, options) {
        options = options !== void 0 ? options : {};
        var peg$FAILED = {}, peg$startRuleFunctions = { Start: peg$parseStart }, peg$startRuleFunction = peg$parseStart, peg$c0 = function (first, rest) {
            return buildTree(first, rest, function (result, element) {
                return {
                    type: 'LogicalExpression',
                    operator: '||',
                    left: result,
                    right: element[1]
                };
            });
        }, peg$c1 = function (first, rest) {
            return buildTree(first, rest, function (result, element) {
                return {
                    type: 'LogicalExpression',
                    operator: '&&',
                    left: result,
                    right: element[1]
                };
            });
        }, peg$c2 = function (first, rest) {
            return buildTree(first, rest, function (result, element) {
                let map = { 'eq': '==', 'ne': '!=' };
                return {
                    type: 'RelationalExpression',
                    operator: map[element[0][0].toLowerCase()],
                    left: result,
                    right: element[1]
                };
            });
        }, peg$c3 = function (first, rest) {
            return buildTree(first, rest, function (result, element) {
                let map = { 'le': '<=', 'ge': '>=', 'lt': '<', 'gt': '>' };
                return {
                    type: 'RelationalExpression',
                    operator: map[element[0][0].toLowerCase()],
                    left: result,
                    right: element[1]
                };
            });
        }, peg$c4 = function (first, rest) {
            return buildTree(first, rest, function (result, element) {
                let map = { 'add': '+', 'sub': '-' };
                return {
                    type: 'BinaryExpression',
                    operator: map[element[0][0].toLowerCase()],
                    left: result,
                    right: element[1]
                };
            });
        }, peg$c5 = function (first, rest) {
            return buildTree(first, rest, function (result, element) {
                let map = { 'mul': '*', 'div': '/', 'mod': '%' };
                return {
                    type: 'BinaryExpression',
                    operator: map[element[0][0].toLowerCase()],
                    left: result,
                    right: element[1]
                };
            });
        }, peg$c6 = function (operator, operand) {
            return operand.type === 'NumberLiteral' && (operator === '-' || operator === '+')
                ?
                    {
                        type: 'NumberLiteral',
                        value: (operator === '-' ? operator : '') + operand.value
                    }
                :
                    {
                        type: 'UnaryExpression',
                        operator: operator,
                        argument: operand
                    };
        }, peg$c7 = function (expr) { return expr; }, peg$c8 = function (qual, expr) {
            return {
                type: 'ArrayExpression',
                array: qual,
                index: expr
            };
        }, peg$c9 = function (qual, args) {
            return {
                type: 'CallExpression',
                object: qual,
                arguments: args
            };
        }, peg$c10 = function (first, i) { return i; }, peg$c11 = function (first, list) {
            if (list) {
                return {
                    type: 'MemberExpression',
                    object: first,
                    property: list
                };
            }
            return first;
        }, peg$c12 = function (op) {
            let map = { 'not': '!', '+': '+', '-': '-' };
            return map[op[0].toLowerCase()];
        }, peg$c13 = function (first, rest) { return buildList(first, rest, 1); }, peg$c14 = function (args) { return args || []; }, peg$c15 = function (exp) { return exp; }, peg$c16 = /^[ \t\r\n\f]/, peg$c17 = peg$classExpectation([" ", "\t", "\r", "\n", "\f"], false, false), peg$c18 = function (first, last) { return { type: 'Identifier', name: first + last.join('') }; }, peg$c19 = /^[a-z]/, peg$c20 = peg$classExpectation([["a", "z"]], false, false), peg$c21 = /^[A-Z]/, peg$c22 = peg$classExpectation([["A", "Z"]], false, false), peg$c23 = /^[_$]/, peg$c24 = peg$classExpectation(["_", "$"], false, false), peg$c25 = /^[0-9]/, peg$c26 = peg$classExpectation([["0", "9"]], false, false), peg$c27 = "true", peg$c28 = peg$literalExpectation("true", false), peg$c29 = function () { return { type: 'BooleanLiteral', value: true }; }, peg$c30 = "false", peg$c31 = peg$literalExpectation("false", false), peg$c32 = function () { return { type: 'BooleanLiteral', value: false }; }, peg$c33 = "null", peg$c34 = peg$literalExpectation("null", false), peg$c35 = function () { return { type: 'NullLiteral' }; }, peg$c36 = function (literal) { return literal; }, peg$c37 = /^[lL]/, peg$c38 = peg$classExpectation(["l", "L"], false, false), peg$c39 = function () { return { type: 'NumberLiteral', value: text() }; }, peg$c40 = "0", peg$c41 = peg$literalExpectation("0", false), peg$c42 = /^[1-9]/, peg$c43 = peg$classExpectation([["1", "9"]], false, false), peg$c44 = /^[_]/, peg$c45 = peg$classExpectation(["_"], false, false), peg$c46 = "0x", peg$c47 = peg$literalExpectation("0x", false), peg$c48 = "0X", peg$c49 = peg$literalExpectation("0X", false), peg$c50 = "0b", peg$c51 = peg$literalExpectation("0b", false), peg$c52 = "0B", peg$c53 = peg$literalExpectation("0B", false), peg$c54 = /^[01]/, peg$c55 = peg$classExpectation(["0", "1"], false, false), peg$c56 = /^[0-7]/, peg$c57 = peg$classExpectation([["0", "7"]], false, false), peg$c58 = ".", peg$c59 = peg$literalExpectation(".", false), peg$c60 = /^[fFdD]/, peg$c61 = peg$classExpectation(["f", "F", "d", "D"], false, false), peg$c62 = /^[eE]/, peg$c63 = peg$classExpectation(["e", "E"], false, false), peg$c64 = /^[+\-]/, peg$c65 = peg$classExpectation(["+", "-"], false, false), peg$c66 = /^[pP]/, peg$c67 = peg$classExpectation(["p", "P"], false, false), peg$c68 = /^[a-f]/, peg$c69 = peg$classExpectation([["a", "f"]], false, false), peg$c70 = /^[A-F]/, peg$c71 = peg$classExpectation([["A", "F"]], false, false), peg$c72 = "'", peg$c73 = peg$literalExpectation("'", false), peg$c74 = /^['\\\n\r]/, peg$c75 = peg$classExpectation(["'", "\\", "\n", "\r"], false, false), peg$c76 = peg$anyExpectation(), peg$c77 = function (chars) { return { type: 'Literal', value: chars.map(l => l[0] == undefined ? l[1] : l[0] + l[1]).join('') }; }, peg$c78 = "\\", peg$c79 = peg$literalExpectation("\\", false), peg$c80 = /^[btnfr"'\\]/, peg$c81 = peg$classExpectation(["b", "t", "n", "f", "r", "\"", "'", "\\"], false, false), peg$c82 = /^[0-3]/, peg$c83 = peg$classExpectation([["0", "3"]], false, false), peg$c84 = "u", peg$c85 = peg$literalExpectation("u", false), peg$c86 = "add", peg$c87 = peg$literalExpectation("add", true), peg$c88 = "and", peg$c89 = peg$literalExpectation("and", true), peg$c90 = ":", peg$c91 = peg$literalExpectation(":", false), peg$c92 = ",", peg$c93 = peg$literalExpectation(",", false), peg$c94 = "div", peg$c95 = peg$literalExpectation("div", true), peg$c96 = "/", peg$c97 = peg$literalExpectation("/", false), peg$c98 = "eq", peg$c99 = peg$literalExpectation("eq", true), peg$c100 = "ge", peg$c101 = peg$literalExpectation("ge", true), peg$c102 = "gt", peg$c103 = peg$literalExpectation("gt", true), peg$c104 = "-", peg$c105 = peg$literalExpectation("-", false), peg$c106 = "[", peg$c107 = peg$literalExpectation("[", false), peg$c108 = "le", peg$c109 = peg$literalExpectation("le", true), peg$c110 = "(", peg$c111 = peg$literalExpectation("(", false), peg$c112 = "lt", peg$c113 = peg$literalExpectation("lt", true), peg$c114 = "mod", peg$c115 = peg$literalExpectation("mod", true), peg$c116 = "ne", peg$c117 = peg$literalExpectation("ne", true), peg$c118 = "not", peg$c119 = peg$literalExpectation("not", true), peg$c120 = "or", peg$c121 = peg$literalExpectation("or", true), peg$c122 = "+", peg$c123 = peg$literalExpectation("+", false), peg$c124 = "]", peg$c125 = peg$literalExpectation("]", false), peg$c126 = ")", peg$c127 = peg$literalExpectation(")", false), peg$c128 = "sub", peg$c129 = peg$literalExpectation("sub", true), peg$c130 = "mul", peg$c131 = peg$literalExpectation("mul", true), peg$currPos = 0, peg$savedPos = 0, peg$posDetailsCache = [{ line: 1, column: 1 }], peg$maxFailPos = 0, peg$maxFailExpected = [], peg$silentFails = 0, peg$resultsCache = {}, peg$result;
        if ("startRule" in options) {
            if (!(options.startRule in peg$startRuleFunctions)) {
                throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
            }
            peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
        }
        function text() {
            return input.substring(peg$savedPos, peg$currPos);
        }
        function location() {
            return peg$computeLocation(peg$savedPos, peg$currPos);
        }
        function expected(description, location) {
            location = location !== void 0 ? location : peg$computeLocation(peg$savedPos, peg$currPos);
            throw peg$buildStructuredError([peg$otherExpectation(description)], input.substring(peg$savedPos, peg$currPos), location);
        }
        function error(message, location) {
            location = location !== void 0 ? location : peg$computeLocation(peg$savedPos, peg$currPos);
            throw peg$buildSimpleError(message, location);
        }
        function peg$literalExpectation(text, ignoreCase) {
            return { type: "literal", text: text, ignoreCase: ignoreCase };
        }
        function peg$classExpectation(parts, inverted, ignoreCase) {
            return { type: "class", parts: parts, inverted: inverted, ignoreCase: ignoreCase };
        }
        function peg$anyExpectation() {
            return { type: "any" };
        }
        function peg$endExpectation() {
            return { type: "end" };
        }
        function peg$otherExpectation(description) {
            return { type: "other", description: description };
        }
        function peg$computePosDetails(pos) {
            var details = peg$posDetailsCache[pos], p;
            if (details) {
                return details;
            }
            else {
                p = pos - 1;
                while (!peg$posDetailsCache[p]) {
                    p--;
                }
                details = peg$posDetailsCache[p];
                details = {
                    line: details.line,
                    column: details.column
                };
                while (p < pos) {
                    if (input.charCodeAt(p) === 10) {
                        details.line++;
                        details.column = 1;
                    }
                    else {
                        details.column++;
                    }
                    p++;
                }
                peg$posDetailsCache[pos] = details;
                return details;
            }
        }
        function peg$computeLocation(startPos, endPos) {
            var startPosDetails = peg$computePosDetails(startPos), endPosDetails = peg$computePosDetails(endPos);
            return {
                start: {
                    offset: startPos,
                    line: startPosDetails.line,
                    column: startPosDetails.column
                },
                end: {
                    offset: endPos,
                    line: endPosDetails.line,
                    column: endPosDetails.column
                }
            };
        }
        function peg$fail(expected) {
            if (peg$currPos < peg$maxFailPos) {
                return;
            }
            if (peg$currPos > peg$maxFailPos) {
                peg$maxFailPos = peg$currPos;
                peg$maxFailExpected = [];
            }
            peg$maxFailExpected.push(expected);
        }
        function peg$buildSimpleError(message, location) {
            return new peg$SyntaxError(message, null, null, location);
        }
        function peg$buildStructuredError(expected, found, location) {
            return new peg$SyntaxError(buildMessage(expected, found), expected, found, location);
        }
        function peg$parseStart() {
            var s0;
            var key = peg$currPos * 63 + 0, cached = peg$resultsCache[key];
            if (cached) {
                peg$currPos = cached.nextPos;
                return cached.result;
            }
            s0 = peg$parseLogicalOrExpression();
            peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };
            return s0;
        }
        function peg$parseLogicalOrExpression() {
            var s0, s1, s2, s3, s4, s5, s6;
            var key = peg$currPos * 63 + 1, cached = peg$resultsCache[key];
            if (cached) {
                peg$currPos = cached.nextPos;
                return cached.result;
            }
            s0 = peg$currPos;
            s1 = peg$parseLogicalAndExpression();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$currPos;
                s4 = peg$currPos;
                s5 = peg$parseOROR();
                if (s5 !== peg$FAILED) {
                    s6 = peg$parse__();
                    if (s6 !== peg$FAILED) {
                        s5 = [s5, s6];
                        s4 = s5;
                    }
                    else {
                        peg$currPos = s4;
                        s4 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s4;
                    s4 = peg$FAILED;
                }
                if (s4 !== peg$FAILED) {
                    s5 = peg$parseLogicalAndExpression();
                    if (s5 !== peg$FAILED) {
                        s4 = [s4, s5];
                        s3 = s4;
                    }
                    else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$currPos;
                    s4 = peg$currPos;
                    s5 = peg$parseOROR();
                    if (s5 !== peg$FAILED) {
                        s6 = peg$parse__();
                        if (s6 !== peg$FAILED) {
                            s5 = [s5, s6];
                            s4 = s5;
                        }
                        else {
                            peg$currPos = s4;
                            s4 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s4;
                        s4 = peg$FAILED;
                    }
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parseLogicalAndExpression();
                        if (s5 !== peg$FAILED) {
                            s4 = [s4, s5];
                            s3 = s4;
                        }
                        else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c0(s1, s2);
                    s0 = s1;
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };
            return s0;
        }
        function peg$parseLogicalAndExpression() {
            var s0, s1, s2, s3, s4, s5, s6;
            var key = peg$currPos * 63 + 2, cached = peg$resultsCache[key];
            if (cached) {
                peg$currPos = cached.nextPos;
                return cached.result;
            }
            s0 = peg$currPos;
            s1 = peg$parseEqualityExpression();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$currPos;
                s4 = peg$currPos;
                s5 = peg$parseANDAND();
                if (s5 !== peg$FAILED) {
                    s6 = peg$parse__();
                    if (s6 !== peg$FAILED) {
                        s5 = [s5, s6];
                        s4 = s5;
                    }
                    else {
                        peg$currPos = s4;
                        s4 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s4;
                    s4 = peg$FAILED;
                }
                if (s4 !== peg$FAILED) {
                    s5 = peg$parseEqualityExpression();
                    if (s5 !== peg$FAILED) {
                        s4 = [s4, s5];
                        s3 = s4;
                    }
                    else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$currPos;
                    s4 = peg$currPos;
                    s5 = peg$parseANDAND();
                    if (s5 !== peg$FAILED) {
                        s6 = peg$parse__();
                        if (s6 !== peg$FAILED) {
                            s5 = [s5, s6];
                            s4 = s5;
                        }
                        else {
                            peg$currPos = s4;
                            s4 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s4;
                        s4 = peg$FAILED;
                    }
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parseEqualityExpression();
                        if (s5 !== peg$FAILED) {
                            s4 = [s4, s5];
                            s3 = s4;
                        }
                        else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c1(s1, s2);
                    s0 = s1;
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };
            return s0;
        }
        function peg$parseEqualityExpression() {
            var s0, s1, s2, s3, s4, s5, s6;
            var key = peg$currPos * 63 + 3, cached = peg$resultsCache[key];
            if (cached) {
                peg$currPos = cached.nextPos;
                return cached.result;
            }
            s0 = peg$currPos;
            s1 = peg$parseRelationalExpression();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$currPos;
                s4 = peg$currPos;
                s5 = peg$parseEQUAL();
                if (s5 !== peg$FAILED) {
                    s6 = peg$parse__();
                    if (s6 !== peg$FAILED) {
                        s5 = [s5, s6];
                        s4 = s5;
                    }
                    else {
                        peg$currPos = s4;
                        s4 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s4;
                    s4 = peg$FAILED;
                }
                if (s4 === peg$FAILED) {
                    s4 = peg$currPos;
                    s5 = peg$parseNOTEQUAL();
                    if (s5 !== peg$FAILED) {
                        s6 = peg$parse__();
                        if (s6 !== peg$FAILED) {
                            s5 = [s5, s6];
                            s4 = s5;
                        }
                        else {
                            peg$currPos = s4;
                            s4 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s4;
                        s4 = peg$FAILED;
                    }
                }
                if (s4 !== peg$FAILED) {
                    s5 = peg$parseRelationalExpression();
                    if (s5 !== peg$FAILED) {
                        s4 = [s4, s5];
                        s3 = s4;
                    }
                    else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$currPos;
                    s4 = peg$currPos;
                    s5 = peg$parseEQUAL();
                    if (s5 !== peg$FAILED) {
                        s6 = peg$parse__();
                        if (s6 !== peg$FAILED) {
                            s5 = [s5, s6];
                            s4 = s5;
                        }
                        else {
                            peg$currPos = s4;
                            s4 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s4;
                        s4 = peg$FAILED;
                    }
                    if (s4 === peg$FAILED) {
                        s4 = peg$currPos;
                        s5 = peg$parseNOTEQUAL();
                        if (s5 !== peg$FAILED) {
                            s6 = peg$parse__();
                            if (s6 !== peg$FAILED) {
                                s5 = [s5, s6];
                                s4 = s5;
                            }
                            else {
                                peg$currPos = s4;
                                s4 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s4;
                            s4 = peg$FAILED;
                        }
                    }
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parseRelationalExpression();
                        if (s5 !== peg$FAILED) {
                            s4 = [s4, s5];
                            s3 = s4;
                        }
                        else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c2(s1, s2);
                    s0 = s1;
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };
            return s0;
        }
        function peg$parseRelationalExpression() {
            var s0, s1, s2, s3, s4, s5, s6;
            var key = peg$currPos * 63 + 4, cached = peg$resultsCache[key];
            if (cached) {
                peg$currPos = cached.nextPos;
                return cached.result;
            }
            s0 = peg$currPos;
            s1 = peg$parseAdditiveExpression();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$currPos;
                s4 = peg$currPos;
                s5 = peg$parseLE();
                if (s5 !== peg$FAILED) {
                    s6 = peg$parse__();
                    if (s6 !== peg$FAILED) {
                        s5 = [s5, s6];
                        s4 = s5;
                    }
                    else {
                        peg$currPos = s4;
                        s4 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s4;
                    s4 = peg$FAILED;
                }
                if (s4 === peg$FAILED) {
                    s4 = peg$currPos;
                    s5 = peg$parseGE();
                    if (s5 !== peg$FAILED) {
                        s6 = peg$parse__();
                        if (s6 !== peg$FAILED) {
                            s5 = [s5, s6];
                            s4 = s5;
                        }
                        else {
                            peg$currPos = s4;
                            s4 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s4;
                        s4 = peg$FAILED;
                    }
                    if (s4 === peg$FAILED) {
                        s4 = peg$currPos;
                        s5 = peg$parseLT();
                        if (s5 !== peg$FAILED) {
                            s6 = peg$parse__();
                            if (s6 !== peg$FAILED) {
                                s5 = [s5, s6];
                                s4 = s5;
                            }
                            else {
                                peg$currPos = s4;
                                s4 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s4;
                            s4 = peg$FAILED;
                        }
                        if (s4 === peg$FAILED) {
                            s4 = peg$currPos;
                            s5 = peg$parseGT();
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parse__();
                                if (s6 !== peg$FAILED) {
                                    s5 = [s5, s6];
                                    s4 = s5;
                                }
                                else {
                                    peg$currPos = s4;
                                    s4 = peg$FAILED;
                                }
                            }
                            else {
                                peg$currPos = s4;
                                s4 = peg$FAILED;
                            }
                        }
                    }
                }
                if (s4 !== peg$FAILED) {
                    s5 = peg$parseAdditiveExpression();
                    if (s5 !== peg$FAILED) {
                        s4 = [s4, s5];
                        s3 = s4;
                    }
                    else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$currPos;
                    s4 = peg$currPos;
                    s5 = peg$parseLE();
                    if (s5 !== peg$FAILED) {
                        s6 = peg$parse__();
                        if (s6 !== peg$FAILED) {
                            s5 = [s5, s6];
                            s4 = s5;
                        }
                        else {
                            peg$currPos = s4;
                            s4 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s4;
                        s4 = peg$FAILED;
                    }
                    if (s4 === peg$FAILED) {
                        s4 = peg$currPos;
                        s5 = peg$parseGE();
                        if (s5 !== peg$FAILED) {
                            s6 = peg$parse__();
                            if (s6 !== peg$FAILED) {
                                s5 = [s5, s6];
                                s4 = s5;
                            }
                            else {
                                peg$currPos = s4;
                                s4 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s4;
                            s4 = peg$FAILED;
                        }
                        if (s4 === peg$FAILED) {
                            s4 = peg$currPos;
                            s5 = peg$parseLT();
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parse__();
                                if (s6 !== peg$FAILED) {
                                    s5 = [s5, s6];
                                    s4 = s5;
                                }
                                else {
                                    peg$currPos = s4;
                                    s4 = peg$FAILED;
                                }
                            }
                            else {
                                peg$currPos = s4;
                                s4 = peg$FAILED;
                            }
                            if (s4 === peg$FAILED) {
                                s4 = peg$currPos;
                                s5 = peg$parseGT();
                                if (s5 !== peg$FAILED) {
                                    s6 = peg$parse__();
                                    if (s6 !== peg$FAILED) {
                                        s5 = [s5, s6];
                                        s4 = s5;
                                    }
                                    else {
                                        peg$currPos = s4;
                                        s4 = peg$FAILED;
                                    }
                                }
                                else {
                                    peg$currPos = s4;
                                    s4 = peg$FAILED;
                                }
                            }
                        }
                    }
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parseAdditiveExpression();
                        if (s5 !== peg$FAILED) {
                            s4 = [s4, s5];
                            s3 = s4;
                        }
                        else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c3(s1, s2);
                    s0 = s1;
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };
            return s0;
        }
        function peg$parseAdditiveExpression() {
            var s0, s1, s2, s3, s4, s5, s6;
            var key = peg$currPos * 63 + 5, cached = peg$resultsCache[key];
            if (cached) {
                peg$currPos = cached.nextPos;
                return cached.result;
            }
            s0 = peg$currPos;
            s1 = peg$parseMultiplicativeExpression();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$currPos;
                s4 = peg$currPos;
                s5 = peg$parseADD();
                if (s5 !== peg$FAILED) {
                    s6 = peg$parse__();
                    if (s6 !== peg$FAILED) {
                        s5 = [s5, s6];
                        s4 = s5;
                    }
                    else {
                        peg$currPos = s4;
                        s4 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s4;
                    s4 = peg$FAILED;
                }
                if (s4 === peg$FAILED) {
                    s4 = peg$currPos;
                    s5 = peg$parseSUB();
                    if (s5 !== peg$FAILED) {
                        s6 = peg$parse__();
                        if (s6 !== peg$FAILED) {
                            s5 = [s5, s6];
                            s4 = s5;
                        }
                        else {
                            peg$currPos = s4;
                            s4 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s4;
                        s4 = peg$FAILED;
                    }
                }
                if (s4 !== peg$FAILED) {
                    s5 = peg$parseMultiplicativeExpression();
                    if (s5 !== peg$FAILED) {
                        s4 = [s4, s5];
                        s3 = s4;
                    }
                    else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$currPos;
                    s4 = peg$currPos;
                    s5 = peg$parseADD();
                    if (s5 !== peg$FAILED) {
                        s6 = peg$parse__();
                        if (s6 !== peg$FAILED) {
                            s5 = [s5, s6];
                            s4 = s5;
                        }
                        else {
                            peg$currPos = s4;
                            s4 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s4;
                        s4 = peg$FAILED;
                    }
                    if (s4 === peg$FAILED) {
                        s4 = peg$currPos;
                        s5 = peg$parseSUB();
                        if (s5 !== peg$FAILED) {
                            s6 = peg$parse__();
                            if (s6 !== peg$FAILED) {
                                s5 = [s5, s6];
                                s4 = s5;
                            }
                            else {
                                peg$currPos = s4;
                                s4 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s4;
                            s4 = peg$FAILED;
                        }
                    }
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parseMultiplicativeExpression();
                        if (s5 !== peg$FAILED) {
                            s4 = [s4, s5];
                            s3 = s4;
                        }
                        else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c4(s1, s2);
                    s0 = s1;
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };
            return s0;
        }
        function peg$parseMultiplicativeExpression() {
            var s0, s1, s2, s3, s4, s5, s6;
            var key = peg$currPos * 63 + 6, cached = peg$resultsCache[key];
            if (cached) {
                peg$currPos = cached.nextPos;
                return cached.result;
            }
            s0 = peg$currPos;
            s1 = peg$parseUnaryExpression();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$currPos;
                s4 = peg$currPos;
                s5 = peg$parseMUL();
                if (s5 !== peg$FAILED) {
                    s6 = peg$parse__();
                    if (s6 !== peg$FAILED) {
                        s5 = [s5, s6];
                        s4 = s5;
                    }
                    else {
                        peg$currPos = s4;
                        s4 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s4;
                    s4 = peg$FAILED;
                }
                if (s4 === peg$FAILED) {
                    s4 = peg$currPos;
                    s5 = peg$parseDIV();
                    if (s5 !== peg$FAILED) {
                        s6 = peg$parse__();
                        if (s6 !== peg$FAILED) {
                            s5 = [s5, s6];
                            s4 = s5;
                        }
                        else {
                            peg$currPos = s4;
                            s4 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s4;
                        s4 = peg$FAILED;
                    }
                    if (s4 === peg$FAILED) {
                        s4 = peg$currPos;
                        s5 = peg$parseMOD();
                        if (s5 !== peg$FAILED) {
                            s6 = peg$parse__();
                            if (s6 !== peg$FAILED) {
                                s5 = [s5, s6];
                                s4 = s5;
                            }
                            else {
                                peg$currPos = s4;
                                s4 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s4;
                            s4 = peg$FAILED;
                        }
                    }
                }
                if (s4 !== peg$FAILED) {
                    s5 = peg$parseUnaryExpression();
                    if (s5 !== peg$FAILED) {
                        s4 = [s4, s5];
                        s3 = s4;
                    }
                    else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$currPos;
                    s4 = peg$currPos;
                    s5 = peg$parseMUL();
                    if (s5 !== peg$FAILED) {
                        s6 = peg$parse__();
                        if (s6 !== peg$FAILED) {
                            s5 = [s5, s6];
                            s4 = s5;
                        }
                        else {
                            peg$currPos = s4;
                            s4 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s4;
                        s4 = peg$FAILED;
                    }
                    if (s4 === peg$FAILED) {
                        s4 = peg$currPos;
                        s5 = peg$parseDIV();
                        if (s5 !== peg$FAILED) {
                            s6 = peg$parse__();
                            if (s6 !== peg$FAILED) {
                                s5 = [s5, s6];
                                s4 = s5;
                            }
                            else {
                                peg$currPos = s4;
                                s4 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s4;
                            s4 = peg$FAILED;
                        }
                        if (s4 === peg$FAILED) {
                            s4 = peg$currPos;
                            s5 = peg$parseMOD();
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parse__();
                                if (s6 !== peg$FAILED) {
                                    s5 = [s5, s6];
                                    s4 = s5;
                                }
                                else {
                                    peg$currPos = s4;
                                    s4 = peg$FAILED;
                                }
                            }
                            else {
                                peg$currPos = s4;
                                s4 = peg$FAILED;
                            }
                        }
                    }
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parseUnaryExpression();
                        if (s5 !== peg$FAILED) {
                            s4 = [s4, s5];
                            s3 = s4;
                        }
                        else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c5(s1, s2);
                    s0 = s1;
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };
            return s0;
        }
        function peg$parseUnaryExpression() {
            var s0, s1, s2;
            var key = peg$currPos * 63 + 7, cached = peg$resultsCache[key];
            if (cached) {
                peg$currPos = cached.nextPos;
                return cached.result;
            }
            s0 = peg$currPos;
            s1 = peg$parsePrefixOp();
            if (s1 !== peg$FAILED) {
                s2 = peg$parsePrimary();
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c6(s1, s2);
                    s0 = s1;
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$parsePrimary();
            }
            peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };
            return s0;
        }
        function peg$parsePrimary() {
            var s0;
            var key = peg$currPos * 63 + 8, cached = peg$resultsCache[key];
            if (cached) {
                peg$currPos = cached.nextPos;
                return cached.result;
            }
            s0 = peg$parseParExpression();
            if (s0 === peg$FAILED) {
                s0 = peg$parseQualifiedIdentifier();
                if (s0 === peg$FAILED) {
                    s0 = peg$parseLiteral();
                }
            }
            peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };
            return s0;
        }
        function peg$parseParExpression() {
            var s0, s1, s2, s3, s4, s5;
            var key = peg$currPos * 63 + 9, cached = peg$resultsCache[key];
            if (cached) {
                peg$currPos = cached.nextPos;
                return cached.result;
            }
            s0 = peg$currPos;
            s1 = peg$parseLPAR();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseLogicalOrExpression();
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parseRPAR();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parse__();
                            if (s5 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c7(s3);
                                s0 = s1;
                            }
                            else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };
            return s0;
        }
        function peg$parseQualifiedIdentifier() {
            var s0, s1, s2, s3, s4, s5, s6, s7;
            var key = peg$currPos * 63 + 10, cached = peg$resultsCache[key];
            if (cached) {
                peg$currPos = cached.nextPos;
                return cached.result;
            }
            s0 = peg$currPos;
            s1 = peg$currPos;
            peg$silentFails++;
            s2 = peg$parseReservedWord();
            peg$silentFails--;
            if (s2 === peg$FAILED) {
                s1 = void 0;
            }
            else {
                peg$currPos = s1;
                s1 = peg$FAILED;
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parseIdentifier();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseLBRK();
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parseLogicalOrExpression();
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parseRBRK();
                                if (s6 !== peg$FAILED) {
                                    s7 = peg$parse__();
                                    if (s7 !== peg$FAILED) {
                                        peg$savedPos = s0;
                                        s1 = peg$c8(s2, s5);
                                        s0 = s1;
                                    }
                                    else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                }
                                else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            }
                            else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$currPos;
                peg$silentFails++;
                s2 = peg$parseReservedWord();
                peg$silentFails--;
                if (s2 === peg$FAILED) {
                    s1 = void 0;
                }
                else {
                    peg$currPos = s1;
                    s1 = peg$FAILED;
                }
                if (s1 !== peg$FAILED) {
                    s2 = peg$parseIdentifier();
                    if (s2 !== peg$FAILED) {
                        s3 = peg$parseArguments();
                        if (s3 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c9(s2, s3);
                            s0 = s1;
                        }
                        else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
                if (s0 === peg$FAILED) {
                    s0 = peg$currPos;
                    s1 = peg$currPos;
                    peg$silentFails++;
                    s2 = peg$parseReservedWord();
                    peg$silentFails--;
                    if (s2 === peg$FAILED) {
                        s1 = void 0;
                    }
                    else {
                        peg$currPos = s1;
                        s1 = peg$FAILED;
                    }
                    if (s1 !== peg$FAILED) {
                        s2 = peg$parseIdentifier();
                        if (s2 !== peg$FAILED) {
                            s3 = peg$currPos;
                            s4 = peg$parseDOT();
                            if (s4 !== peg$FAILED) {
                                s5 = peg$parseQualifiedIdentifier();
                                if (s5 !== peg$FAILED) {
                                    peg$savedPos = s3;
                                    s4 = peg$c10(s2, s5);
                                    s3 = s4;
                                }
                                else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            }
                            else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                            if (s3 === peg$FAILED) {
                                s3 = null;
                            }
                            if (s3 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c11(s2, s3);
                                s0 = s1;
                            }
                            else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
            }
            peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };
            return s0;
        }
        function peg$parsePrefixOp() {
            var s0, s1, s2, s3;
            var key = peg$currPos * 63 + 11, cached = peg$resultsCache[key];
            if (cached) {
                peg$currPos = cached.nextPos;
                return cached.result;
            }
            s0 = peg$currPos;
            s1 = peg$currPos;
            s2 = peg$parseNOT();
            if (s2 !== peg$FAILED) {
                s3 = peg$parse__();
                if (s3 !== peg$FAILED) {
                    s2 = [s2, s3];
                    s1 = s2;
                }
                else {
                    peg$currPos = s1;
                    s1 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s1;
                s1 = peg$FAILED;
            }
            if (s1 === peg$FAILED) {
                s1 = peg$currPos;
                s2 = peg$parsePLUS();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parse__();
                    if (s3 !== peg$FAILED) {
                        s2 = [s2, s3];
                        s1 = s2;
                    }
                    else {
                        peg$currPos = s1;
                        s1 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s1;
                    s1 = peg$FAILED;
                }
                if (s1 === peg$FAILED) {
                    s1 = peg$currPos;
                    s2 = peg$parseMINUS();
                    if (s2 !== peg$FAILED) {
                        s3 = peg$parse__();
                        if (s3 !== peg$FAILED) {
                            s2 = [s2, s3];
                            s1 = s2;
                        }
                        else {
                            peg$currPos = s1;
                            s1 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s1;
                        s1 = peg$FAILED;
                    }
                }
            }
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c12(s1);
            }
            s0 = s1;
            peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };
            return s0;
        }
        function peg$parseArguments() {
            var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9;
            var key = peg$currPos * 63 + 12, cached = peg$resultsCache[key];
            if (cached) {
                peg$currPos = cached.nextPos;
                return cached.result;
            }
            s0 = peg$currPos;
            s1 = peg$parseLPAR();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$currPos;
                    s4 = peg$parseLogicalOrExpression();
                    if (s4 !== peg$FAILED) {
                        s5 = [];
                        s6 = peg$currPos;
                        s7 = peg$currPos;
                        s8 = peg$parseCOMMA();
                        if (s8 !== peg$FAILED) {
                            s9 = peg$parse__();
                            if (s9 !== peg$FAILED) {
                                s8 = [s8, s9];
                                s7 = s8;
                            }
                            else {
                                peg$currPos = s7;
                                s7 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s7;
                            s7 = peg$FAILED;
                        }
                        if (s7 !== peg$FAILED) {
                            s8 = peg$parseLogicalOrExpression();
                            if (s8 !== peg$FAILED) {
                                s7 = [s7, s8];
                                s6 = s7;
                            }
                            else {
                                peg$currPos = s6;
                                s6 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s6;
                            s6 = peg$FAILED;
                        }
                        while (s6 !== peg$FAILED) {
                            s5.push(s6);
                            s6 = peg$currPos;
                            s7 = peg$currPos;
                            s8 = peg$parseCOMMA();
                            if (s8 !== peg$FAILED) {
                                s9 = peg$parse__();
                                if (s9 !== peg$FAILED) {
                                    s8 = [s8, s9];
                                    s7 = s8;
                                }
                                else {
                                    peg$currPos = s7;
                                    s7 = peg$FAILED;
                                }
                            }
                            else {
                                peg$currPos = s7;
                                s7 = peg$FAILED;
                            }
                            if (s7 !== peg$FAILED) {
                                s8 = peg$parseLogicalOrExpression();
                                if (s8 !== peg$FAILED) {
                                    s7 = [s7, s8];
                                    s6 = s7;
                                }
                                else {
                                    peg$currPos = s6;
                                    s6 = peg$FAILED;
                                }
                            }
                            else {
                                peg$currPos = s6;
                                s6 = peg$FAILED;
                            }
                        }
                        if (s5 !== peg$FAILED) {
                            peg$savedPos = s3;
                            s4 = peg$c13(s4, s5);
                            s3 = s4;
                        }
                        else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                    if (s3 === peg$FAILED) {
                        s3 = null;
                    }
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parseRPAR();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parse__();
                            if (s5 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c14(s3);
                                s0 = s1;
                            }
                            else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };
            return s0;
        }
        function peg$parseDim() {
            var s0, s1, s2, s3, s4;
            var key = peg$currPos * 63 + 13, cached = peg$resultsCache[key];
            if (cached) {
                peg$currPos = cached.nextPos;
                return cached.result;
            }
            s0 = peg$currPos;
            s1 = peg$parseLBRK();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseRBRK();
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            s1 = [s1, s2, s3, s4];
                            s0 = s1;
                        }
                        else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };
            return s0;
        }
        function peg$parseDimExpr() {
            var s0, s1, s2, s3, s4, s5;
            var key = peg$currPos * 63 + 14, cached = peg$resultsCache[key];
            if (cached) {
                peg$currPos = cached.nextPos;
                return cached.result;
            }
            s0 = peg$currPos;
            s1 = peg$parseLBRK();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseLogicalOrExpression();
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parseRBRK();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parse__();
                            if (s5 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c15(s3);
                                s0 = s1;
                            }
                            else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };
            return s0;
        }
        function peg$parse__() {
            var s0, s1, s2;
            var key = peg$currPos * 63 + 15, cached = peg$resultsCache[key];
            if (cached) {
                peg$currPos = cached.nextPos;
                return cached.result;
            }
            s0 = [];
            s1 = [];
            if (peg$c16.test(input.charAt(peg$currPos))) {
                s2 = input.charAt(peg$currPos);
                peg$currPos++;
            }
            else {
                s2 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c17);
                }
            }
            if (s2 !== peg$FAILED) {
                while (s2 !== peg$FAILED) {
                    s1.push(s2);
                    if (peg$c16.test(input.charAt(peg$currPos))) {
                        s2 = input.charAt(peg$currPos);
                        peg$currPos++;
                    }
                    else {
                        s2 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c17);
                        }
                    }
                }
            }
            else {
                s1 = peg$FAILED;
            }
            while (s1 !== peg$FAILED) {
                s0.push(s1);
                s1 = [];
                if (peg$c16.test(input.charAt(peg$currPos))) {
                    s2 = input.charAt(peg$currPos);
                    peg$currPos++;
                }
                else {
                    s2 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c17);
                    }
                }
                if (s2 !== peg$FAILED) {
                    while (s2 !== peg$FAILED) {
                        s1.push(s2);
                        if (peg$c16.test(input.charAt(peg$currPos))) {
                            s2 = input.charAt(peg$currPos);
                            peg$currPos++;
                        }
                        else {
                            s2 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c17);
                            }
                        }
                    }
                }
                else {
                    s1 = peg$FAILED;
                }
            }
            peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };
            return s0;
        }
        function peg$parseIdentifier() {
            var s0, s1, s2, s3;
            var key = peg$currPos * 63 + 16, cached = peg$resultsCache[key];
            if (cached) {
                peg$currPos = cached.nextPos;
                return cached.result;
            }
            s0 = peg$currPos;
            s1 = peg$parseLetter();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$parseLetterOrDigit();
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$parseLetterOrDigit();
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$parse__();
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c18(s1, s2);
                        s0 = s1;
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };
            return s0;
        }
        function peg$parseLetter() {
            var s0;
            var key = peg$currPos * 63 + 17, cached = peg$resultsCache[key];
            if (cached) {
                peg$currPos = cached.nextPos;
                return cached.result;
            }
            if (peg$c19.test(input.charAt(peg$currPos))) {
                s0 = input.charAt(peg$currPos);
                peg$currPos++;
            }
            else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c20);
                }
            }
            if (s0 === peg$FAILED) {
                if (peg$c21.test(input.charAt(peg$currPos))) {
                    s0 = input.charAt(peg$currPos);
                    peg$currPos++;
                }
                else {
                    s0 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c22);
                    }
                }
                if (s0 === peg$FAILED) {
                    if (peg$c23.test(input.charAt(peg$currPos))) {
                        s0 = input.charAt(peg$currPos);
                        peg$currPos++;
                    }
                    else {
                        s0 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c24);
                        }
                    }
                }
            }
            peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };
            return s0;
        }
        function peg$parseLetterOrDigit() {
            var s0;
            var key = peg$currPos * 63 + 18, cached = peg$resultsCache[key];
            if (cached) {
                peg$currPos = cached.nextPos;
                return cached.result;
            }
            if (peg$c19.test(input.charAt(peg$currPos))) {
                s0 = input.charAt(peg$currPos);
                peg$currPos++;
            }
            else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c20);
                }
            }
            if (s0 === peg$FAILED) {
                if (peg$c21.test(input.charAt(peg$currPos))) {
                    s0 = input.charAt(peg$currPos);
                    peg$currPos++;
                }
                else {
                    s0 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c22);
                    }
                }
                if (s0 === peg$FAILED) {
                    if (peg$c25.test(input.charAt(peg$currPos))) {
                        s0 = input.charAt(peg$currPos);
                        peg$currPos++;
                    }
                    else {
                        s0 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c26);
                        }
                    }
                    if (s0 === peg$FAILED) {
                        if (peg$c23.test(input.charAt(peg$currPos))) {
                            s0 = input.charAt(peg$currPos);
                            peg$currPos++;
                        }
                        else {
                            s0 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c24);
                            }
                        }
                    }
                }
            }
            peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };
            return s0;
        }
        function peg$parseLiteral() {
            var s0, s1, s2, s3, s4;
            var key = peg$currPos * 63 + 19, cached = peg$resultsCache[key];
            if (cached) {
                peg$currPos = cached.nextPos;
                return cached.result;
            }
            s0 = peg$currPos;
            s1 = peg$parseFloatLiteral();
            if (s1 === peg$FAILED) {
                s1 = peg$parseIntegerLiteral();
                if (s1 === peg$FAILED) {
                    s1 = peg$parseStringLiteral();
                    if (s1 === peg$FAILED) {
                        s1 = peg$currPos;
                        if (input.substr(peg$currPos, 4) === peg$c27) {
                            s2 = peg$c27;
                            peg$currPos += 4;
                        }
                        else {
                            s2 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c28);
                            }
                        }
                        if (s2 !== peg$FAILED) {
                            s3 = peg$currPos;
                            peg$silentFails++;
                            s4 = peg$parseLetterOrDigit();
                            peg$silentFails--;
                            if (s4 === peg$FAILED) {
                                s3 = void 0;
                            }
                            else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                            if (s3 !== peg$FAILED) {
                                peg$savedPos = s1;
                                s2 = peg$c29();
                                s1 = s2;
                            }
                            else {
                                peg$currPos = s1;
                                s1 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s1;
                            s1 = peg$FAILED;
                        }
                        if (s1 === peg$FAILED) {
                            s1 = peg$currPos;
                            if (input.substr(peg$currPos, 5) === peg$c30) {
                                s2 = peg$c30;
                                peg$currPos += 5;
                            }
                            else {
                                s2 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$c31);
                                }
                            }
                            if (s2 !== peg$FAILED) {
                                s3 = peg$currPos;
                                peg$silentFails++;
                                s4 = peg$parseLetterOrDigit();
                                peg$silentFails--;
                                if (s4 === peg$FAILED) {
                                    s3 = void 0;
                                }
                                else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                                if (s3 !== peg$FAILED) {
                                    peg$savedPos = s1;
                                    s2 = peg$c32();
                                    s1 = s2;
                                }
                                else {
                                    peg$currPos = s1;
                                    s1 = peg$FAILED;
                                }
                            }
                            else {
                                peg$currPos = s1;
                                s1 = peg$FAILED;
                            }
                            if (s1 === peg$FAILED) {
                                s1 = peg$currPos;
                                if (input.substr(peg$currPos, 4) === peg$c33) {
                                    s2 = peg$c33;
                                    peg$currPos += 4;
                                }
                                else {
                                    s2 = peg$FAILED;
                                    if (peg$silentFails === 0) {
                                        peg$fail(peg$c34);
                                    }
                                }
                                if (s2 !== peg$FAILED) {
                                    s3 = peg$currPos;
                                    peg$silentFails++;
                                    s4 = peg$parseLetterOrDigit();
                                    peg$silentFails--;
                                    if (s4 === peg$FAILED) {
                                        s3 = void 0;
                                    }
                                    else {
                                        peg$currPos = s3;
                                        s3 = peg$FAILED;
                                    }
                                    if (s3 !== peg$FAILED) {
                                        peg$savedPos = s1;
                                        s2 = peg$c35();
                                        s1 = s2;
                                    }
                                    else {
                                        peg$currPos = s1;
                                        s1 = peg$FAILED;
                                    }
                                }
                                else {
                                    peg$currPos = s1;
                                    s1 = peg$FAILED;
                                }
                            }
                        }
                    }
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c36(s1);
                    s0 = s1;
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };
            return s0;
        }
        function peg$parseIntegerLiteral() {
            var s0, s1, s2;
            var key = peg$currPos * 63 + 20, cached = peg$resultsCache[key];
            if (cached) {
                peg$currPos = cached.nextPos;
                return cached.result;
            }
            s0 = peg$currPos;
            s1 = peg$parseHexNumeral();
            if (s1 === peg$FAILED) {
                s1 = peg$parseBinaryNumeral();
                if (s1 === peg$FAILED) {
                    s1 = peg$parseOctalNumeral();
                    if (s1 === peg$FAILED) {
                        s1 = peg$parseDecimalNumeral();
                    }
                }
            }
            if (s1 !== peg$FAILED) {
                if (peg$c37.test(input.charAt(peg$currPos))) {
                    s2 = input.charAt(peg$currPos);
                    peg$currPos++;
                }
                else {
                    s2 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c38);
                    }
                }
                if (s2 === peg$FAILED) {
                    s2 = null;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c39();
                    s0 = s1;
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };
            return s0;
        }
        function peg$parseDecimalNumeral() {
            var s0, s1, s2, s3, s4, s5;
            var key = peg$currPos * 63 + 21, cached = peg$resultsCache[key];
            if (cached) {
                peg$currPos = cached.nextPos;
                return cached.result;
            }
            if (input.charCodeAt(peg$currPos) === 48) {
                s0 = peg$c40;
                peg$currPos++;
            }
            else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c41);
                }
            }
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                if (peg$c42.test(input.charAt(peg$currPos))) {
                    s1 = input.charAt(peg$currPos);
                    peg$currPos++;
                }
                else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c43);
                    }
                }
                if (s1 !== peg$FAILED) {
                    s2 = [];
                    s3 = peg$currPos;
                    s4 = [];
                    if (peg$c44.test(input.charAt(peg$currPos))) {
                        s5 = input.charAt(peg$currPos);
                        peg$currPos++;
                    }
                    else {
                        s5 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c45);
                        }
                    }
                    while (s5 !== peg$FAILED) {
                        s4.push(s5);
                        if (peg$c44.test(input.charAt(peg$currPos))) {
                            s5 = input.charAt(peg$currPos);
                            peg$currPos++;
                        }
                        else {
                            s5 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c45);
                            }
                        }
                    }
                    if (s4 !== peg$FAILED) {
                        if (peg$c25.test(input.charAt(peg$currPos))) {
                            s5 = input.charAt(peg$currPos);
                            peg$currPos++;
                        }
                        else {
                            s5 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c26);
                            }
                        }
                        if (s5 !== peg$FAILED) {
                            s4 = [s4, s5];
                            s3 = s4;
                        }
                        else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                    while (s3 !== peg$FAILED) {
                        s2.push(s3);
                        s3 = peg$currPos;
                        s4 = [];
                        if (peg$c44.test(input.charAt(peg$currPos))) {
                            s5 = input.charAt(peg$currPos);
                            peg$currPos++;
                        }
                        else {
                            s5 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c45);
                            }
                        }
                        while (s5 !== peg$FAILED) {
                            s4.push(s5);
                            if (peg$c44.test(input.charAt(peg$currPos))) {
                                s5 = input.charAt(peg$currPos);
                                peg$currPos++;
                            }
                            else {
                                s5 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$c45);
                                }
                            }
                        }
                        if (s4 !== peg$FAILED) {
                            if (peg$c25.test(input.charAt(peg$currPos))) {
                                s5 = input.charAt(peg$currPos);
                                peg$currPos++;
                            }
                            else {
                                s5 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$c26);
                                }
                            }
                            if (s5 !== peg$FAILED) {
                                s4 = [s4, s5];
                                s3 = s4;
                            }
                            else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    }
                    if (s2 !== peg$FAILED) {
                        s1 = [s1, s2];
                        s0 = s1;
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };
            return s0;
        }
        function peg$parseHexNumeral() {
            var s0, s1, s2;
            var key = peg$currPos * 63 + 22, cached = peg$resultsCache[key];
            if (cached) {
                peg$currPos = cached.nextPos;
                return cached.result;
            }
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 2) === peg$c46) {
                s1 = peg$c46;
                peg$currPos += 2;
            }
            else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c47);
                }
            }
            if (s1 === peg$FAILED) {
                if (input.substr(peg$currPos, 2) === peg$c48) {
                    s1 = peg$c48;
                    peg$currPos += 2;
                }
                else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c49);
                    }
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parseHexDigits();
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };
            return s0;
        }
        function peg$parseBinaryNumeral() {
            var s0, s1, s2, s3, s4, s5, s6;
            var key = peg$currPos * 63 + 23, cached = peg$resultsCache[key];
            if (cached) {
                peg$currPos = cached.nextPos;
                return cached.result;
            }
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 2) === peg$c50) {
                s1 = peg$c50;
                peg$currPos += 2;
            }
            else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c51);
                }
            }
            if (s1 === peg$FAILED) {
                if (input.substr(peg$currPos, 2) === peg$c52) {
                    s1 = peg$c52;
                    peg$currPos += 2;
                }
                else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c53);
                    }
                }
            }
            if (s1 !== peg$FAILED) {
                if (peg$c54.test(input.charAt(peg$currPos))) {
                    s2 = input.charAt(peg$currPos);
                    peg$currPos++;
                }
                else {
                    s2 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c55);
                    }
                }
                if (s2 !== peg$FAILED) {
                    s3 = [];
                    s4 = peg$currPos;
                    s5 = [];
                    if (peg$c44.test(input.charAt(peg$currPos))) {
                        s6 = input.charAt(peg$currPos);
                        peg$currPos++;
                    }
                    else {
                        s6 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c45);
                        }
                    }
                    while (s6 !== peg$FAILED) {
                        s5.push(s6);
                        if (peg$c44.test(input.charAt(peg$currPos))) {
                            s6 = input.charAt(peg$currPos);
                            peg$currPos++;
                        }
                        else {
                            s6 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c45);
                            }
                        }
                    }
                    if (s5 !== peg$FAILED) {
                        if (peg$c54.test(input.charAt(peg$currPos))) {
                            s6 = input.charAt(peg$currPos);
                            peg$currPos++;
                        }
                        else {
                            s6 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c55);
                            }
                        }
                        if (s6 !== peg$FAILED) {
                            s5 = [s5, s6];
                            s4 = s5;
                        }
                        else {
                            peg$currPos = s4;
                            s4 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s4;
                        s4 = peg$FAILED;
                    }
                    while (s4 !== peg$FAILED) {
                        s3.push(s4);
                        s4 = peg$currPos;
                        s5 = [];
                        if (peg$c44.test(input.charAt(peg$currPos))) {
                            s6 = input.charAt(peg$currPos);
                            peg$currPos++;
                        }
                        else {
                            s6 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c45);
                            }
                        }
                        while (s6 !== peg$FAILED) {
                            s5.push(s6);
                            if (peg$c44.test(input.charAt(peg$currPos))) {
                                s6 = input.charAt(peg$currPos);
                                peg$currPos++;
                            }
                            else {
                                s6 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$c45);
                                }
                            }
                        }
                        if (s5 !== peg$FAILED) {
                            if (peg$c54.test(input.charAt(peg$currPos))) {
                                s6 = input.charAt(peg$currPos);
                                peg$currPos++;
                            }
                            else {
                                s6 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$c55);
                                }
                            }
                            if (s6 !== peg$FAILED) {
                                s5 = [s5, s6];
                                s4 = s5;
                            }
                            else {
                                peg$currPos = s4;
                                s4 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s4;
                            s4 = peg$FAILED;
                        }
                    }
                    if (s3 !== peg$FAILED) {
                        s1 = [s1, s2, s3];
                        s0 = s1;
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };
            return s0;
        }
        function peg$parseOctalNumeral() {
            var s0, s1, s2, s3, s4, s5;
            var key = peg$currPos * 63 + 24, cached = peg$resultsCache[key];
            if (cached) {
                peg$currPos = cached.nextPos;
                return cached.result;
            }
            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 48) {
                s1 = peg$c40;
                peg$currPos++;
            }
            else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c41);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$currPos;
                s4 = [];
                if (peg$c44.test(input.charAt(peg$currPos))) {
                    s5 = input.charAt(peg$currPos);
                    peg$currPos++;
                }
                else {
                    s5 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c45);
                    }
                }
                while (s5 !== peg$FAILED) {
                    s4.push(s5);
                    if (peg$c44.test(input.charAt(peg$currPos))) {
                        s5 = input.charAt(peg$currPos);
                        peg$currPos++;
                    }
                    else {
                        s5 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c45);
                        }
                    }
                }
                if (s4 !== peg$FAILED) {
                    if (peg$c56.test(input.charAt(peg$currPos))) {
                        s5 = input.charAt(peg$currPos);
                        peg$currPos++;
                    }
                    else {
                        s5 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c57);
                        }
                    }
                    if (s5 !== peg$FAILED) {
                        s4 = [s4, s5];
                        s3 = s4;
                    }
                    else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
                if (s3 !== peg$FAILED) {
                    while (s3 !== peg$FAILED) {
                        s2.push(s3);
                        s3 = peg$currPos;
                        s4 = [];
                        if (peg$c44.test(input.charAt(peg$currPos))) {
                            s5 = input.charAt(peg$currPos);
                            peg$currPos++;
                        }
                        else {
                            s5 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c45);
                            }
                        }
                        while (s5 !== peg$FAILED) {
                            s4.push(s5);
                            if (peg$c44.test(input.charAt(peg$currPos))) {
                                s5 = input.charAt(peg$currPos);
                                peg$currPos++;
                            }
                            else {
                                s5 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$c45);
                                }
                            }
                        }
                        if (s4 !== peg$FAILED) {
                            if (peg$c56.test(input.charAt(peg$currPos))) {
                                s5 = input.charAt(peg$currPos);
                                peg$currPos++;
                            }
                            else {
                                s5 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$c57);
                                }
                            }
                            if (s5 !== peg$FAILED) {
                                s4 = [s4, s5];
                                s3 = s4;
                            }
                            else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    }
                }
                else {
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };
            return s0;
        }
        function peg$parseFloatLiteral() {
            var s0, s1;
            var key = peg$currPos * 63 + 25, cached = peg$resultsCache[key];
            if (cached) {
                peg$currPos = cached.nextPos;
                return cached.result;
            }
            s0 = peg$currPos;
            s1 = peg$parseHexFloat();
            if (s1 === peg$FAILED) {
                s1 = peg$parseDecimalFloat();
            }
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c39();
            }
            s0 = s1;
            peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };
            return s0;
        }
        function peg$parseDecimalFloat() {
            var s0, s1, s2, s3, s4, s5;
            var key = peg$currPos * 63 + 26, cached = peg$resultsCache[key];
            if (cached) {
                peg$currPos = cached.nextPos;
                return cached.result;
            }
            s0 = peg$currPos;
            s1 = peg$parseDigits();
            if (s1 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 46) {
                    s2 = peg$c58;
                    peg$currPos++;
                }
                else {
                    s2 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c59);
                    }
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseDigits();
                    if (s3 === peg$FAILED) {
                        s3 = null;
                    }
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parseExponent();
                        if (s4 === peg$FAILED) {
                            s4 = null;
                        }
                        if (s4 !== peg$FAILED) {
                            if (peg$c60.test(input.charAt(peg$currPos))) {
                                s5 = input.charAt(peg$currPos);
                                peg$currPos++;
                            }
                            else {
                                s5 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$c61);
                                }
                            }
                            if (s5 === peg$FAILED) {
                                s5 = null;
                            }
                            if (s5 !== peg$FAILED) {
                                s1 = [s1, s2, s3, s4, s5];
                                s0 = s1;
                            }
                            else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                if (input.charCodeAt(peg$currPos) === 46) {
                    s1 = peg$c58;
                    peg$currPos++;
                }
                else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c59);
                    }
                }
                if (s1 !== peg$FAILED) {
                    s2 = peg$parseDigits();
                    if (s2 !== peg$FAILED) {
                        s3 = peg$parseExponent();
                        if (s3 === peg$FAILED) {
                            s3 = null;
                        }
                        if (s3 !== peg$FAILED) {
                            if (peg$c60.test(input.charAt(peg$currPos))) {
                                s4 = input.charAt(peg$currPos);
                                peg$currPos++;
                            }
                            else {
                                s4 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$c61);
                                }
                            }
                            if (s4 === peg$FAILED) {
                                s4 = null;
                            }
                            if (s4 !== peg$FAILED) {
                                s1 = [s1, s2, s3, s4];
                                s0 = s1;
                            }
                            else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
                if (s0 === peg$FAILED) {
                    s0 = peg$currPos;
                    s1 = peg$parseDigits();
                    if (s1 !== peg$FAILED) {
                        s2 = peg$parseExponent();
                        if (s2 !== peg$FAILED) {
                            if (peg$c60.test(input.charAt(peg$currPos))) {
                                s3 = input.charAt(peg$currPos);
                                peg$currPos++;
                            }
                            else {
                                s3 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$c61);
                                }
                            }
                            if (s3 === peg$FAILED) {
                                s3 = null;
                            }
                            if (s3 !== peg$FAILED) {
                                s1 = [s1, s2, s3];
                                s0 = s1;
                            }
                            else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                    if (s0 === peg$FAILED) {
                        s0 = peg$currPos;
                        s1 = peg$parseDigits();
                        if (s1 !== peg$FAILED) {
                            s2 = peg$parseExponent();
                            if (s2 === peg$FAILED) {
                                s2 = null;
                            }
                            if (s2 !== peg$FAILED) {
                                if (peg$c60.test(input.charAt(peg$currPos))) {
                                    s3 = input.charAt(peg$currPos);
                                    peg$currPos++;
                                }
                                else {
                                    s3 = peg$FAILED;
                                    if (peg$silentFails === 0) {
                                        peg$fail(peg$c61);
                                    }
                                }
                                if (s3 !== peg$FAILED) {
                                    s1 = [s1, s2, s3];
                                    s0 = s1;
                                }
                                else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            }
                            else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    }
                }
            }
            peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };
            return s0;
        }
        function peg$parseExponent() {
            var s0, s1, s2, s3;
            var key = peg$currPos * 63 + 27, cached = peg$resultsCache[key];
            if (cached) {
                peg$currPos = cached.nextPos;
                return cached.result;
            }
            s0 = peg$currPos;
            if (peg$c62.test(input.charAt(peg$currPos))) {
                s1 = input.charAt(peg$currPos);
                peg$currPos++;
            }
            else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c63);
                }
            }
            if (s1 !== peg$FAILED) {
                if (peg$c64.test(input.charAt(peg$currPos))) {
                    s2 = input.charAt(peg$currPos);
                    peg$currPos++;
                }
                else {
                    s2 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c65);
                    }
                }
                if (s2 === peg$FAILED) {
                    s2 = null;
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseDigits();
                    if (s3 !== peg$FAILED) {
                        s1 = [s1, s2, s3];
                        s0 = s1;
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };
            return s0;
        }
        function peg$parseHexFloat() {
            var s0, s1, s2, s3;
            var key = peg$currPos * 63 + 28, cached = peg$resultsCache[key];
            if (cached) {
                peg$currPos = cached.nextPos;
                return cached.result;
            }
            s0 = peg$currPos;
            s1 = peg$parseHexSignificand();
            if (s1 !== peg$FAILED) {
                s2 = peg$parseBinaryExponent();
                if (s2 !== peg$FAILED) {
                    if (peg$c60.test(input.charAt(peg$currPos))) {
                        s3 = input.charAt(peg$currPos);
                        peg$currPos++;
                    }
                    else {
                        s3 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c61);
                        }
                    }
                    if (s3 === peg$FAILED) {
                        s3 = null;
                    }
                    if (s3 !== peg$FAILED) {
                        s1 = [s1, s2, s3];
                        s0 = s1;
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };
            return s0;
        }
        function peg$parseHexSignificand() {
            var s0, s1, s2, s3, s4;
            var key = peg$currPos * 63 + 29, cached = peg$resultsCache[key];
            if (cached) {
                peg$currPos = cached.nextPos;
                return cached.result;
            }
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 2) === peg$c46) {
                s1 = peg$c46;
                peg$currPos += 2;
            }
            else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c47);
                }
            }
            if (s1 === peg$FAILED) {
                if (input.substr(peg$currPos, 2) === peg$c48) {
                    s1 = peg$c48;
                    peg$currPos += 2;
                }
                else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c49);
                    }
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parseHexDigits();
                if (s2 === peg$FAILED) {
                    s2 = null;
                }
                if (s2 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 46) {
                        s3 = peg$c58;
                        peg$currPos++;
                    }
                    else {
                        s3 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c59);
                        }
                    }
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parseHexDigits();
                        if (s4 !== peg$FAILED) {
                            s1 = [s1, s2, s3, s4];
                            s0 = s1;
                        }
                        else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$parseHexNumeral();
                if (s1 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 46) {
                        s2 = peg$c58;
                        peg$currPos++;
                    }
                    else {
                        s2 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c59);
                        }
                    }
                    if (s2 === peg$FAILED) {
                        s2 = null;
                    }
                    if (s2 !== peg$FAILED) {
                        s1 = [s1, s2];
                        s0 = s1;
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };
            return s0;
        }
        function peg$parseBinaryExponent() {
            var s0, s1, s2, s3;
            var key = peg$currPos * 63 + 30, cached = peg$resultsCache[key];
            if (cached) {
                peg$currPos = cached.nextPos;
                return cached.result;
            }
            s0 = peg$currPos;
            if (peg$c66.test(input.charAt(peg$currPos))) {
                s1 = input.charAt(peg$currPos);
                peg$currPos++;
            }
            else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c67);
                }
            }
            if (s1 !== peg$FAILED) {
                if (peg$c64.test(input.charAt(peg$currPos))) {
                    s2 = input.charAt(peg$currPos);
                    peg$currPos++;
                }
                else {
                    s2 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c65);
                    }
                }
                if (s2 === peg$FAILED) {
                    s2 = null;
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseDigits();
                    if (s3 !== peg$FAILED) {
                        s1 = [s1, s2, s3];
                        s0 = s1;
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };
            return s0;
        }
        function peg$parseDigits() {
            var s0, s1, s2, s3, s4, s5;
            var key = peg$currPos * 63 + 31, cached = peg$resultsCache[key];
            if (cached) {
                peg$currPos = cached.nextPos;
                return cached.result;
            }
            s0 = peg$currPos;
            if (peg$c25.test(input.charAt(peg$currPos))) {
                s1 = input.charAt(peg$currPos);
                peg$currPos++;
            }
            else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c26);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$currPos;
                s4 = [];
                if (peg$c44.test(input.charAt(peg$currPos))) {
                    s5 = input.charAt(peg$currPos);
                    peg$currPos++;
                }
                else {
                    s5 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c45);
                    }
                }
                while (s5 !== peg$FAILED) {
                    s4.push(s5);
                    if (peg$c44.test(input.charAt(peg$currPos))) {
                        s5 = input.charAt(peg$currPos);
                        peg$currPos++;
                    }
                    else {
                        s5 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c45);
                        }
                    }
                }
                if (s4 !== peg$FAILED) {
                    if (peg$c25.test(input.charAt(peg$currPos))) {
                        s5 = input.charAt(peg$currPos);
                        peg$currPos++;
                    }
                    else {
                        s5 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c26);
                        }
                    }
                    if (s5 !== peg$FAILED) {
                        s4 = [s4, s5];
                        s3 = s4;
                    }
                    else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$currPos;
                    s4 = [];
                    if (peg$c44.test(input.charAt(peg$currPos))) {
                        s5 = input.charAt(peg$currPos);
                        peg$currPos++;
                    }
                    else {
                        s5 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c45);
                        }
                    }
                    while (s5 !== peg$FAILED) {
                        s4.push(s5);
                        if (peg$c44.test(input.charAt(peg$currPos))) {
                            s5 = input.charAt(peg$currPos);
                            peg$currPos++;
                        }
                        else {
                            s5 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c45);
                            }
                        }
                    }
                    if (s4 !== peg$FAILED) {
                        if (peg$c25.test(input.charAt(peg$currPos))) {
                            s5 = input.charAt(peg$currPos);
                            peg$currPos++;
                        }
                        else {
                            s5 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c26);
                            }
                        }
                        if (s5 !== peg$FAILED) {
                            s4 = [s4, s5];
                            s3 = s4;
                        }
                        else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };
            return s0;
        }
        function peg$parseHexDigits() {
            var s0, s1, s2, s3, s4, s5;
            var key = peg$currPos * 63 + 32, cached = peg$resultsCache[key];
            if (cached) {
                peg$currPos = cached.nextPos;
                return cached.result;
            }
            s0 = peg$currPos;
            s1 = peg$parseHexDigit();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$currPos;
                s4 = [];
                if (peg$c44.test(input.charAt(peg$currPos))) {
                    s5 = input.charAt(peg$currPos);
                    peg$currPos++;
                }
                else {
                    s5 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c45);
                    }
                }
                while (s5 !== peg$FAILED) {
                    s4.push(s5);
                    if (peg$c44.test(input.charAt(peg$currPos))) {
                        s5 = input.charAt(peg$currPos);
                        peg$currPos++;
                    }
                    else {
                        s5 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c45);
                        }
                    }
                }
                if (s4 !== peg$FAILED) {
                    s5 = peg$parseHexDigit();
                    if (s5 !== peg$FAILED) {
                        s4 = [s4, s5];
                        s3 = s4;
                    }
                    else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$currPos;
                    s4 = [];
                    if (peg$c44.test(input.charAt(peg$currPos))) {
                        s5 = input.charAt(peg$currPos);
                        peg$currPos++;
                    }
                    else {
                        s5 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c45);
                        }
                    }
                    while (s5 !== peg$FAILED) {
                        s4.push(s5);
                        if (peg$c44.test(input.charAt(peg$currPos))) {
                            s5 = input.charAt(peg$currPos);
                            peg$currPos++;
                        }
                        else {
                            s5 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c45);
                            }
                        }
                    }
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parseHexDigit();
                        if (s5 !== peg$FAILED) {
                            s4 = [s4, s5];
                            s3 = s4;
                        }
                        else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };
            return s0;
        }
        function peg$parseHexDigit() {
            var s0;
            var key = peg$currPos * 63 + 33, cached = peg$resultsCache[key];
            if (cached) {
                peg$currPos = cached.nextPos;
                return cached.result;
            }
            if (peg$c68.test(input.charAt(peg$currPos))) {
                s0 = input.charAt(peg$currPos);
                peg$currPos++;
            }
            else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c69);
                }
            }
            if (s0 === peg$FAILED) {
                if (peg$c70.test(input.charAt(peg$currPos))) {
                    s0 = input.charAt(peg$currPos);
                    peg$currPos++;
                }
                else {
                    s0 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c71);
                    }
                }
                if (s0 === peg$FAILED) {
                    if (peg$c25.test(input.charAt(peg$currPos))) {
                        s0 = input.charAt(peg$currPos);
                        peg$currPos++;
                    }
                    else {
                        s0 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c26);
                        }
                    }
                }
            }
            peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };
            return s0;
        }
        function peg$parseStringLiteral() {
            var s0, s1, s2, s3, s4, s5;
            var key = peg$currPos * 63 + 34, cached = peg$resultsCache[key];
            if (cached) {
                peg$currPos = cached.nextPos;
                return cached.result;
            }
            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 39) {
                s1 = peg$c72;
                peg$currPos++;
            }
            else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c73);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$parseEscape();
                if (s3 === peg$FAILED) {
                    s3 = peg$currPos;
                    s4 = peg$currPos;
                    peg$silentFails++;
                    if (peg$c74.test(input.charAt(peg$currPos))) {
                        s5 = input.charAt(peg$currPos);
                        peg$currPos++;
                    }
                    else {
                        s5 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c75);
                        }
                    }
                    peg$silentFails--;
                    if (s5 === peg$FAILED) {
                        s4 = void 0;
                    }
                    else {
                        peg$currPos = s4;
                        s4 = peg$FAILED;
                    }
                    if (s4 !== peg$FAILED) {
                        if (input.length > peg$currPos) {
                            s5 = input.charAt(peg$currPos);
                            peg$currPos++;
                        }
                        else {
                            s5 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c76);
                            }
                        }
                        if (s5 !== peg$FAILED) {
                            s4 = [s4, s5];
                            s3 = s4;
                        }
                        else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$parseEscape();
                    if (s3 === peg$FAILED) {
                        s3 = peg$currPos;
                        s4 = peg$currPos;
                        peg$silentFails++;
                        if (peg$c74.test(input.charAt(peg$currPos))) {
                            s5 = input.charAt(peg$currPos);
                            peg$currPos++;
                        }
                        else {
                            s5 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c75);
                            }
                        }
                        peg$silentFails--;
                        if (s5 === peg$FAILED) {
                            s4 = void 0;
                        }
                        else {
                            peg$currPos = s4;
                            s4 = peg$FAILED;
                        }
                        if (s4 !== peg$FAILED) {
                            if (input.length > peg$currPos) {
                                s5 = input.charAt(peg$currPos);
                                peg$currPos++;
                            }
                            else {
                                s5 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$c76);
                                }
                            }
                            if (s5 !== peg$FAILED) {
                                s4 = [s4, s5];
                                s3 = s4;
                            }
                            else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    }
                }
                if (s2 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 39) {
                        s3 = peg$c72;
                        peg$currPos++;
                    }
                    else {
                        s3 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c73);
                        }
                    }
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c77(s2);
                        s0 = s1;
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };
            return s0;
        }
        function peg$parseEscape() {
            var s0, s1, s2;
            var key = peg$currPos * 63 + 35, cached = peg$resultsCache[key];
            if (cached) {
                peg$currPos = cached.nextPos;
                return cached.result;
            }
            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 92) {
                s1 = peg$c78;
                peg$currPos++;
            }
            else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c79);
                }
            }
            if (s1 !== peg$FAILED) {
                if (peg$c80.test(input.charAt(peg$currPos))) {
                    s2 = input.charAt(peg$currPos);
                    peg$currPos++;
                }
                else {
                    s2 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c81);
                    }
                }
                if (s2 === peg$FAILED) {
                    s2 = peg$parseOctalEscape();
                    if (s2 === peg$FAILED) {
                        s2 = peg$parseUnicodeEscape();
                    }
                }
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };
            return s0;
        }
        function peg$parseOctalEscape() {
            var s0, s1, s2, s3;
            var key = peg$currPos * 63 + 36, cached = peg$resultsCache[key];
            if (cached) {
                peg$currPos = cached.nextPos;
                return cached.result;
            }
            s0 = peg$currPos;
            if (peg$c82.test(input.charAt(peg$currPos))) {
                s1 = input.charAt(peg$currPos);
                peg$currPos++;
            }
            else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c83);
                }
            }
            if (s1 !== peg$FAILED) {
                if (peg$c56.test(input.charAt(peg$currPos))) {
                    s2 = input.charAt(peg$currPos);
                    peg$currPos++;
                }
                else {
                    s2 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c57);
                    }
                }
                if (s2 !== peg$FAILED) {
                    if (peg$c56.test(input.charAt(peg$currPos))) {
                        s3 = input.charAt(peg$currPos);
                        peg$currPos++;
                    }
                    else {
                        s3 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c57);
                        }
                    }
                    if (s3 !== peg$FAILED) {
                        s1 = [s1, s2, s3];
                        s0 = s1;
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                if (peg$c56.test(input.charAt(peg$currPos))) {
                    s1 = input.charAt(peg$currPos);
                    peg$currPos++;
                }
                else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c57);
                    }
                }
                if (s1 !== peg$FAILED) {
                    if (peg$c56.test(input.charAt(peg$currPos))) {
                        s2 = input.charAt(peg$currPos);
                        peg$currPos++;
                    }
                    else {
                        s2 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c57);
                        }
                    }
                    if (s2 !== peg$FAILED) {
                        s1 = [s1, s2];
                        s0 = s1;
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
                if (s0 === peg$FAILED) {
                    if (peg$c56.test(input.charAt(peg$currPos))) {
                        s0 = input.charAt(peg$currPos);
                        peg$currPos++;
                    }
                    else {
                        s0 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c57);
                        }
                    }
                }
            }
            peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };
            return s0;
        }
        function peg$parseUnicodeEscape() {
            var s0, s1, s2, s3, s4, s5;
            var key = peg$currPos * 63 + 37, cached = peg$resultsCache[key];
            if (cached) {
                peg$currPos = cached.nextPos;
                return cached.result;
            }
            s0 = peg$currPos;
            s1 = [];
            if (input.charCodeAt(peg$currPos) === 117) {
                s2 = peg$c84;
                peg$currPos++;
            }
            else {
                s2 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c85);
                }
            }
            if (s2 !== peg$FAILED) {
                while (s2 !== peg$FAILED) {
                    s1.push(s2);
                    if (input.charCodeAt(peg$currPos) === 117) {
                        s2 = peg$c84;
                        peg$currPos++;
                    }
                    else {
                        s2 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c85);
                        }
                    }
                }
            }
            else {
                s1 = peg$FAILED;
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parseHexDigit();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseHexDigit();
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parseHexDigit();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parseHexDigit();
                            if (s5 !== peg$FAILED) {
                                s1 = [s1, s2, s3, s4, s5];
                                s0 = s1;
                            }
                            else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };
            return s0;
        }
        function peg$parseReservedWord() {
            var s0, s1, s2, s3;
            var key = peg$currPos * 63 + 38, cached = peg$resultsCache[key];
            if (cached) {
                peg$currPos = cached.nextPos;
                return cached.result;
            }
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 4) === peg$c27) {
                s1 = peg$c27;
                peg$currPos += 4;
            }
            else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c28);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseLetterOrDigit();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                }
                else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                if (input.substr(peg$currPos, 5) === peg$c30) {
                    s1 = peg$c30;
                    peg$currPos += 5;
                }
                else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c31);
                    }
                }
                if (s1 !== peg$FAILED) {
                    s2 = peg$currPos;
                    peg$silentFails++;
                    s3 = peg$parseLetterOrDigit();
                    peg$silentFails--;
                    if (s3 === peg$FAILED) {
                        s2 = void 0;
                    }
                    else {
                        peg$currPos = s2;
                        s2 = peg$FAILED;
                    }
                    if (s2 !== peg$FAILED) {
                        s1 = [s1, s2];
                        s0 = s1;
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
                if (s0 === peg$FAILED) {
                    s0 = peg$currPos;
                    if (input.substr(peg$currPos, 4) === peg$c33) {
                        s1 = peg$c33;
                        peg$currPos += 4;
                    }
                    else {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c34);
                        }
                    }
                    if (s1 !== peg$FAILED) {
                        s2 = peg$currPos;
                        peg$silentFails++;
                        s3 = peg$parseLetterOrDigit();
                        peg$silentFails--;
                        if (s3 === peg$FAILED) {
                            s2 = void 0;
                        }
                        else {
                            peg$currPos = s2;
                            s2 = peg$FAILED;
                        }
                        if (s2 !== peg$FAILED) {
                            s1 = [s1, s2];
                            s0 = s1;
                        }
                        else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
            }
            peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };
            return s0;
        }
        function peg$parseADD() {
            var s0;
            var key = peg$currPos * 63 + 39, cached = peg$resultsCache[key];
            if (cached) {
                peg$currPos = cached.nextPos;
                return cached.result;
            }
            if (input.substr(peg$currPos, 3).toLowerCase() === peg$c86) {
                s0 = input.substr(peg$currPos, 3);
                peg$currPos += 3;
            }
            else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c87);
                }
            }
            peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };
            return s0;
        }
        function peg$parseANDAND() {
            var s0;
            var key = peg$currPos * 63 + 40, cached = peg$resultsCache[key];
            if (cached) {
                peg$currPos = cached.nextPos;
                return cached.result;
            }
            if (input.substr(peg$currPos, 3).toLowerCase() === peg$c88) {
                s0 = input.substr(peg$currPos, 3);
                peg$currPos += 3;
            }
            else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c89);
                }
            }
            peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };
            return s0;
        }
        function peg$parseCOLON() {
            var s0;
            var key = peg$currPos * 63 + 41, cached = peg$resultsCache[key];
            if (cached) {
                peg$currPos = cached.nextPos;
                return cached.result;
            }
            if (input.charCodeAt(peg$currPos) === 58) {
                s0 = peg$c90;
                peg$currPos++;
            }
            else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c91);
                }
            }
            peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };
            return s0;
        }
        function peg$parseCOMMA() {
            var s0;
            var key = peg$currPos * 63 + 42, cached = peg$resultsCache[key];
            if (cached) {
                peg$currPos = cached.nextPos;
                return cached.result;
            }
            if (input.charCodeAt(peg$currPos) === 44) {
                s0 = peg$c92;
                peg$currPos++;
            }
            else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c93);
                }
            }
            peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };
            return s0;
        }
        function peg$parseDIV() {
            var s0;
            var key = peg$currPos * 63 + 43, cached = peg$resultsCache[key];
            if (cached) {
                peg$currPos = cached.nextPos;
                return cached.result;
            }
            if (input.substr(peg$currPos, 3).toLowerCase() === peg$c94) {
                s0 = input.substr(peg$currPos, 3);
                peg$currPos += 3;
            }
            else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c95);
                }
            }
            peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };
            return s0;
        }
        function peg$parseDOT() {
            var s0;
            var key = peg$currPos * 63 + 44, cached = peg$resultsCache[key];
            if (cached) {
                peg$currPos = cached.nextPos;
                return cached.result;
            }
            if (input.charCodeAt(peg$currPos) === 47) {
                s0 = peg$c96;
                peg$currPos++;
            }
            else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c97);
                }
            }
            peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };
            return s0;
        }
        function peg$parseEQUAL() {
            var s0;
            var key = peg$currPos * 63 + 45, cached = peg$resultsCache[key];
            if (cached) {
                peg$currPos = cached.nextPos;
                return cached.result;
            }
            if (input.substr(peg$currPos, 2).toLowerCase() === peg$c98) {
                s0 = input.substr(peg$currPos, 2);
                peg$currPos += 2;
            }
            else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c99);
                }
            }
            peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };
            return s0;
        }
        function peg$parseGE() {
            var s0;
            var key = peg$currPos * 63 + 46, cached = peg$resultsCache[key];
            if (cached) {
                peg$currPos = cached.nextPos;
                return cached.result;
            }
            if (input.substr(peg$currPos, 2).toLowerCase() === peg$c100) {
                s0 = input.substr(peg$currPos, 2);
                peg$currPos += 2;
            }
            else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c101);
                }
            }
            peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };
            return s0;
        }
        function peg$parseGT() {
            var s0;
            var key = peg$currPos * 63 + 47, cached = peg$resultsCache[key];
            if (cached) {
                peg$currPos = cached.nextPos;
                return cached.result;
            }
            if (input.substr(peg$currPos, 2).toLowerCase() === peg$c102) {
                s0 = input.substr(peg$currPos, 2);
                peg$currPos += 2;
            }
            else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c103);
                }
            }
            peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };
            return s0;
        }
        function peg$parseHYPHEN() {
            var s0;
            var key = peg$currPos * 63 + 48, cached = peg$resultsCache[key];
            if (cached) {
                peg$currPos = cached.nextPos;
                return cached.result;
            }
            if (input.charCodeAt(peg$currPos) === 45) {
                s0 = peg$c104;
                peg$currPos++;
            }
            else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c105);
                }
            }
            peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };
            return s0;
        }
        function peg$parseLBRK() {
            var s0;
            var key = peg$currPos * 63 + 49, cached = peg$resultsCache[key];
            if (cached) {
                peg$currPos = cached.nextPos;
                return cached.result;
            }
            if (input.charCodeAt(peg$currPos) === 91) {
                s0 = peg$c106;
                peg$currPos++;
            }
            else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c107);
                }
            }
            peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };
            return s0;
        }
        function peg$parseLE() {
            var s0;
            var key = peg$currPos * 63 + 50, cached = peg$resultsCache[key];
            if (cached) {
                peg$currPos = cached.nextPos;
                return cached.result;
            }
            if (input.substr(peg$currPos, 2).toLowerCase() === peg$c108) {
                s0 = input.substr(peg$currPos, 2);
                peg$currPos += 2;
            }
            else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c109);
                }
            }
            peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };
            return s0;
        }
        function peg$parseLPAR() {
            var s0;
            var key = peg$currPos * 63 + 51, cached = peg$resultsCache[key];
            if (cached) {
                peg$currPos = cached.nextPos;
                return cached.result;
            }
            if (input.charCodeAt(peg$currPos) === 40) {
                s0 = peg$c110;
                peg$currPos++;
            }
            else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c111);
                }
            }
            peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };
            return s0;
        }
        function peg$parseLT() {
            var s0;
            var key = peg$currPos * 63 + 52, cached = peg$resultsCache[key];
            if (cached) {
                peg$currPos = cached.nextPos;
                return cached.result;
            }
            if (input.substr(peg$currPos, 2).toLowerCase() === peg$c112) {
                s0 = input.substr(peg$currPos, 2);
                peg$currPos += 2;
            }
            else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c113);
                }
            }
            peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };
            return s0;
        }
        function peg$parseMINUS() {
            var s0;
            var key = peg$currPos * 63 + 53, cached = peg$resultsCache[key];
            if (cached) {
                peg$currPos = cached.nextPos;
                return cached.result;
            }
            if (input.charCodeAt(peg$currPos) === 45) {
                s0 = peg$c104;
                peg$currPos++;
            }
            else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c105);
                }
            }
            peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };
            return s0;
        }
        function peg$parseMOD() {
            var s0;
            var key = peg$currPos * 63 + 54, cached = peg$resultsCache[key];
            if (cached) {
                peg$currPos = cached.nextPos;
                return cached.result;
            }
            if (input.substr(peg$currPos, 3).toLowerCase() === peg$c114) {
                s0 = input.substr(peg$currPos, 3);
                peg$currPos += 3;
            }
            else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c115);
                }
            }
            peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };
            return s0;
        }
        function peg$parseNOTEQUAL() {
            var s0;
            var key = peg$currPos * 63 + 55, cached = peg$resultsCache[key];
            if (cached) {
                peg$currPos = cached.nextPos;
                return cached.result;
            }
            if (input.substr(peg$currPos, 2).toLowerCase() === peg$c116) {
                s0 = input.substr(peg$currPos, 2);
                peg$currPos += 2;
            }
            else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c117);
                }
            }
            peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };
            return s0;
        }
        function peg$parseNOT() {
            var s0;
            var key = peg$currPos * 63 + 56, cached = peg$resultsCache[key];
            if (cached) {
                peg$currPos = cached.nextPos;
                return cached.result;
            }
            if (input.substr(peg$currPos, 3).toLowerCase() === peg$c118) {
                s0 = input.substr(peg$currPos, 3);
                peg$currPos += 3;
            }
            else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c119);
                }
            }
            peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };
            return s0;
        }
        function peg$parseOROR() {
            var s0;
            var key = peg$currPos * 63 + 57, cached = peg$resultsCache[key];
            if (cached) {
                peg$currPos = cached.nextPos;
                return cached.result;
            }
            if (input.substr(peg$currPos, 2).toLowerCase() === peg$c120) {
                s0 = input.substr(peg$currPos, 2);
                peg$currPos += 2;
            }
            else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c121);
                }
            }
            peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };
            return s0;
        }
        function peg$parsePLUS() {
            var s0;
            var key = peg$currPos * 63 + 58, cached = peg$resultsCache[key];
            if (cached) {
                peg$currPos = cached.nextPos;
                return cached.result;
            }
            if (input.charCodeAt(peg$currPos) === 43) {
                s0 = peg$c122;
                peg$currPos++;
            }
            else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c123);
                }
            }
            peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };
            return s0;
        }
        function peg$parseRBRK() {
            var s0;
            var key = peg$currPos * 63 + 59, cached = peg$resultsCache[key];
            if (cached) {
                peg$currPos = cached.nextPos;
                return cached.result;
            }
            if (input.charCodeAt(peg$currPos) === 93) {
                s0 = peg$c124;
                peg$currPos++;
            }
            else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c125);
                }
            }
            peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };
            return s0;
        }
        function peg$parseRPAR() {
            var s0;
            var key = peg$currPos * 63 + 60, cached = peg$resultsCache[key];
            if (cached) {
                peg$currPos = cached.nextPos;
                return cached.result;
            }
            if (input.charCodeAt(peg$currPos) === 41) {
                s0 = peg$c126;
                peg$currPos++;
            }
            else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c127);
                }
            }
            peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };
            return s0;
        }
        function peg$parseSUB() {
            var s0;
            var key = peg$currPos * 63 + 61, cached = peg$resultsCache[key];
            if (cached) {
                peg$currPos = cached.nextPos;
                return cached.result;
            }
            if (input.substr(peg$currPos, 3).toLowerCase() === peg$c128) {
                s0 = input.substr(peg$currPos, 3);
                peg$currPos += 3;
            }
            else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c129);
                }
            }
            peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };
            return s0;
        }
        function peg$parseMUL() {
            var s0;
            var key = peg$currPos * 63 + 62, cached = peg$resultsCache[key];
            if (cached) {
                peg$currPos = cached.nextPos;
                return cached.result;
            }
            if (input.substr(peg$currPos, 3).toLowerCase() === peg$c130) {
                s0 = input.substr(peg$currPos, 3);
                peg$currPos += 3;
            }
            else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c131);
                }
            }
            peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };
            return s0;
        }
        function buildList(first, rest, index) {
            var result = new Array(rest.length), i;
            for (i = 0; i < rest.length; i++) {
                result[i] = rest[i][index];
            }
            return [first].concat(result);
        }
        function buildTree(first, rest, builder) {
            var result = first, i;
            for (i = 0; i < rest.length; i++) {
                result = builder(result, rest[i]);
            }
            return result;
        }
        peg$result = peg$startRuleFunction();
        if (peg$result !== peg$FAILED && peg$currPos === input.length) {
            return peg$result;
        }
        else {
            if (peg$result !== peg$FAILED && peg$currPos < input.length) {
                peg$fail(peg$endExpectation());
            }
            throw peg$buildStructuredError(peg$maxFailExpected, peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null, peg$maxFailPos < input.length
                ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1)
                : peg$computeLocation(peg$maxFailPos, peg$maxFailPos));
        }
    }
    return {
        SyntaxError: peg$SyntaxError,
        parse: peg$parse
    };
})();
exports.default = parser;
//# sourceMappingURL=odata-parser.js.map