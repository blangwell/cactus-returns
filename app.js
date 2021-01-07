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
  this.render = function() {
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
    dude.dx + dude.dWidth - 10 > obj.x  &&
    dude.dx + 10 < obj.x + obj.width &&
    dude.dy + dude.dHeight > obj.y &&
    dude.dy < obj.y + obj.height
    ) 
    {
      console.log('COLLISION')
    }

};

function jump() {
  // if (!cactus.sliding && !cactus.jumping) {
  //   cactus.jumping = true;
  //   let jumpAnimation = setInterval(() => {
  //     if (cactus.y > cactus.maxJump) cactus.y -= cactus.velY;
  //     else clearInterval(jumpAnimation);
  //   }, 12)
  // }
  if (!dude.sliding && !dude.jumping) {
    dude.jumping = true;
    let jumpAnimation = setInterval(() => {
      if (dude.dy > dude.maxJump) dude.dy -= dude.velY;
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
  if (!dude.jumping
    && !dude.sliding
    && !keys.ArrowLeft
    && !keys.ArrowRight) {
    dude.stationary = true;
  } else {
    dude.stationary = false;
  }

  if (keys.ArrowUp) {
    if (!dude.jumping && !dude.sliding) {
      jump();
    }
  }
  if (keys.ArrowDown) {
    slide();
  }
  if (keys.ArrowRight) {
    bgX -= 2; // speed up bg scroll
    if (dude.dx <= dude.maxX) {
      dude.dx += dude.velX;
    }
  }
  if (keys.ArrowLeft) {
    bgX += 1; // slow the bg scroll
    if (dude.dx > 0) {
      dude.dx -= dude.velX;
    }
  }
  // detect floor and apply gravity if jumping
  if (dude.dy + dude.dHeight > game.height) dude.jumping = false;
  else dude.dy += 5;
};

function rubberband() {
  // if (cactus.x > cactus.startingX && cactus.stationary) {
  //   cactus.x -= 2;
  // } else if (cactus.x < cactus.startingX && cactus.stationary) {
  //   cactus.x += 2;
  // }
  if (dude.dx > dude.startingX && dude.stationary) {
    dude.dx -= 2;
  } else if (dude.dx < dude.startingX && dude.stationary) {
    dude.dx += 2;
  }
};

function slide() {
  if (!dude.sliding && !dude.jumping) {
    dude.sliding = true;
    // dude.dy += Math.min(dude.dHeight / 2);
    [dude.dWidth, dude.dHeight] = [dude.dHeight, dude.dWidth];
    let slideDistance = dude.dx + dude.dWidth;
    
    let slideForward = setInterval(() => {
      if (dude.dx <= slideDistance
        && dude.dx <= dude.maxX) {
        dude.dx += 5;
        bgX -= 2; // speed up background scroll
      }
    }, 12);
    
    setTimeout(() => {
      clearInterval(slideForward)
      dude.sliding = false;
      dude.dy -= dude.dHeight;
      [dude.dHeight, dude.dWidth] = [dude.dWidth, dude.dHeight];
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
      enemies.push(new Character(game.width + enemy.width, game.height - dude.dHeight * 1.7, 'red', 50, 50));
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

function Sprite(spriteSheet, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) {
  this.spriteSheet = spriteSheet;
  this.sx = sx;
  this.sy = sy;
  this.sWidth = sWidth;
  this.sHeight = sHeight;
  this.dx = dx;
  this.dy = dy;
  this.dWidth = dWidth;
  this.dHeight = dHeight;

  this.startingX = dx;
  this.stationary = true;
  this.jumping = false;
  this.sliding = false;
  this.maxJump = this.dy - 150;
  this.velX = 5;
  this.velY = 10;
  this.maxX = game.width / 2;
  
  this.column = this.currentFrame % this.sColumns;
  this.currentFrame = 0;
  this.frameHeight = this.sHeight;
  this.frameWidth = Math.floor(this.sWidth / this.sColumns);
  this.row = 1;
  this.sColumns = 7;
  this.ticker = 0;

  this.idleSprite = [2, 3];
  this.fullSprite = [...Array(this.sColumns).keys()]
  this.jumpSprite = [4, 5, 6]

  this.render = function() {
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(this.spriteSheet, this.currentFrame * this.sWidth, this.sy, 
      this.sWidth, this.sHeight, this.dx, this.dy, this.dWidth, this.dHeight)

  }
  this.update = function(spriteArray) {
    this.ticker++ 
    if (this.ticker % 5 === 0) { 
      this.currentFrame = this.ticker / 5
    }
    ctx.drawImage(this.spriteSheet, this.currentFrame * this.sWidth, this.sy, 
      this.sWidth, this.sHeight, this.dx, this.dy, this.dWidth, this.dHeight)

    if (this.ticker > spriteArray.length * 5) this.ticker = 0;

    if (this.currentFrame > spriteArray.length ) {
      this.currentFrame = 0;
    }

  }
  this.detectDirection = function() {
    // check if keys is empty or if all values are false, idle animate
    if (
      Object.keys(keys).length === 0 ||
      Object.keys(keys).every(key => !keys[key])) {
        console.log('No keys pressed');
        this.update(this.fullSprite);
    } 
    if (keys.ArrowUp) {
      this.update(this.jumpSprite)
    }
  }

}

function render() {
  // background
  bgCtx.drawImage(bgImage, bgX, 0, game.width, game.height);
  bgCtx.drawImage(bgImage, bgX + game.width, 0, game.width, game.height);
  // cactus.render();

  dude.render();
  dude.detectDirection();
}

function gameLoop() {
  ctx.clearRect(0, 0, game.width, game.height);
  render();
  if (!paused) update();
  else pause();
  window.requestAnimationFrame(gameLoop);
};


document.addEventListener('DOMContentLoaded', function () {
  cactus = new Character(50, game.height - 100, 'green', 50, 100);
  dude = new Sprite(sampleSprite, 0, 3, 16, 18, 50, game.height - 100, 64, 72);
  document.addEventListener('keydown', keydownHandler);
  document.addEventListener('keyup', keyupHandler);
  gameLoop();
});