'use strict';
const q = require('q'),
  fs = require('fs'),
  Array = require('./stackArray.js');

// đọc JSON object từ file .json
exports.readJsonFilePromise = function(path, encoding) {
  var defer = q.defer();
  fs.readFile(path, encoding, function (error, text) {
    if (error) {
      defer.reject(new Error(error));
    } else {
      var objects = JSON.parse(text);
      defer.resolve(objects);
    }
  });
  return defer.promise;
}

function getTokenPriority(token) {
  if (token == "=") return 2;
  else if (token == "&" || token == "|") return 1;
  else return 0;
}

function isTokenOperator(ope) {
  if (getTokenPriority(ope) == 0) {
    if (ope != "(" && ope != ")") return 0;
    else return 1;
  }
  return 2;
}

function ConvertInfixToPostfix(exp) {
  var Stack = [];
  var Output = [];
  var number = "";
  for (let s of exp) {
    if (isTokenOperator(s) == 0) {
      number += s;
    } else {
      // Push toán hạng vào Output
      if (number.length > 0) {
        Output.push(number);
        number = "";
      }
      if (isTokenOperator(s) == 1) {
        if (s == "(") Stack.push("(");
        else if (s == ")") {
          var pop = Stack.pop();
          while (pop != "(") {
            Output.push(pop);
            pop = Stack.pop();
          }
        }
      }
      else {
        while (!Stack.empty() && getTokenPriority(Stack.back()) >= getTokenPriority(s))
          Output.push(Stack.pop());
        Stack.push(s);
      }
    }
  }
  // Trường hợp còn sót lại toán hạng cuối cùng
  if (number.length > 0) {
    Output.push(number);
    number = "";
  }
  while (!Stack.empty()) Output.push(Stack.pop());
  return Output;
}

exports.CalculateBooleanExpression = function(object, expression) {
  var Input = ConvertInfixToPostfix(expression);
  var Stack = [];
  for (let item of Input) {
    if (isTokenOperator(item) == 0) Stack.push(item);
    else {
      var b = Stack.pop();
      var a = Stack.pop();

      if (item == "=") {
        if (!object[a]) Stack.push(a.toString() == b.toString() ? true : false);
        else Stack.push(object[a].toString() == b.toString() ? true : false);
      } else if (item == "|") Stack.push((a == true || b == true) ? true : false);
      else if (item == "&") Stack.push((a == true && b == true) ? true : false);
    }
  }
  return Stack.pop();
}
