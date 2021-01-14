function startMenu() {
  ctx.fillStyle = 'black';
  ctx.strokeStyle = 'darkred';
  ctx.fillRect(0, 0, game.width, game.height);
  ctx.strokeRect(0, 0, game.width, game.height);
  ctx.fillStyle = 'rgb(255, 187, 0)';
  ctx.font = '45px Souls';
  ctx.textAlign = 'center';
  ctx.fillText("Press Return to Begin", game.width / 2, game.height / 2);
}

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