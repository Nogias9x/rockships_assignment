Array.prototype.myPush = function(value) {
    this.push(value);
    // console.log('PUSH: ' + this);

};

Array.prototype.back = function() {
    return this[this.length-1];
};

Array.prototype.empty = function() {
    return this.length > 0 ? false : true;
};

module.exports = Array;
