// node app "((name=Joni Mitchell)&(active=true))|((_id=101)&(name=My first project))"

'use strict';
const Array = require('./StackArray.js'),
      fs = require('fs'),
      q = require('q');

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
  var number = "";
  for (let s of exp) {
    if (isOperator(s) == 0) {
      number += s;
    } else {
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
  return Output;
}



function Calc(object, expression) {
  var Input = ConvertToPostfix(expression);
  var Stack = [];
  for (let item of Input) {
    if (isOperator(item) == 0) Stack.myPush(item);
    else {
      var b = Stack.pop();
      var a = Stack.pop();

      if (item == "=") {
        if (!object[a]) Stack.myPush(a.toString() == b.toString() ? true : false);
        else Stack.myPush(object[a].toString() == b.toString() ? true : false);
      } else if (item == "|") Stack.myPush((a == true || b == true) ? true : false);
      else if (item == "&") Stack.myPush((a == true && b == true) ? true : false);
    }
  }
  return Stack.pop();
}

var expression = process.argv.slice(2)[0];
console.log('expression: ' + expression);

/////////////////////////////////////
// đọc JSON object từ file .json
function readJsonFilePromise(path, encoding) {
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

q.all([
  readJsonFilePromise('./data/users.json', 'utf-8'),
  readJsonFilePromise('./data/projects.json', 'utf-8'),
]).spread(function(users, projects) {
  // search
  var index = 1;
  for (let user of users) {
    if (Calc(user, expression) == true) {
      console.log(index + '. ///////////////////////');
      index++;
      console.log(user);
    }
  }
  for (let project of projects) {
    if (Calc(project, expression) == true) {
      console.log(index + '. ///////////////////////');
      index++;
      console.log(project);
    }
  }
}).catch(function(error) {
  console.log(error);
});
