function Transform(matrix) {
  this.m = matrix;
}

Transform.prototype.applyTransform = function (c) {
  c.setTransform(this.m[0], this.m[1], this.m[2], this.m[3], this.m[4], this.m[5]);
};

Transform.prototype.log = function () {
  return this.m;
};

Transform.prototype.invert = function () {
  var d = 1 / (this.m[0] * this.m[3] - this.m[1] * this.m[2]);
  var m0 = this.m[3] * d;
  var m1 = -this.m[1] * d;
  var m2 = -this.m[2] * d;
  var m3 = this.m[0] * d;
  var m4 = d * (this.m[2] * this.m[5] - this.m[3] * this.m[4]);
  var m5 = d * (this.m[1] * this.m[4] - this.m[0] * this.m[5]);
  return new Transform([m0, m1, m2, m3, m4, m5]);
};

Transform.prototype.translate = function (x, y) {
  this.m[4] += this.m[0] * x;
  this.m[5] += this.m[3] * y;
};

Transform.prototype.scale = function (s) {
  this.m[0] *= s;
  this.m[3] *= s;
};

Transform.prototype.setTransform = function (m) {
  this.m = m;
};

Transform.prototype.transformPoint = function (point) {
  return new Point(this.m[0] * point.x + this.m[4], this.m[3] * point.y + this.m[5]);
};

Transform.prototype.getScale = function () {
  return this.m[0];
};

function Point(x, y) {
  this.x = x;
  this.y = y;
}

Point.prototype.setX = function (x) {
  this.x = x;
};

Point.prototype.setY = function (y) {
  this.y = y;
};

Point.prototype.toString = function () {
  return '(' + this.x + ', ' + this.y + ')';
};