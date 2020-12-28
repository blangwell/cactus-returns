const game = document.getElementById('game');
const ctx = game.getContext('2d');

let cactus;
let gameOver = true;

let keys = {
  ArrowUp: false,
  ArrowRight: false,
  ArrowDown: false,
  ArrowLeft: false
};

game.setAttribute('height', 400);
game.setAttribute('width', 500);
game.style.backgroundColor = 'darkred';

// TODO audit Character properties
function Character(x, y, color, width, height) {
  this.x = x;
  this.y = y;
  this.color = color;
  this.width = width;
  this.height = height;
  this.velX = 5;
  this.velY = 10;
  this.maxX = game.width / 2;
  this.startingX = x;
  this.maxJump = this.y - 150;
  this.gravityRate = 4;
  this.jumping = false;
  this.sliding = false;
  this.draw = function() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height)
  }
};

function menu() {

};

function detectCollision(obj) {
  
};

function jump() {
  // adding the check for !cactus.jumping prevents stutter jump
  if (!cactus.sliding && !cactus.jumping) {
    cactus.jumping = true;
    let jumpAnimation = setInterval(() => {
      if (cactus.y > cactus.maxJump) cactus.y -= cactus.velY;
      else clearInterval(jumpAnimation);
    }, 12)
  }
};

function slide() {
  if (!cactus.sliding && !cactus.jumping) {
    cactus.sliding = true;
    cactus.y += Math.min(cactus.height / 2);
    [cactus.width, cactus.height] = [cactus.height, cactus.width];
    let slideDistance = cactus.x + cactus.width;
    let slideForward = setInterval(() => {
      if (cactus.x <= slideDistance 
        && cactus.x <= cactus.maxX) {
          cactus.x += 5;
        } 
    }, 12);

    setTimeout(() => {
      clearInterval(slideForward)
      cactus.sliding = false;
      cactus.y -= cactus.height;
      [cactus.height, cactus.width] = [cactus.width, cactus.height];
    }, 500);
  } 
};

function update() {
  // movement logic based on keys object
  if (keys.ArrowUp) {
    if (!cactus.jumping && !cactus.sliding) {
      jump();
    } 
  }
  if (keys.ArrowDown) {
    slide(); 
  } 
  if (keys.ArrowRight) {
    // TODO if moving right, speed up the scroll of background/enemies
    if (cactus.x < cactus.maxX) {
      cactus.x += cactus.velX;
    }
  }
  if (keys.ArrowLeft) {
    // TODO if moving left, slightly slow the scroll
    if (cactus.x > 0) {
      cactus.x -= cactus.velX;
    }
  }
  // detect floor
  if (cactus.y + cactus.height >= game.height) cactus.jumping = false;
  // apply gravity if jumping
  if (cactus.jumping) cactus.y += cactus.gravityRate;
  
  // rubberbanding back to start position
  if (cactus.x > cactus.startingX && !cactus.jumping) {
    cactus.x -= 1;
  }
};

function keydownHandler(e) {
  keys[e.code] = true;
};

function keyupHandler(e) {
  keys[e.code] = false;
};

function gameLoop() {
  ctx.clearRect(0, 0, game.width, game.height);
  update();
  cactus.draw();
  window.requestAnimationFrame(gameLoop);
};

document.addEventListener('DOMContentLoaded', function() {
  cactus = new Character(50, game.height - 100, 'green', 50, 100);
  document.addEventListener('keydown', keydownHandler);
  document.addEventListener('keyup', keyupHandler);
  gameLoop(); 
});