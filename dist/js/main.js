const X=0,Y=1,Z=2;function Surface(t,e){this.points=[],this.orientation=t>e,this.xMin=this.orientation?-Math.floor(t/12):-Math.floor(t/8),this.xMax=this.orientation?Math.floor(t/12):Math.floor(t/8),this.yMin=this.orientation?-Math.floor(e/8):-Math.floor(e/12),this.yMax=this.orientation?Math.floor(e/8):Math.floor(e/12),this.xDelta=1,this.yDelta=1,this.surfaceScale=24,this.dTheta=.05,this.Rx=[[0,0,0],[0,0,0],[0,0,0]],this.Ry=[[0,0,0],[0,0,0],[0,0,0]],this.Rz=[[0,0,0],[0,0,0],[0,0,0]]}Surface.prototype.point=function(t,e,s){return[t,e,s]},Surface.prototype.equation=function(t,e){return Math.pow(t,2)/e+Math.pow(e,2)/t},Surface.prototype.generate=function(){for(var t=0,e=this.xMin;e<=this.xMax;e+=this.xDelta)for(var s=this.yMin;s<=this.yMax;s+=this.yDelta)this.points[t]=this.point(e,s,this.equation(e,s)),this.points[t].color="#fff",++t},Surface.prototype.draw=function(t){for(var e=0;e<this.points.length;e++)t.beginPath(),t.fillStyle=this.points[e].color,t.fillRect(this.points[e][0]*this.surfaceScale,this.points[e][1]*this.surfaceScale,6,6),t.closePath()},Surface.prototype.multiply=function(t){for(var e,s=0,i=0,n=0,o=this.points,a=0;a<o.length;a++){s=o[a][0],i=o[a][1],n=o[a][2];for(var r=0;r<3;r++)e=t[r][0]*s+t[r][1]*i+t[r][2]*n,o[a][r]=e}},Surface.prototype.init_matrices=function(){this.Rx[0][0]=1,this.Rx[0][1]=0,this.Rx[0][2]=0,this.Rx[1][0]=0,this.Rx[1][1]=Math.cos(this.dTheta),this.Rx[1][2]=-Math.sin(this.dTheta),this.Rx[2][0]=0,this.Rx[2][1]=Math.sin(this.dTheta),this.Rx[2][2]=Math.cos(this.dTheta),this.Ry[0][0]=Math.cos(this.dTheta),this.Ry[0][1]=0,this.Ry[0][2]=Math.sin(this.dTheta),this.Ry[1][0]=0,this.Ry[1][1]=1,this.Ry[1][2]=0,this.Ry[2][0]=-Math.sin(this.dTheta),this.Ry[2][1]=0,this.Ry[2][2]=Math.cos(this.dTheta),this.Rz[0][0]=Math.cos(this.dTheta),this.Rz[0][1]=-Math.sin(this.dTheta),this.Rz[0][2]=0,this.Rz[1][0]=Math.sin(this.dTheta),this.Rz[1][1]=Math.cos(this.dTheta),this.Rz[1][2]=0,this.Rz[2][0]=0,this.Rz[2][1]=0,this.Rz[2][2]=1},Surface.prototype.rotate_x=function(){this.multiply(this.Rx)},Surface.prototype.rotate_y=function(){this.multiply(this.Ry)},Surface.prototype.rotate_z=function(){this.multiply(this.Rz)},Surface.prototype.random_color=function(){return"#000000".replace(/0/g,function(){return(~~(16*Math.random())).toString(16)})},Surface.prototype.set_random_color=function(){for(var t=0;t<this.points.length;t++)this.points[t].color=this.random_color()},Surface.prototype.reset_color=function(){for(var t=0;t<this.points.length;t++)this.points[t].color="#fff"},Surface.prototype.closest_pts=function(t){for(var e=0;e<this.points.length;e++){var s=Math.abs(Math.sqrt(Math.pow(this.points[e][0]*this.surfaceScale-t.x,2)+Math.pow(this.points[e][1]*this.surfaceScale-t.y,2)));s&&(this.points[e].color=s<=400?this.random_color():"#fff")}};function Transform(t){this.m=t}Transform.prototype.applyTransform=function(t){t.setTransform(this.m[0],this.m[1],this.m[2],this.m[3],this.m[4],this.m[5])},Transform.prototype.log=function(){return this.m},Transform.prototype.invert=function(){var t=1/(this.m[0]*this.m[3]-this.m[1]*this.m[2]);return new Transform([this.m[3]*t,-this.m[1]*t,-this.m[2]*t,this.m[0]*t,t*(this.m[2]*this.m[5]-this.m[3]*this.m[4]),t*(this.m[1]*this.m[4]-this.m[0]*this.m[5])])},Transform.prototype.translate=function(t,e){this.m[4]+=this.m[0]*t,this.m[5]+=this.m[3]*e},Transform.prototype.scale=function(t){this.m[0]*=t,this.m[3]*=t},Transform.prototype.setTransform=function(t){this.m=t},Transform.prototype.transformPoint=function(t){return new Point(this.m[0]*t.x+this.m[4],this.m[3]*t.y+this.m[5])},Transform.prototype.getScale=function(){return this.m[0]};function Point(t,e){this.x=t,this.y=e}Point.prototype.setX=function(t){this.x=t},Point.prototype.setY=function(t){this.y=t},Point.prototype.toString=function(){return"("+this.x+", "+this.y+")"};var canvas=document.getElementById("canvas"),context=canvas.getContext("2d"),buffer=document.createElement("canvas"),buffercontext=buffer.getContext("2d"),screen_to_canvas=new Transform([1,0,0,1,0,0]),canvas_to_screen=new Transform([1,0,0,1,0,0]),screen_pt=new Point(0,0),offset_x=0,offset_y=0,WIDTH=window.innerWidth,HEIGHT=window.innerHeight;canvas.width=WIDTH,canvas.height=HEIGHT,canvas.style.width=WIDTH,canvas.style.height=HEIGHT,buffer.width=WIDTH,buffer.height=HEIGHT,buffer.style.width=WIDTH,buffer.style.height=HEIGHT;var drawables=[],surface=new Surface(WIDTH,HEIGHT);surface.generate(),surface.init_matrices();var timer,intervals=[],init_surface=()=>{drawables=[],(surface=new Surface(WIDTH,HEIGHT)).generate(),surface.init_matrices(),drawables.push(surface),intervals.forEach(clearInterval);var t=window.setInterval(function(){surface.rotate_y()},80);intervals.push(t),screen_to_canvas.setTransform([1,0,0,1,0,0]),canvas_to_screen.setTransform([1,0,0,1,0,0]),translate(WIDTH/2,HEIGHT/2),scale(new Point(0,0),.25),draw()};canvas.onselectstart=function(){return!1},canvas.onmousemove=function(t){getMousePos(t),surface&&surface.set_random_color(),clearTimeout(timer),timer=setTimeout(mouseStopped,100)},mouseStopped=(()=>{surface&&surface.reset_color()}),canvas.ondblclick=(t=>{t.preventDefault(),t.stopPropagation()}),canvas.addEventListener("touchstart",function(t){t.preventDefault(),t.stopPropagation(),surface&&surface.set_random_color()},!1),canvas.addEventListener("touchend",function(t){t.preventDefault(),t.stopPropagation(),surface&&surface.reset_color()},!1),getMousePos=(t=>{if(offset_x=0,offset_y=0,canvas.offsetParent)do{this.offset_x+=canvas.offsetLeft,this.offset_y+=canvas.offsetTop}while(canvas===canvas.offsetParent);screen_pt.setX(t.pageX-offset_x),screen_pt.setY(t.pageY-offset_y)}),translate=((t,e)=>{canvas_to_screen.translate(t,e),screen_to_canvas=canvas_to_screen.invert()}),scale=((t,e)=>{canvas_to_screen.translate(t.x,t.y),canvas_to_screen.scale(e),canvas_to_screen.translate(-t.x,-t.y),screen_to_canvas=canvas_to_screen.invert()});var clear=t=>{t.save(),t.setTransform(1,0,0,1,0,0),t.clearRect(0,0,WIDTH,HEIGHT),t.restore()};draw=function(){clear(buffercontext),clear(context),buffercontext.save(),canvas_to_screen.applyTransform(buffercontext);for(var t=0;t<drawables.length;t++)drawables[t].draw(buffercontext);buffercontext.restore(),context.drawImage(buffer,0,0)},window.addEventListener("resize",function(){WIDTH=window.innerWidth,HEIGHT=window.innerHeight,canvas.width=WIDTH,canvas.height=HEIGHT,canvas.style.width=WIDTH,canvas.style.height=HEIGHT,buffer.width=WIDTH,buffer.height=HEIGHT,buffer.style.width=WIDTH,buffer.style.height=HEIGHT,clear(buffercontext),clear(context),init_surface()},!1),window.requestAnimFrame=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||function(t){window.setTimeout(t,1e3/60)};function animate(){requestAnimFrame(animate),draw()}$(document).ready(function(){$("#info").hover(function(){$("#made_with").css("visibility","visible")},function(){$("#made_with").css("visibility","hidden")}),$("#email").click(function(t){window.location.href="mailto:annliu03@gmail.com"})}),init_surface(),animate();