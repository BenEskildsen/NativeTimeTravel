// @flow

const {Entities} = require('../entities/registry');
const {
  getFloorSprite,
} = require('./sprites');

let cur = null;
let prevTime = 0;
let msAvg = 0;
const weightRatio = 0.1;
const render = (game: Game, canvas): void => {
  renderFrame(game, canvas);
  // window.requestAnimationFrame((timestamp) => {
  //   const curTime = new Date().getTime();
  //   // don't call renderFrame multiple times on the same timestamp
  //   if (timestamp == cur) {
  //     return;
  //   }
  //   cur = timestamp;
  //   if (prevTime > 0) {
  //     msAvg = msAvg * (1 - weightRatio) + (curTime - prevTime) * weightRatio;
  //   }
  //   // console.log(1 / (msAvg / 1000));
  //   renderFrame(game, canvas);
  //   prevTime = curTime;
  // });
}

const renderFrame = (game, canvas): void => {
  // const canvas = document.getElementById('canvas');
  if (!canvas) return; // don't break
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  console.log("render");

  const dims = {
    pxWidth: Math.min(canvas.width, canvas.height),
    pxHeight: Math.min(canvas.width, canvas.height),
    viewWidth: game.gridWidth,
    viewHeight: game.gridHeight,
    viewPos: {x:0, y: 0},
  };

  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, dims.pxWidth, dims.pxHeight);

  renderView(canvas, ctx, game, dims);
};

const renderView = (canvas, ctx, game, dims): void => {
  const {pxWidth, pxHeight, viewWidth, viewHeight, viewPos} = dims;

	const px = viewWidth / pxWidth;
  const pxy = viewHeight / pxHeight;

  ////////////////////////////////////////////
  // canvas scaling
  ////////////////////////////////////////////
  // scale world to the canvas
  ctx.save();
  ctx.scale(
    pxWidth / viewWidth,
    pxHeight / viewHeight,
  );
  // console.log(pxWidth, pxHeight, px, pxy);
  ctx.lineWidth = px;
  // translate to viewPos
  ctx.translate(-1 * viewPos.x, -1 * viewPos.y);
  ////////////////////////////////////////////
  // render floor
  const floorObj = getFloorSprite(game);
  const floorWidth = 3;
  const floorHeight = 2;
  for (let x = 0; x < game.gridWidth; x += floorWidth) {
    for (let y = 0; y < game.gridHeight; y += floorHeight) {
      let width = x + floorWidth - game.gridWidth - 1;
      if (width < 0) width = floorWidth
      let height = y + floorHeight - game.gridHeight - 1;
      if (height < 0) height = floorHeight
      if (!floorObj.img) continue;
      ctx.drawImage(
        floorObj.img,
        floorObj.x, floorObj.y, floorObj.width, floorObj.height,
        x, y,
        floorWidth, floorHeight,
        // width, height,
      );
    }
  }

  // render grid
  for (let x = 0; x < game.gridWidth; x += 1) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, game.gridHeight);
    ctx.stroke();
  }
  for (let y = 1; y < game.gridWidth; y += 1) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(game.gridWidth, y);
    ctx.stroke();
  }

  // render entities
  for (const entityType in Entities) {
    const renderFn = Entities[entityType].render;
    for (const id in game[entityType]) {
      const entity = game[entityType][id];
      renderFn(ctx, game, entity);
    }
  }

  // render selected position
  if (game.selectedPosition != null) {
    ctx.save();
    ctx.fillStyle = 'steelblue';
    ctx.globalAlpha = 0.5;
    ctx.fillRect(game.selectedPosition.x, game.selectedPosition.y, 1, 1);
    ctx.restore();
  }

  ctx.restore();
};

module.exports = {render};
