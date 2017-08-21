1. Install all required packages:
$ npm install

2. Search:
$ node app "expression"
- "=" is "equals", "|" is "or", and "&" is "and".
- Every single condition should be given in a pair of parentheses.
Example: $ node app "((name=Joni Mitchell)&(active=true))|((_id=101)&(name=My first project))"
