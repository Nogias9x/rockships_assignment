// // node app "(_id==102 || (active==true && shared==false) && verified==true)"
'use strict';
const String = require('./SuperString.js');
const Array = require('./StackArray.js');

function getPriority(ope) {
  // Ta có thể set quyền cao hơn ở đây. VD như if (ope == "^") return 3;
  if (ope == "*" || ope == "/") return 2;
  else if (ope == "+" || ope == "-") return 1;
  else return 0;
}

function isOperator(ope) {
  if (getPriority(ope) == 0) {
    if (ope != "(" && ope != ")") return 0;
    else return 1;
  }
  return 2;
}

function ConvertToPostfix(exp) {
  var Stack = [];
  var Output = [];
  // Do có những toán hạng lớn hơn 10, hoặc số thập phân => Có nhiều hơn 1 ký tự
  // Ta cần phải add toàn bộ các kí tự số đó vào chuỗi number
  var number = "";
  for (let s of exp) {
    if (isOperator(s) == 0) number += s;
    else {
      // Push toán hạng vào Output
      if (number.length > 0) {
        Output.push(number);
        number = "";
      }
      if (isOperator(s) == 1) {
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
        while (!Stack.empty() && getPriority(Stack.back()) >= getPriority(s))
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
  console.log('POSTFIX: ' + Output);
  return Output;
}



function Calc(Input) {
  var Stack = [];
  for (let item of Input) {
    console.log('ITEM: ' + item);
    if (isOperator(item) == 0) Stack.myPush(item);
    else {
      // Do ta cần quan tâm đến thứ tự các toán hạng
      // Nên ta phải Pop vế sau trước, sau đó vế trước mới Pop sau
      var b = parseFloat(Stack.pop());
      var a = parseFloat(Stack.pop());

      if (item == "+") Stack.myPush(a + b);
      else if (item == "-") Stack.myPush(a - b);
      else if (item == "*") Stack.myPush(a * b);
      else if (item == "/") Stack.myPush(a / b);
    }
  }
  return parseFloat(Stack.pop());
}

// 5.5/2+3*(4/8–2)
var exp ='5.5/2+3*(4/8-2)';
// console.log(ConvertToPostfix(exp));
console.log(Calc(ConvertToPostfix(exp)));
