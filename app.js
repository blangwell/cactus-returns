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
let cactus;
let dude;
let enemies = [new Character(game.width + 50, game.height - 50, 'red', 50, 50)];
let gameOver = true;
let keys = {};
let paused = false;

/* 
TODO: refactor movement/jump/rubberband functions to work with sprites
*/

cactus = {
  spriteSheet: document.getElementById('sample-sprite'),
  sx: 0,
  sy: 3,
  sWidth: 16,
  sHeight: 18,
  dx: 50,
  dy: game.height - 100,
  dWidth: 64,
  dHeight: 72,

  get startingX() {
    return this.dx;
  },
  stationary: true,
  jumping: false,
  sliding: false,
  velX: 5,
  velY: 10,
  maxX: game.width / 2,
  get column() {
    return this.currentFrame % this.sColumns;
  },
  currentFrame: 0,
  get frameHeight() {
    return this.sHeightl
  },
  get frameWidth() {
    return Math.floor(this.sWidth / this.sColumns);
  },
  row: 1,
  sColumns: 7,
  ticker: 0,

  idleSprite: [2, 3],
  jumpSprite: [4, 5, 6],
  get fullSprite() {
    return [...Array(this.sColumns).keys()];
  },
  render() {
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(this.spriteSheet, this.currentFrame * this.sWidth, this.sy,
      this.sWidth, this.sHeight, this.dx, this.dy, this.dWidth, this.dHeight);

  },
  update(spriteArray) {
    this.ticker++
    if (this.ticker % 5 === 0) {
      this.currentFrame = this.ticker / 5
    }
    ctx.drawImage(this.spriteSheet, this.currentFrame * this.sWidth, this.sy,
      this.sWidth, this.sHeight, this.dx, this.dy, this.dWidth, this.dHeight)

    if (this.ticker > spriteArray.length * 5) this.ticker = 0;

    if (this.currentFrame > spriteArray.length) {
      this.currentFrame = 0;
    }

  },
  detectDirection() {
    // check if keys is empty or if all values are false, idle animate
    if (
      Object.keys(keys).length === 0 ||
      Object.keys(keys).every(key => !keys[key])) {
      this.update(this.fullSprite);
    }
    if (keys.ArrowUp) {
      this.update(this.jumpSprite);
    }
  }
};

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
  this.gravRate = 8;
  this.jumping = false;
  this.sliding = false;
  this.stationary = true;
  this.render = function () {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
};

function menu() {
  ctx.fillStyle = 'white';
  ctx.font = "30px Arial";
  ctx.textAlign = 'center'
  ctx.fillText("Press Any Key to Start", game.width / 2, game.height / 2)
};

function pause() {
  ctx.fillStyle = 'black';
  ctx.strokeStyle = 'darkred'
  ctx.globalAlpha = 0.9;
  ctx.fillRect(0, 0, game.width, game.height);
  ctx.strokeRect(0, 0, game.width, game.height);
  ctx.globalAlpha = 1;
  ctx.fillStyle = 'rgb(255, 187, 0)';
  ctx.font = '75px Barbarian';
  ctx.textAlign = 'center';
  ctx.fillText("Paused)", game.width / 2, game.height / 2 + 20);
  ctx.strokeText("Paused)", game.width / 2, game.height / 2 + 20);
}

function detectCollision(obj) {
  if (
    cactus.dx + cactus.dWidth - 10 > obj.x &&
    cactus.dx + 10 < obj.x + obj.width &&
    cactus.dy + cactus.dHeight > obj.y &&
    cactus.dy < obj.y + obj.height
  ) {
    console.log('COLLISION')
  }

};

function jump() {
  if (!cactus.sliding && !cactus.jumping) {
    cactus.jumping = true;
    let jumpAnimation = setInterval(() => {
      if (cactus.dy > 150) cactus.dy -= cactus.velY;
      else clearInterval(jumpAnimation);
    }, 12)
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
      jump();
    }
  }
  if (keys.ArrowDown) {
    slide();
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
    cactus.dx -= 2;
  } else if (cactus.dx < cactus.startingX && cactus.stationary) {
    cactus.dx += 2;
  }
};

function slide() {
  if (!cactus.sliding && !cactus.jumping) {
    cactus.sliding = true;
    // cactus.dy += Math.min(cactus.dHeight / 2);
    [cactus.dWidth, cactus.dHeight] = [cactus.dHeight, cactus.dWidth];
    let slideDistance = cactus.dx + cactus.dWidth;

    let slideForward = setInterval(() => {
      if (cactus.dx <= slideDistance
        && cactus.dx <= cactus.maxX) {
        cactus.dx += 5;
        bgX -= 2; // speed up background scroll
      }
    }, 12);

    setTimeout(() => {
      clearInterval(slideForward)
      cactus.sliding = false;
      // cactus.dy -= cactus.dHeight;
      [cactus.dHeight, cactus.dWidth] = [cactus.dWidth, cactus.dHeight];
    }, 500);
  }
};

function spawnEnemies() {
  enemies.forEach(enemy => {
    enemy.render();
    detectCollision(enemy);
    enemy.x -= enemy.velX;
    if (enemy.x < 0 - enemy.width) {
      enemies.shift();
      enemies.push(new Character(game.width + enemy.width, game.height - cactus.dHeight * 1.7, 'red', 50, 50));
    }
  })
}

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
}

function gameLoop() {
  ctx.clearRect(0, 0, game.width, game.height);
  render();
  if (!paused) update();
  else pause();
  window.requestAnimationFrame(gameLoop);
};

document.addEventListener('DOMContentLoaded', function () {
  document.addEventListener('keydown', keydownHandler);
  document.addEventListener('keyup', keyupHandler);
  gameLoop();
});