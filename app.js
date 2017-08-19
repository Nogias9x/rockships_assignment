// // node app "(_id==102|(active=true&shared=false)&verified=true)"
// // node app "(1=12|(2=3&4=4)&5=5)"
// 5.5/2+3*(4/8–2)
// 5.5=2|3=(4=8&2)
//
//
'use strict';
const Array = require('./StackArray.js');

function getPriority(ope) {
  if (ope == "=") return 2;
  else if (ope == "&" || ope == "|") return 1;
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
    console.log('S: ' + s);
    if (isOperator(s) == 0){
      number += s;
      console.log('number: ' + number);

    }
    else {
      // Push toán hạng vào Output
      if (number.length > 0) {
        Output.myPush(number);
        number = "";
      }
      if (isOperator(s) == 1) {
        if (s == "(") Stack.myPush("(");
        else if (s == ")") {
          var pop = Stack.pop();
          while (pop != "(") {
            Output.myPush(pop);
            pop = Stack.pop();
          }
        }
      }
      else {
        while (!Stack.empty() && getPriority(Stack.back()) >= getPriority(s))
          Output.myPush(Stack.pop());
        Stack.myPush(s);
      }
    }
  }
  // Trường hợp còn sót lại toán hạng cuối cùng
  if (number.length > 0) {
    Output.myPush(number);
    number = "";
  }
  while (!Stack.empty()) Output.myPush(Stack.pop());
  console.log('POSTFIX: ' + Output);
  return Output;
}



function Calc(Input) {
  var Stack = [];
  for (let item of Input) {
    console.log('ITEM: ' + item);
    if (isOperator(item) == 0) Stack.myPush(item);
    else {
      var a = Stack.pop();
      var b = Stack.pop();

      if (item == "=") Stack.myPush(a == b ? true : false);
      else if (item == "|") Stack.myPush((a == true || b == true) ? true : false);
      else if (item == "&") Stack.myPush((a == true && b == true) ? true : false);

    }
  }
  return Stack.pop();
}

var expression = process.argv.slice(2);
console.log('expression: ' + expression[0]);
console.log(Calc(ConvertToPostfix(expression[0])));
