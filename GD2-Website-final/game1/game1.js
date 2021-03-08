var gc = new GameCanvas();

var stars = [];
var circles = [];
var lineStars = [];

for (var i = 0; i < 500; i++) {
  stars.push({x: Math.random() * width, y: Math.random() * height, radius: Math.random() * 2});
}

for (var i = 0; i < 100; i++) {
  lineStars.push({x: Math.random() * width, y: Math.random() * height, lx: 0, ly: 0});
}

for (var i = 0; i < 200; i++) {
  circles.push({x: Math.random() * width, y: Math.random() * height, radius: 300, color: "rgba(0, 255, 0, 0.01)"});
  circles.push({x: Math.random() * width, y: Math.random() * height, radius: 300, color: "rgba(0, 0, 255, 0.01)"});
  if (!(i % 3))
    circles.push({x: Math.random() * width, y: Math.random() * height, radius: 300, color: "rgba(200, 255, 0, 0.01)"});
}

var canvas2 = document.createElement("canvas");
canvas2.width = width;
canvas2.height = height;
var ctx2 = canvas2.getContext("2d");
ctx2.fillStyle = "rgb(20, 20, 20)";
ctx2.fillRect(0, 0, canvas2.width, canvas2.height);
ctx2.globalCompositeOperation = "lighter";
for (var i = 0; i < circles.length; i++) {
  var c = circles[i];
  ctx2.beginPath();
  ctx2.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
  ctx2.fillStyle = c.color;
  ctx2.fill();
}

var img = new Image();
img.src = canvas2.toDataURL();

var player = {x: 150, y: height / 2, bullets: [], isDead: false, score: 0};
var deathFade = 0;

var asteroids = [];

setInterval(function() {
  player.bullets.push(new Bullet(player.x + 60, player.y, 10, 0));
}, 150);

setInterval(function() {
  asteroids.push(new Asteroid(width + 100, Math.random() * height));
}, 1000);

function loop() {
  background("rgb(20, 20, 20)");
  
  gc.ctx.drawImage(img, 0, 0);
  
  for (var i = 0; i < stars.length; i++) {
    var s = stars[i];
    rect(s.x, s.y, s.radius * 1.5, s.radius * 1.5, "white");
    
    s.x -= s.radius / 2;
    
    if (s.x > width) s.x = 0;
    if (s.x < 0) s.x = width;
    if (s.y > height) s.y = 0;
    if (s.y < 0) s.y = height;
  }
  
  for (var i = 0; i < lineStars.length; i++) {
    var s = lineStars[i];
    s.x -= 25;
    
    line(s.x, s.y, s.lx, s.ly, "white", "white", {lineWidth: 0.5});
    
    if (s.x > width) s.x = 0;
    if (s.x < 0) s.x = width;
    if (s.y > height) s.y = 0;
    if (s.y < 0) s.y = height;
    
    s.lx = s.x;
    s.ly = s.y;
  }
  
  ellipse(player.x, player.y + 5, 50, 25, "gray");
  ellipse(player.x, player.y, 60, 20, "lightgray");
  ellipse(player.x, player.y, 30, 5, "rgba(50, 50, 255, 0.5)");
  beginShape();
  gc.ctx.arc(player.x, player.y, 30, Math.PI, Math.PI * 2);
  renderShape("rgba(50, 50, 255, 0.5)");
  
  for (var i = 0; i < player.bullets.length; i++) player.bullets[i].run();
  for (var i = 0; i < asteroids.length; i++) asteroids[i].run();
  
  if (getKey(38))
    player.y -= 10;
  if (getKey(40))
    player.y += 10;
  
  player.y = Math.min(height, Math.max(0, player.y));
  
  text("SCORE: " + player.score, width - 20, 50, 30, "white", {alignText: "right"});
  
  if (player.isDead) {
    background("rgba(0, 0, 0," + deathFade + ")");
    text("GAME OVER", width / 2, height / 2, width * 0.1, "white", {alignText: "center"});
    text("Score: " + player.score, width / 2, height / 2 + width * 0.1, width * 0.05, "white", {alignText: "center"});
    
    deathFade += 0.05;
  }
  else {
    player.score++; 
  }
}

function Bullet(x, y, vx, vy) {
  this.x = x;
  this.y = y;
  this.vx = vx;
  this.vy = vy;
  
  this.run = function() {
    this.x += this.vx;
    this.y += this.vy;
    
    circle(this.x, this.y, 4, "red", "yellow");
    
    if (this.x > width)
      player.bullets.splice(player.bullets.indexOf(this), 1);
    
    for (var i = 0; i < asteroids.length; i++) {
      var a = asteroids[i];
      if (getDistance(this.x, this.y, a.x, a.y) < a.radius) {
        a.health--;
        player.bullets.splice(player.bullets.indexOf(this), 1);
      }
    }
  }
}

function Asteroid(x, y) {
  this.x = x;
  this.y = y;
  this.radius = Math.random() * 40 + 30;
  this.health = 3;
  this.rotation = 0;
  
  this.points = [];
  
  for (var i = 0; i < Math.PI * 2; i += 0.5) {
    var x = Math.cos(i) * this.radius * (1.2 - Math.random() * 0.4);
    var y = Math.sin(i) * this.radius * (1.2 - Math.random() * 0.4);
    this.points.push({x, y});
  }
  
  this.run = function() {
    this.x -= 5;
    this.rotation += 0.01;
    
    gc.ctx.save();
    gc.ctx.translate(this.x, this.y);
    gc.ctx.rotate(this.rotation);
    beginShape();
    for (var i = 0; i < this.points.length; i++) {
      var p = this.points[i];
      lineTo(p.x, p.y);
    }
    closeShape();
    renderShape("rgb(120,92,92)", "black");
    gc.ctx.restore();
    
    if (this.health <= 0) {
      asteroids.splice(asteroids.indexOf(this), 1);
    }
    
    if (this.x < 0) {
      player.isDead = true;
    }
  }
}

function random_normal() {
    var u = 0, v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
}