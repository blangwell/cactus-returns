let cactus = {
  spriteSheet: document.getElementById('sample-sprite'),
  sx: 0,
  sy: 3,
  sWidth: 16,
  sHeight: 18,
  dx: 50,
  dy: game.height - 100,
  dWidth: 64,
  dHeight: 72,
  startingX: 50,
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
  },
  jump() {
    jumpSound.play();
    if (!this.sliding && !this.jumping) {
      this.jumping = true;
      let jumpAnimation = setInterval(() => {
        if (this.dy > 150) this.dy -= this.velY;
        else clearInterval(jumpAnimation);
      }, 12);
    }
  },
  render() {
    ctx.drawImage(this.spriteSheet, this.currentFrame * this.sWidth, this.sy,
      this.sWidth, this.sHeight, this.dx, this.dy, this.dWidth, this.dHeight);

  },
  slide() {
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
        clearInterval(slideForward);
        cactus.sliding = false;
        // cactus.dy -= cactus.dHeight;
        [cactus.dHeight, cactus.dWidth] = [cactus.dWidth, cactus.dHeight];
      }, 500);
    }
  },
  update(spriteArray) {
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