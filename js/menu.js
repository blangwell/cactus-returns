
let counter = 0;
function startMenu() {
  if (counter > 120) counter = 0;
  counter++;
  ctx.fillStyle = 'black';
  ctx.strokeStyle = 'darkred';
  ctx.fillRect(0, 0, game.width, game.height);
  ctx.strokeRect(0, 0, game.width, game.height);
  ctx.fillStyle = 'rgb(255, 187, 0)';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'darkred';
  ctx.font = '30px Souls';
  ctx.fillText("Move with the Arrow Keys", game.width / 2, game.height / 2 - 90);
  ctx.fillText("Press P to Pause", game.width / 2, game.height / 2 - 35 );
  ctx.font = '40px Souls';
  ctx.fillText("Spare Thine Enemies", game.width / 2, game.height / 2 + 30);
  ctx.font = '45px Souls';
  if (counter < 75) {
    ctx.fillText("Press Return to Begin", game.width / 2, game.height / 2 + 100);
  }
}

function pause() {
  cactus.update([cactus.currentFrame]);
  ctx.fillStyle = 'black';
  ctx.strokeStyle = 'darkred';
  ctx.globalAlpha = 0.9;
  ctx.fillRect(0, 0, game.width, game.height);
  ctx.strokeRect(0, 0, game.width, game.height);
  ctx.globalAlpha = 1;
  ctx.fillStyle = 'darkred';
  ctx.strokeStyle = 'black';
  ctx.font = '100px BarbarianNS';
  ctx.textAlign = 'center';
  ctx.fillText("Paused)", game.width / 2 + 10, game.height / 2 + 50);
  ctx.strokeText("Paused)", game.width / 2 + 10, game.height / 2 + 50);
};