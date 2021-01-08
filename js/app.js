const game = document.getElementById('game-layer');
const bgLayer = document.getElementById('bg-layer');
const ctx = game.getContext('2d');
const bgCtx = bgLayer.getContext('2d');
const sampleSprite = document.getElementById('sample-sprite');

game.setAttribute('height', 400);
game.setAttribute('width', 500);
bgLayer.setAttribute('height', 400);
bgLayer.setAttribute('width', 500);

let bgImage = new Image();
bgImage.src = './assets/darkfantasyBg.jpg';
let bgX = 0;
let dude;
let enemies = [new Enemy(game.width + 50, game.height - 50, 'red', 50, 50)];
let gameOver = true;
let keys = {};
let paused = false;

// TODO audit Character properties
function Enemy(x, y, color, width, height) {
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
  this.gravRate = 8;
  this.jumping = false;
  this.sliding = false;
  this.stationary = true;
  this.render = function () {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
};

function detectCollision(obj) {
  if (
    cactus.dx + cactus.dWidth - 10 > obj.x &&
    cactus.dx + 10 < obj.x + obj.width &&
    cactus.dy + cactus.dHeight > obj.y &&
    cactus.dy < obj.y + obj.height
  ) {
    console.log('COLLISION');
  }
};

function menu() {
  ctx.fillStyle = 'white';
  ctx.font = "30px Arial";
  ctx.textAlign = 'center';
  ctx.fillText("Press Any Key to Start", game.width / 2, game.height / 2);
};

function keydownHandler(e) {
  // e.preventDefault();
  keys[e.code] = true;
  if (keys.KeyP) {
    if (paused) {
      paused = false;
      pause();
    }
    else paused = true;
  }
};

function keyupHandler(e) {
  keys[e.code] = false;
};

function movementHandler() {
  if (!cactus.jumping
    && !cactus.sliding
    && !keys.ArrowLeft
    && !keys.ArrowRight) {
    cactus.stationary = true;
  } else {
    cactus.stationary = false;
  }

  if (keys.ArrowUp) {
    if (!cactus.jumping && !cactus.sliding) {
      cactus.jump();
    }
  }
  if (keys.ArrowDown) {
    cactus.slide();
  }
  if (keys.ArrowRight) {
    bgX -= 2; // speed up bg scroll
    if (cactus.dx <= cactus.maxX) {
      cactus.dx += cactus.velX;
    }
  }
  if (keys.ArrowLeft) {
    bgX += 1; // slow the bg scroll
    if (cactus.dx > 0) {
      cactus.dx -= cactus.velX;
    }
  }
  // detect floor and apply gravity if jumping
  if (cactus.dy + cactus.dHeight > game.height) cactus.jumping = false;
  else cactus.dy += 5;
};

function pause() {
  cactus.update([cactus.currentFrame]);
  ctx.fillStyle = 'black';
  ctx.strokeStyle = 'darkred';
  ctx.globalAlpha = 0.9;
  ctx.fillRect(0, 0, game.width, game.height);
  ctx.strokeRect(0, 0, game.width, game.height);
  ctx.globalAlpha = 1;
  ctx.fillStyle = 'rgb(255, 187, 0)';
  ctx.font = '75px Barbarian';
  ctx.textAlign = 'center';
  ctx.fillText("Paused)", game.width / 2, game.height / 2 + 20);
  ctx.strokeText("Paused)", game.width / 2, game.height / 2 + 20);
};

function rubberband() {
  if (cactus.dx > cactus.startingX && cactus.stationary) {
    cactus.dx -= 1;
  } else if (cactus.dx < cactus.startingX && cactus.stationary) {
    cactus.dx += 1;
  }
};

function spawnEnemies() {
  let randomX = Math.floor(Math.random() * 200)
  enemies.forEach(enemy => {
    enemy.render();
    detectCollision(enemy);
    enemy.x -= enemy.velX;
    if (enemy.x < 0 - enemy.width) {
      enemies.shift(); // remove once offscreen
      enemies.push(new Enemy(game.width + enemy.width, game.height - cactus.dHeight * 1.7, 'red', 50, 50));
    }
    /* randomly generate enemies
    there should be a space as wide as cactus.dx
    between each enemy 
    */
    

  });
};

function update() {
  movementHandler();
  rubberband();
  if (!paused) {
    bgX -= 4; // scroll background
    if (enemies) {
      spawnEnemies();
    }
  }
  if (bgX < -game.width) bgX = 0;
};

function render() {
  // background
  bgCtx.drawImage(bgImage, bgX, 0, game.width, game.height);
  bgCtx.drawImage(bgImage, bgX + game.width, 0, game.width, game.height);
  cactus.render();
  cactus.detectDirection();
};

function gameLoop() {
  ctx.clearRect(0, 0, game.width, game.height);
  render();
  if (!paused) update();
  else pause();
  window.requestAnimationFrame(gameLoop);
};

document.addEventListener('DOMContentLoaded', function () {
  ctx.imageSmoothingEnabled = false;
  document.addEventListener('keydown', keydownHandler);
  document.addEventListener('keyup', keyupHandler);
  gameLoop();
});