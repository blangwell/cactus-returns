const game = document.getElementById('game-layer');
const bgLayer = document.getElementById('bg-layer');
const menuLayer = document.getElementById('menu-layer');
const ctx = game.getContext('2d');
const bgCtx = bgLayer.getContext('2d');
const menuCtx = menuLayer.getContext('2d');
const sampleSprite = document.getElementById('sample-sprite');
const demonSprite = document.getElementById('demon-sprite');

game.setAttribute('height', 400);
game.setAttribute('width', 500);
bgLayer.setAttribute('height', 400);
bgLayer.setAttribute('width', 500);
menuLayer.setAttribute('height', 400);
menuLayer.setAttribute('width', 500);

let bgImage = new Image();
bgImage.src = './assets/darkfantasyBg.jpg';
let bgX = 0;
let dude;
let enemies = [new EnemySprite(0, 0, 16, 17, game.width, 325, 64, 64)];
let gameOver = true;
let keys = {};
let paused = false;

function EnemySprite( sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) {
  this.spriteSheet = demonSprite;
  this.sx = sx;
  this.sy = sy;
  this.sWidth = sWidth;
  this.sHeight = sHeight;
  this.dx = dx;
  this.dy = dy;
  this.dWidth = dWidth;
  this.dHeight = dHeight;
  this.ticker = 0;
  this.currentFrame = 0;
  this.sColumns = 5;
  this.spriteArray = [...Array(this.sColumns).keys()];
  this.render = function () {
    this.update(this.spriteArray);
    ctx.drawImage(this.spriteSheet, this.currentFrame * this.sWidth, this.sy,
      this.sWidth, this.sHeight, this.dx, this.dy, this.dWidth, this.dHeight);
  };
  this.update = function(spriteArray) {
    this.ticker++
    if (this.ticker % 5 === 0) {
      this.currentFrame = this.ticker / 5;
    }
    ctx.drawImage(this.spriteSheet, this.currentFrame * this.sWidth, this.sy,
      this.sWidth, this.sHeight, this.dx, this.dy, this.dWidth, this.dHeight);

    if (this.ticker > spriteArray.length * 5) this.ticker = 0;

    if (this.currentFrame > spriteArray.length) {
      this.currentFrame = 0;
    }
  }
};

function detectCollision(obj) {
  if (
    cactus.dx + cactus.dWidth - 10 > obj.dx &&
    cactus.dx + 10 < obj.dx + obj.dWidth &&
    cactus.dy + cactus.dHeight > obj.dy &&
    cactus.dy < obj.dy + obj.dHeight
  ) {
    console.log('COLLISION');
  }
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
  if (gameOver) gameOver = false;
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
    enemy.x -= 5;
    enemy.dx -= 5;
    if (enemy.dx < 0 - enemy.dWidth) {
      enemies.shift(); // remove once offscreen
      enemies.push(new EnemySprite(0, 0, 16, 17, game.width, 325, 64, 64));
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
  if (gameOver) {
    startMenu();
  } else {
    ctx.clearRect(0, 0, game.width, game.height);
    render();
    if (!paused) update();
    else pause();
  }
  window.requestAnimationFrame(gameLoop);
};

document.addEventListener('DOMContentLoaded', function () {
  ctx.imageSmoothingEnabled = false;
  document.addEventListener('keydown', keydownHandler);
  document.addEventListener('keyup', keyupHandler);
  gameLoop();
});