
//===========================================================================
//  OData Expression Grammar
//   by Nicolai Gjærum
// 
//  This grammar is based on "Parsing Expression Grammar of Java" by Roman R
//  Redziejowski. It is heavily modified and stripped down to support OData
//  expressions only (the part inside $filter).
//
//---------------------------------------------------------------------------
//
//  Parsing Expression Grammar of Java for jsjavaparser
//   Copyright (C) 2006, 2009, 2010, 2011, 2013
//   by Roman R Redziejowski(www.romanredz.se).
//
//  The author gives unlimited permission to copy and distribute
//  this file, with or without modifications, as long as this notice
//  is preserved, and any changes are properly documented.
//
//  This file is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
//---------------------------------------------------------------------------

{
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
}

/* ---- Syntactic Grammar ----- */

Start = Expression

Expression
    = ConditionalExpression

ConditionalExpression
    = ConditionalOrExpression

ConditionalOrExpression
    = first:ConditionalAndExpression rest:(OROR ConditionalAndExpression)*
    {
      return buildTree(first, rest, function(result, element) {
        return {
          type: 'ConditionalExpression',
          operator: element[0][0],
          left:  result,
          right: element[1]
        };
      });
    }

ConditionalAndExpression
    = first:EqualityExpression rest:(ANDAND EqualityExpression)*
    {
      return buildTree(first, rest, function(result, element) {
        return {
          type: 'ConditionalExpression',
          operator: element[0][0],
          left:  result,
          right: element[1]
        };
      });
    }

EqualityExpression
    = first:RelationalExpression rest:((EQUAL /  NOTEQUAL) RelationalExpression)*
    {
      return buildTree(first, rest, function(result, element) {
        return {
          type: 'LogicalExpression',
          operator: element[0][0],
          left:  result,
          right: element[1]
        };
      });
    }

RelationalExpression
    = first:AdditiveExpression rest:((LE / GE / LT / GT) AdditiveExpression )*
    {
      return buildTree(first, rest, function(result, element) {
        return {
          type: 'LogicalExpression',
          operator: element[0][0],
          left:  result,
          right: element[1]
        };
      });
    }

AdditiveExpression
    = first:MultiplicativeExpression rest:((ADD / SUB) MultiplicativeExpression)*
    {
      return buildTree(first, rest, function(result, element) {
        return {
          type: 'BinaryExpression',
          operator: element[0][0],
          left:  result,
          right: element[1]
        };
      });
    }

MultiplicativeExpression
    = first:UnaryExpression rest:((MUL / DIV / MOD) UnaryExpression)*
    {
      return buildTree(first, rest, function(result, element) {
        return {
          type: 'BinaryExpression',
          operator: element[0][0],
          left:  result,
          right: element[1]
        };
      });
    }

UnaryExpression
    = operator:PrefixOp operand:Primary
    {
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
          argument:  operand
        };
    }
    / Primary

Primary
    = ParExpression
    / QualifiedIdentifier
    / Literal
    
ParExpression
    = LPAR expr:Expression RPAR
    { return expr; }

QualifiedIdentifier
    = qual:Identifier LBRK expr:Expression RBRK
    { 
      return { 
    	type: 'ArrayExpression', 
        array: qual, 
        index: expr 
      };
    }
    / qual:Identifier args:Arguments
    { 
      return {
      	type: 'CallExpression', 
        object: qual,
        arguments: args
      };
    }
    / first:Identifier list:(DOT i:QualifiedIdentifier { return i; })?
    { 
      if(list) {
        return {
          type: 'MemberExpression',
          object: first.name,
          property: list
        }
      }  
      return first;
    }
    
PrefixOp
    = op:(
      NOT
    / PLUS
    / MINUS
    ) { return op[0]; }

Arguments
    = LPAR args:(first:Expression rest:(COMMA Expression)* { return buildList(first, rest, 1); })? RPAR
    { return args || []; }

VariableInitializer
    = Expression

Dim
    = LBRK RBRK

DimExpr
    = LBRK exp:Expression RBRK
    { return exp; }

/* ---- Lexical Structure ----- */

Spacing
    = ( 
      [ \t\r\n\u000C]+          // WhiteSpace
      )* ;

Identifier
    = first:Letter last:LetterOrDigit* Spacing
    { return { type: 'Identifier', name: first + last.join('') }; }

Letter = [a-z] / [A-Z] / [_$] ;

LetterOrDigit = [a-z] / [A-Z] / [0-9] / [_$] ;

Literal
    = literal:( 
      FloatLiteral
      / IntegerLiteral          // May be a prefix of FloatLiteral
      / StringLiteral
      / "true"  !LetterOrDigit
      { return { type: 'BooleanLiteral', value: true }; }
      / "false" !LetterOrDigit
      { return { type: 'BooleanLiteral', value: false }; }
      / "null"  !LetterOrDigit
      { return { type: 'NullLiteral' }; }
      ) Spacing
    { return literal; }

IntegerLiteral
    = ( HexNumeral
      / BinaryNumeral
      / OctalNumeral            // May be a prefix of HexNumeral or BinaryNumeral
      / DecimalNumeral          // May be a prefix of OctalNumeral
      ) [lL]?
    { return { type: 'NumberLiteral', value: text() }; }

DecimalNumeral
    = "0"
    / [1-9]([_]*[0-9])*

HexNumeral
    = ("0x" / "0X") HexDigits

BinaryNumeral
    = ("0b" / "0B") [01]([_]*[01])*

OctalNumeral
    = "0" ([_]*[0-7])+

FloatLiteral
    = ( HexFloat / DecimalFloat )
    { return { type: 'NumberLiteral', value: text() }; }

DecimalFloat
    = Digits "." Digits?  Exponent? [fFdD]?
    / "." Digits Exponent? [fFdD]?
    / Digits Exponent [fFdD]?
    / Digits Exponent? [fFdD]

Exponent
    = [eE] [+\-]? Digits

HexFloat
    = HexSignificand BinaryExponent [fFdD]?

HexSignificand
    = ("0x" / "0X") HexDigits? "." HexDigits
    / HexNumeral "."?                           // May be a prefix of above

BinaryExponent
    = [pP] [+\-]? Digits

Digits
    = [0-9]([_]*[0-9])*

HexDigits
    = HexDigit ([_]*HexDigit)*

HexDigit
    = [a-f] / [A-F] / [0-9]

StringLiteral
    = "\'" chars:(Escape / !['\\\n\r] . )* "\'"                   
    { return { type: 'Literal', value: chars.map(l => l[0] == undefined ? l[1] : l[0] + l[1]).join('') } }

Escape
    = "\\" ([btnfr"'\\] / OctalEscape / UnicodeEscape)

OctalEscape
    = [0-3][0-7][0-7]
    / [0-7][0-7]
    / [0-7]

UnicodeEscape
    = "u"+ HexDigit HexDigit HexDigit HexDigit


/* ---- Separators, Operators ----- */

AT              =   "@"       Spacing
ADD             =   "add"     Spacing
ANDAND          =   "and"     Spacing
COLON           =   ":"       Spacing
COMMA           =   ","       Spacing
DIV             =   "div"     Spacing
DOT             =   "/"       Spacing
EQUAL           =   "eq"      Spacing
GE              =   "ge"      Spacing
GT              =   "gt"      Spacing
HYPHEN          =   "-"       Spacing
LBRK            =   "["       Spacing
LE              =   "le"      Spacing
LPAR            =   "("       Spacing
LT              =   "lt"      Spacing
MINUS           =   "-"       Spacing
MOD             =   "mod"     Spacing
NOTEQUAL        =   "ne"      Spacing
NOT             =   "not"     Spacing
OROR            =   "or"      Spacing
PLUS            =   "+"       Spacing
RBRK            =   "]"       Spacing
RPAR            =   ")"       Spacing
RPOINT          =   "gt"      Spacing
SUB             =   "sub"     Spacing
MUL             =   "mul"     Spacing