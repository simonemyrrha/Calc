/**
 * This file is part of the NovaeCalc project.
 *
 * It is permitted to use, redistribute and/or modify this software
 * under the terms of the BSD License
 *
 * @author Felix Maier <maier.felix96@gmail.com>
 * @copyright (c) 2015 Felix Maier, @felixmaier
 *
 * You may not change or remove these lines
 *
 */

"use strict";

  /**
   * Function to compare mathematical results of ENGEL
   * and the javascript interpreter
   */
  var interpret = function() {

    /** Default variable name */
    var varName = "A1 =";
    /** Save the variable name without equal sign */
    var singleVarName = varName.slice(0, 2);

    var reservedFunctions = ["asin","sin","acos","cos","atan","atan2","tan","sqrt","cbrt","exp","random","min","max","round","floor","ceil"];
    var compile = "";

    var engelResult = 0;
    var jsResult = 0;
    var failures = 0;

    var array = [
      /** Float numbers */
      "(2.5+2.0)",
      "(-2.5+2.0)+2.25",
      /** Plus */
      "2+2",
      "99+9+3",
      /** Minus */
      "2-2",
      "999-9",
      "100-5-10",
      "999- -9",
      /** Mult */
      "2*2",
      /** Division */
      "10/2",
      /** Operator precedence */
      "5+5*2",
      /** Negative numbers */
      "-20",
      "(-2.5*2)",
      "100-22- -30",
      "22-5+10- -20*-7/(-33.5)",
      /** Parentheses */
      "(5*5)-(2+10)*3-(99)",
      /** Parentheses operator precedence */
      "-(2*2)+10",
      "-((2*2)+-(5+2))",
      "-((-5*5)+(7*7)+-(-9))",
      "-(-(2*2)+5)",
      "(-(-(5*5)))+-(-5*-(-5))",
      /** Math api */
      "10 + max(22, (7*7) * 5 + 10) + 5",
      "10 + max(10, 2*2, max(10), 99)",
      "10 + max(max(10, 2*2, max(), min(10,20), max(5*5, 10, max(7*7)) + 20, 4*9) + 2 * max(5, 10) + 90 * min(22, 33) + 10) + min(999, 1000) * 2"
    ];

    for (var ii = 0; ii < array.length; ++ii) {

      compile = array[ii];

      /** Automatically translate math api calls into js format */
      for (var kk = 0; kk < reservedFunctions.length; ++kk) {
        if (compile.match(reservedFunctions[kk])) {
          compile = compile.replace( new RegExp("" + reservedFunctions[kk] + "", "g"), "Math." + reservedFunctions[kk]);
        }
      }

      engelResult = ENGEL.interpret(varName + array[ii]).Stack.VAR[singleVarName].value.value;
      jsResult = parseFloat(window.eval(compile));

      if (engelResult !== jsResult) {
        failures++;
        console.log("#### Results doesn't match! => " + (array[ii]) + " ####");
        console.log( "ENGEL:", engelResult);
        console.log( "JS:   ", jsResult);
        document.body.innerHTML += "<font color='red'>✕</font> " + array[ii] + "<br/>";
      } else {
        document.body.innerHTML += "<font color='green'>√</font> " + array[ii] + "<br/>";
      }

    }

    if (!failures) console.info("%cAll tests passed successfully!", "color: darkgreen;");

  };

  Import.scripts = [
    /** Interpreter */
    "../core/interpreter/main.js",
    "../core/interpreter/stack.js",
    "../core/interpreter/lexer.js",
    "../core/interpreter/parser/main.js",
    "../core/interpreter/parser/expression.js",
    "../core/interpreter/parser/arguments.js",
    "../core/interpreter/evaluator/main.js",
    "../core/interpreter/evaluator/expression.js",
    "../core/interpreter/evaluator/function.js",
    "../core/interpreter/evaluator/statement.js",
    "../core/interpreter/type.js"
  ];

  Import.after = function() {
    ENGEL.init();
    interpret();
  };

  Import.me();