const game = document.getElementById('game');
const ctx = game.getContext('2d');

let gameOver = true;

let cactus;

game.setAttribute('height', 400);
game.setAttribute('width', 500);
game.style.backgroundColor = 'darkred';

function Character(x, y, color, width, height) {
  this.x = x;
  this.y = y;
  this.color = color;
  this.width = width;
  this.height = height;
  this.velX = 5;
  this.velY = 1;
  this.maxX = game.width / 2;
  this.maxJump = this.y - 100;
  this.gravityRate = 10;
  this.jumping = false;
  this.sliding = false;
  this.draw = function() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height)
  }
  this.update = function() {
    // detect floor
    if (this.y + this.height >= game.height) {
      this.jumping = false;
    }
    // apply gravity if jumping
    if (this.jumping) this.y += this.gravityRate;
  }
};

function Platform(x, y, color, width, height) {
  this.x = x;
  this.y = y;
  this.color = color;
  this.width = width;
  this.height = height;
}

function menu() {

}

function detectCollision(obj) {

}

function gameLoop() {
  ctx.clearRect(0, 0, game.width, game.height);
  cactus.update();
  cactus.draw();
};

function keydownHandler(e) {
  switch(e.code) {
    case('ArrowUp'):
      cactus.jumping = true;
      while (cactus.y > cactus.maxJump) {
        cactus.y -= cactus.velY;
      }
      break
    case('ArrowRight'):
      if (cactus.x < cactus.maxX) {
        cactus.x += cactus.velX;
      }
      break
    case('ArrowDown'):
      if (cactus.sliding !== true && cactus.jumping === false) {
        cactus.sliding = true;
        cactus.y += cactus.height / 2;
        [cactus.width, cactus.height] = [cactus.height, cactus.width];
        setTimeout(() => {
          cactus.sliding = false;
          cactus.y -= cactus.height;
          [cactus.height, cactus.width] = [cactus.width, cactus.height];
        }, 500)
      }
      break
    case('ArrowLeft'):
    if (cactus.x > 0) {
      cactus.x -= cactus.velX;
    }
      break
  }
};

document.addEventListener('DOMContentLoaded', function() {
  cactus = new Character(50, game.height - 100, 'green', 50, 100);
  document.addEventListener('keydown', keydownHandler);
  setInterval(gameLoop, 60);
});