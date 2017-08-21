// node app "((name=Joni Mitchell)&(active=true))|((_id=101)&(name=My first project))"
'use strict';
const q = require('q'),
      util = require('./util.js');

var expression = process.argv.slice(2)[0];
console.log('expression: ' + expression);

q.all([
  util.readJsonFilePromise('./data/users.json', 'utf-8'),
  util.readJsonFilePromise('./data/projects.json', 'utf-8'),
]).spread(function(users, projects) {
  // search
  var index = 1;
  for (let user of users) {
    if (util.CalculateBooleanExpression(user, expression) == true) {
      console.log(index + '. ///////////////////////');
      index++;
      console.log(user);
    }
  }
  for (let project of projects) {
    if (util.CalculateBooleanExpression(project, expression) == true) {
      console.log(index + '. ///////////////////////');
      index++;
      console.log(project);
    }
  }
}).catch(function(error) {
  console.log(error);
});
