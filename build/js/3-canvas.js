var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var buffer = document.createElement('canvas');
var buffercontext = buffer.getContext('2d');

var screen_to_canvas = new Transform([1, 0, 0, 1, 0, 0]);
var canvas_to_screen = new Transform([1, 0, 0, 1, 0, 0]);

var screen_pt = new Point(0, 0);

var offset_x = 0;
var offset_y = 0;

var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;

canvas.width = WIDTH;
canvas.height = HEIGHT;
canvas.style.width = WIDTH;
canvas.style.height = HEIGHT;

buffer.width = WIDTH;
buffer.height = HEIGHT;
buffer.style.width = WIDTH;
buffer.style.height = HEIGHT;

var drawables = [];
var surface = new Surface(WIDTH, HEIGHT);
surface.generate();
surface.init_matrices();

var timer;
var intervals = [];

var init_surface = () => {
  drawables = [];
  surface = new Surface(WIDTH, HEIGHT);
  surface.generate();
  surface.init_matrices();
  drawables.push(surface);

  intervals.forEach(clearInterval);

  var rotate_int = window.setInterval(function () {
    surface.rotate_y();
  }, 80);

  intervals.push(rotate_int);

  screen_to_canvas.setTransform([1, 0, 0, 1, 0, 0]);
  canvas_to_screen.setTransform([1, 0, 0, 1, 0, 0]);

  translate(WIDTH / 2, HEIGHT / 2);
  scale(new Point(0,0), 0.25);
  draw();
};

canvas.onselectstart = function () { return false; };

canvas.onmousemove = function (e) {
  getMousePos(e);
  /*
  // change points around mouse pos
  if (surface) {
    surface.closest_pts(screen_to_canvas.transformPoint(screen_pt));
  }
  */

  if (surface) {
    surface.set_random_color();
  }
  clearTimeout(timer);
  timer = setTimeout(mouseStopped, 100);
};

mouseStopped = () => {
  if (surface) {
    surface.reset_color();
  }
}
 
canvas.ondblclick = (e) => {
  e.preventDefault();
  e.stopPropagation();
}

canvas.addEventListener("touchstart", function(e) {
  e.preventDefault();
  e.stopPropagation();
  if (surface) {
    surface.set_random_color();
  }
}, false);

canvas.addEventListener("touchend", function(e) {
  e.preventDefault();
  e.stopPropagation();
  if (surface) {
    surface.reset_color();
  }
}, false);

getMousePos = (e) => {
  offset_x = 0;
  offset_y = 0;

  if (canvas.offsetParent) {
    do {
      this.offset_x += canvas.offsetLeft;
      this.offset_y += canvas.offsetTop;
    } while ((canvas === canvas.offsetParent));
  }

  screen_pt.setX(e.pageX - offset_x);
  screen_pt.setY(e.pageY - offset_y);
}

translate = (dxCanvas, dyCanvas) => {
  canvas_to_screen.translate(dxCanvas, dyCanvas);
  screen_to_canvas = canvas_to_screen.invert();
}

scale = (pCanvas, s) => {
  canvas_to_screen.translate(pCanvas.x, pCanvas.y);
  canvas_to_screen.scale(s);
  canvas_to_screen.translate(-pCanvas.x, -pCanvas.y);
  screen_to_canvas = canvas_to_screen.invert();
}

var clear = (c) => {
  c.save();
  c.setTransform(1, 0, 0, 1, 0, 0);
  c.clearRect(0, 0, WIDTH, HEIGHT);
  c.restore();
}

draw = function () {
  clear(buffercontext);
  clear(context);

  //buffercontext.save();
  canvas_to_screen.applyTransform(buffercontext);

  for (var i = 0; i < drawables.length; i++) {
    drawables[i].draw(buffercontext);
  }

  //buffercontext.restore();
  context.drawImage(buffer, 0, 0);
}

window.addEventListener('resize', function () {
  WIDTH = window.innerWidth;
  HEIGHT = window.innerHeight;

  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  canvas.style.width = WIDTH;
  canvas.style.height = HEIGHT;

  buffer.width = WIDTH;
  buffer.height = HEIGHT;
  buffer.style.width = WIDTH;
  buffer.style.height = HEIGHT;

  clear(buffercontext);
  clear(context);

  init_surface();
}, false);

window.requestAnimFrame = (function () {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    };
})();

function animate() {
  requestAnimFrame(animate);
  draw();
}

$(document).ready(function() {
  $('#code').hover(function() {
    $('#made_with').css('visibility','visible');
  }, function() {
    $('#made_with').css('visibility','hidden');
  });
  
  $('#email').click(function(e) {
    window.location.href = "mailto:annliu03@gmail.com";
  });
})

init_surface();
animate();