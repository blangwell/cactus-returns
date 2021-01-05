const game = document.getElementById('game-layer');
const bgLayer = document.getElementById('bg-layer');
const ctx = game.getContext('2d');
const bgCtx = bgLayer.getContext('2d');

game.setAttribute('height', 400);
game.setAttribute('width', 500);
bgLayer.setAttribute('height', 400);
bgLayer.setAttribute('width', 500);

// SPRITE STUFF

let enemies = [new Character(game.width + 50, game.height - 50, 'red', 50, 50)];

let bgImage = new Image();
bgImage.src = './assets/darkfantasyBg.jpg';
let bgX = 0;


let cactus;
let gameOver = true;
let keys = {};
let paused = false;

let canJump = true;

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
    cactus.x + cactus.width - 10 > obj.x  &&
    cactus.x + 10 < obj.x + obj.width &&
    cactus.y + cactus.height > obj.y &&
    cactus.y < obj.y + obj.height
    ) {
      console.log('COLLISION')
    }

};

function jump() {
  if (!cactus.sliding && !cactus.jumping) {
    cactus.jumping = true;
    let jumpAnimation = setInterval(() => {
      if (cactus.y > cactus.maxJump) cactus.y -= cactus.velY;
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
    if (cactus.x <= cactus.maxX) {
      cactus.x += cactus.velX;
    }
  }
  if (keys.ArrowLeft) {
    bgX += 1; // slow the bg scroll
    if (cactus.x > 0) {
      cactus.x -= cactus.velX;
    }
  }
  // detect floor and apply gravity if jumping
  if (cactus.y + cactus.height > game.height) cactus.jumping = false;
  else cactus.y += cactus.gravRate;
};

function rubberband() {
  if (cactus.x > cactus.startingX && cactus.stationary) {
    cactus.x -= 2;
  } else if (cactus.x < cactus.startingX && cactus.stationary) {
    cactus.x += 2;
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
        bgX -= 2; // speed up background scroll
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

// scroll should be its own function determined by global var

function spawnEnemies() {
  enemies.forEach(enemy => {
    enemy.render();
    detectCollision(enemy);
    enemy.x -= enemy.velX;
    if (enemy.x < 0 - enemy.width) {
      enemies.shift();
      console.log('ENEMY REMOVED')
      enemies.push(new Character(game.width + enemy.width, game.height - cactus.height, 'red', 50, 50));
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

let sampleSprite = document.getElementById("sample-sprite");
const spriteColumns = 8;
let fps = 60
let frameWidth = sampleSprite.width / spriteColumns;
console.log(sampleSprite.src)
let frameHeight = sampleSprite.height;
let currentFrame = 0;
let ticker = 0;

function render() {
  let column = currentFrame % spriteColumns;
  let row = Math.floor(currentFrame/ spriteColumns);
  ctx.imageSmoothingEnabled = false;
  ticker++

  if (ticker % 20 === 0) {
    currentFrame = ticker / 20
  }
  if (ticker > spriteColumns * 20) ticker = 0;
  
  ctx.drawImage(sampleSprite, column * frameWidth, row * frameHeight, frameWidth, frameHeight, 100, 100, 32, 32)

  let maxFrame = spriteColumns - 1;
  if (currentFrame > maxFrame ) {
    currentFrame = 0;
  }
  


  // background
  bgCtx.drawImage(bgImage, bgX, 0, game.width, game.height);
  bgCtx.drawImage(bgImage, bgX + game.width, 0, game.width, game.height);
  cactus.render();

  ctx.drawImage(sampleSprite, 0, 3, 16, 18, 50, 50, 64, 72)
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
  // enemies.push(new Character(game.width + 50, game.height - 50, 'red', 50, 50));
  document.addEventListener('keydown', keydownHandler);
  document.addEventListener('keyup', keyupHandler);
  gameLoop();
});