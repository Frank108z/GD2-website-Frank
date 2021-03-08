var canvas;
var ctx;
var w = 1520;
var h = 880;
var allCircles = [];

var o1 = {
  "x": 0,
  "changex": rand(10),
  "y": h/2,
  "changey":rand(10),
  "r": 50,
  "w": 100,
  "h": 100,
  "c": 345,
  "a": 0.5,
  "d": 10,
  "angle": 0,
  "changle": 15
}
var o3 = {
  "x": w/2,
  "changex": rand(10),
  "y": 0,
  "changey":rand(10),
  "r": 50,
  "w": 210,
  "h": 100,
  "c": 350,
  "a": 0.5,
  "d": 10,
  "angle": 100,
}
var o4 = {
  "x": w/1.5,
  "y": 50,
  "r": 50,
  "w": 580,
  "h": 100,
  "c": 360,
  "a": 0.5,
  "d": 10,
  "angle": 130,
}
var o5 = {
  "x": w/2.5,
  "y": 0,
  "r": 50,
  "w": 280,
  "h": 100,
  "c": 360,
  "a": 0.5,
  "d": 10,
  "angle": 100,
}
var o6 = {
  "x": w/1.3,
  "y": 50,
  "r": 50,
  "w": 380,
  "h": 100,
  "c": 380,
  "a": 0.5,
  "d": 10,
  "angle": 150,
 }
var o7 = {
  "x": w/3,
  "y": 0,
  "r": 50,
  "w": 520,
  "h": 100,
  "c": 380,
  "a": 0.5,
  "d": 10,
  "angle": 90,
  }


document.onkeydown = moveShape;




setUpCanvas();
creatData(135);
animationLoop();

function animationLoop(){
  clear();
  rect(o1);
  forward(o1);
  rect(o3);
  rect(o4);
  rect(o5);
  rect(o6);
  rect(o7);
  
  
  

 for(var i=0; i<allCircles.length; i++){
   circle(allCircles[i]);
   forward(allCircles[i]);
   bounce(allCircles[i]);
   turn(allCircles[i], randn(30));
   collisionRemove(o1,allCircles[i]);
   collisionTestArray(allCircles[i],allCircles)
 }

   bounce(o1);

   requestAnimationFrame(animationLoop)
 }

 function move(event){
    
  for(var i=0; i<allRect.length; i++){
      o1[i].w = 10+event.offsetX/6;
      o1[i].h = 10+event.offsetY/6;
  }

  console.log(event.offsetX, event.offsetY);
}

 function moveShape(event){
  if(o1.length != 0){
      
      if(event.keyCode == 38){
          o1.d++
           };
      
      if(event.keyCode == 40){
          o1.d--;
          
      }
      if(event.keyCode == 37){
          turn(o1, -15);
      }
      if(event.keyCode == 39){
          turn(o1, 15);       
      }
  }
  console.log("moveShape", event.keyCode);
}
 function collisionTestArray(o,a){
   for(var i=0; i<a.length; i++){
      if(o !=a[i]){
       collision(o,a[i]);
      }
   }
 }

 function collisionRemove(o1, o2){
  var differencex = Math.abs(o1.x-o2.x);
  var differencey = Math.abs(o1.y-o2.y);
  var hdif = Math.sqrt(differencex*differencex+differencey*differencey);
  var index = 0;
  if (hdif<o1.r+o2.r){
      index =  allCircles.indexOf(o2);
      allCircles.splice(index,1);
  };
}

function collision(o1, o2){
  if(o1 && o2){
  var differencex = Math.abs(o1.x-o2.x);
  var differencey = Math.abs(o1.y-o2.y);
  var hdif = Math.sqrt(differencex*differencex+differencey*differencey);
  if (hdif<o1.r+o2.r){
    if (differencex < differencey){

         turn(o1,360-2*o1.angle);
         turn(o2,360-2*o2.angle);
    }else{
  
        turn (o1,180-2*o1.angle);
        turn (o2,180-2*o2.angle);
      }
  turn(o1, 180);
  turn(o2, 180);
  console.log ("collision");
  };
}
}

function creatData(num){
   for(var i=0; i<num; i++){
     allCircles.push({
        "x": rand(w),
        "changex": rand(10),
        "y": rand(h),
        "changey": rand(10),
        "r": 15,
        "w": 100,
        "h": 100,
        "c": rand(70),
        "a": 0.5,
        "d": 5+rand(5),
        "angle": 0,
        "changle": 15
      })
   } 
}
function stop(){
  o1.changex = 0;
  o1.changey = 0;
  o2.changex = 0;
  o2.changey = 0;
}
function bounce(o){
  if(o.x > w || o.x < 0 ){
   turn(o,180-2*o.angle);
  };
  if(o.y > h || o.y < 0){
   turn(o,360-2*o.angle);
  }
}

function move(o){
  o.x+=o.changex;
  o.y+=o.changey;
}

function rectangle(o){
  var x = o.x;
  var y = o.y;
  o.x -=o.w/2;
  o.y -=o.h/2;

  ctx.beginPath();
  ctx.rect(o.x,o.y,o.w,o.h);
  ctx.fillStyle = "hsla("+o.c+",100%,50%, "+o.a+")";
  ctx.fill();

  o.x = x;
  o.y = y;
}

function clear(){
  ctx.clearRect(0,0,w,h)
}

function turn(o,angle){
  if(angle != undefined){
      o.changle = angle;
  };
  o.angle += o.changle;
}
function forward(o,d){
  var changeX;
  var changeY;
  var oneDegree = Math.PI/180;  
  if(d !=undefined){
      o.d = d;
  };
  changeX = o.d*Math.cos(o.angle*oneDegree);
  changeY = o.d*Math.sin(o.angle*oneDegree);
  o.x+=changeX;
  o.y+=changeY;
}

function rect(o){
  var x = o.x;
  var y = o.y;
  var a = o.angle;
  var d = o.d;

  turn(o,180);
  forward(o,o.w/2);
  turn(o,90);
  forward(o,o.h/2);
  turn(o,90);
  ctx.beginPath();
  ctx.moveTo(o.x,o.y);
  forward(o, o.w); 
  ctx.lineTo(o.x,o.y);
  turn(o, 45);
  forward(o, o.h);
  ctx.lineTo(o.x,o.y);
  turn(o, 90);
  forward(o, o.w);
  ctx.lineTo(o.x, o.y);
  turn(o, 90);
  forward(o, o.w);
  ctx.lineTo(o.x, o.y);
  turn(o,45);
  forward(o, o.h);
  ctx.lineTo(o.x,o.y);
  ctx.fillStyle = "hsla("+o.c+",100%,50%, "+o.a+")";
  ctx.fill();

  o.x = x;
  o.y = y;
  o.angle = a;
  o.d = d;

  
}


  


function circle(o){
  ctx.beginPath();
  ctx.arc(o.x,o.y,o.r,0, 2*Math.PI);
  ctx.fillStyle = "hsla("+o.c+",100%,50%, "+o.a+")";
  ctx.fill();
}

function randn(r){
  var result = Math.random()*r - r/2;
  return result
}

function randi(r){
  var result = Math.floor(Math.random()*r);
  return result
}

function rand(r){
 return Math.random()*r
}

function setUpCanvas(){
  canvas = document.querySelector("#myCanvas");
  ctx = canvas.getContext("2d");
  canvas.width = w;
  canvas.height = h;
  canvas.style.border = "5px solid orange";
}

console.log("m9: Interaction Design");