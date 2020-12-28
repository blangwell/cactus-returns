const game = document.getElementById('game');
const ctx = game.getContext('2d');

game.setAttribute('height', 400);
game.setAttribute('width', 500);

let bgImage = new Image();
bgImage.src = './assets/darkfantasyBg.jpg'
let bgX = 0;

let cactus;
let gameOver = true;
let keys = {};
let paused = false;

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
    if (cactus.x < cactus.maxX) {
      cactus.x += cactus.velX;
      bgX -= 2; // speed up bg scroll
    }
  }
  if (keys.ArrowLeft) {
    if (cactus.x > 0) {
      cactus.x -= cactus.velX;
      bgX += 1; // slow the bg scroll
    }
  }
  // detect floor
  if (cactus.y + cactus.height >= game.height) cactus.jumping = false;
  // apply gravity if jumping
  if (cactus.jumping) cactus.y += cactus.gravRate;
}

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

function update() {
  movementHandler();
  rubberband();
  if (!paused) bgX -= 4;
  if (bgX < -game.width) bgX = 0;
};

function render() {
  // background
  ctx.drawImage(bgImage, bgX, 0, game.width, game.height);
  ctx.drawImage(bgImage, bgX + game.width, 0, game.width, game.height);
  // cactus
  ctx.fillStyle = cactus.color;
  ctx.fillRect(cactus.x, cactus.y, cactus.width, cactus.height)
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
  document.addEventListener('keydown', keydownHandler);
  document.addEventListener('keyup', keyupHandler);
  gameLoop();
});