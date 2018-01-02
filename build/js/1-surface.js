/* https://msdn.microsoft.com/en-us/library/hh535759(v=vs.85).aspx */

const X = 0,
  Y = 1,
  Z = 2;


function Surface(w, h) {
  this.points = [];
  this.orientation = w > h;
  this.xMin = this.orientation ? -Math.floor(w / 12) : -Math.floor(w / 8);
  this.xMax = this.orientation ? Math.floor(w / 12) : Math.floor(w / 8);
  this.yMin = this.orientation ? -Math.floor(h / 8) : -Math.floor(h / 12);
  this.yMax = this.orientation ? Math.floor(h / 8) : Math.floor(h / 12);
  this.xDelta = 1;
  this.yDelta = 1;
  this.surfaceScale = 24;
  this.dTheta = 0.05;
  this.Rx = [[0, 0, 0],
  [0, 0, 0],
  [0, 0, 0]];
  this.Ry = [[0, 0, 0],
  [0, 0, 0],
  [0, 0, 0]];
  this.Rz = [[0, 0, 0],
  [0, 0, 0],
  [0, 0, 0]];
}

Surface.prototype.point = function (x, y, z) {
  return [x, y, z];
}

Surface.prototype.equation = function (x, y) {
  var d = Math.pow(x, 2) / y + Math.pow(y, 2) / x;
  return d;
}

Surface.prototype.generate = function () {
  var i = 0;
  for (var x = this.xMin; x <= this.xMax; x += this.xDelta) {
    for (var y = this.yMin; y <= this.yMax; y += this.yDelta) {
      this.points[i] = this.point(x, y, this.equation(x, y));
      this.points[i].color = '#fff'
      ++i;
    }
  }
}

Surface.prototype.draw = function (context) {
  for (var i = 0; i < this.points.length; i++) {
    context.beginPath();
    context.fillStyle = this.points[i].color;
    context.fillRect(this.points[i][X] * this.surfaceScale,
      this.points[i][Y] * this.surfaceScale, 6, 6);
    context.closePath();
  }
}

Surface.prototype.multiply = function (R) {
  var Px = 0, Py = 0, Pz = 0;
  var P = this.points;
  var sum;

  for (var V = 0; V < P.length; V++) {
    Px = P[V][X], Py = P[V][Y], Pz = P[V][Z];
    for (var Rrow = 0; Rrow < 3; Rrow++) {
      sum = (R[Rrow][X] * Px) + (R[Rrow][Y] * Py) + (R[Rrow][Z] * Pz);
      P[V][Rrow] = sum;
    }
  }
}

Surface.prototype.init_matrices = function () {
  this.Rx[0][0] = 1;
  this.Rx[0][1] = 0;
  this.Rx[0][2] = 0;
  this.Rx[1][0] = 0;
  this.Rx[1][1] = Math.cos(this.dTheta);
  this.Rx[1][2] = -Math.sin(this.dTheta);
  this.Rx[2][0] = 0;
  this.Rx[2][1] = Math.sin(this.dTheta);
  this.Rx[2][2] = Math.cos(this.dTheta);

  this.Ry[0][0] = Math.cos(this.dTheta);
  this.Ry[0][1] = 0;
  this.Ry[0][2] = Math.sin(this.dTheta);
  this.Ry[1][0] = 0;
  this.Ry[1][1] = 1;
  this.Ry[1][2] = 0;
  this.Ry[2][0] = -Math.sin(this.dTheta);
  this.Ry[2][1] = 0;
  this.Ry[2][2] = Math.cos(this.dTheta);

  this.Rz[0][0] = Math.cos(this.dTheta);
  this.Rz[0][1] = -Math.sin(this.dTheta);
  this.Rz[0][2] = 0;
  this.Rz[1][0] = Math.sin(this.dTheta);
  this.Rz[1][1] = Math.cos(this.dTheta);
  this.Rz[1][2] = 0;
  this.Rz[2][0] = 0
  this.Rz[2][1] = 0;
  this.Rz[2][2] = 1;
}

Surface.prototype.rotate_x = function () {
  this.multiply(this.Rx);
}

Surface.prototype.rotate_y = function () {
  this.multiply(this.Ry);
}


Surface.prototype.rotate_z = function () {
  this.multiply(this.Rz);
}


Surface.prototype.random_color = function () {
  return "#000000".replace(/0/g, function () {
    return (~~(Math.random() * 16)).toString(16);
  });
}

Surface.prototype.set_random_color = function () {
  for (var i = 0; i < this.points.length; i++) {
    this.points[i].color = this.random_color();
  }
}

Surface.prototype.reset_color = function () {
  for (var i = 0; i < this.points.length; i++) {
    this.points[i].color = '#fff';
  }
}

Surface.prototype.closest_pts = function (pt) {
  for (var i = 0; i < this.points.length; i++) {
    var dist = Math.abs(Math.sqrt(Math.pow(this.points[i][X] * this.surfaceScale - pt.x, 2) 
      + Math.pow(this.points[i][Y] * this.surfaceScale - pt.y, 2)));
    if (dist) {
      if (dist <= 400) {
        this.points[i].color = this.random_color();
      } else {
        this.points[i].color = '#fff';
      }
    }
  }
}
