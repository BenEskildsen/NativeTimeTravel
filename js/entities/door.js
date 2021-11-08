// @flow

const {config} = require('../config');
const {subtract} = require('../utils/vectors');
const Wall = require('../entities/wall');

const makeDoor = (start, end, doorID, isVisible) => {
  return {
    ...Wall.make(start, end, isVisible),
    type: 'DOOR',
    doorID,
    open: true,
  };
};

const renderDoor = (ctx, game, door): void => {
  Wall.renderWallLike(ctx, game, door, getDoorSprite);

  const {start, end, orientation, open} = door;
  const offAxisSize = 1 / 3;

  ctx.save();
  ctx.translate(start.x, start.y);
  ctx.fillStyle = config.buttonColors[door.doorID];
  ctx.globalAlpha = open ? 0.2 : 0.7;
  ctx.fillRect(
    orientation == 'horizontal' ? 0 : -1 * offAxisSize / 2,
    orientation == 'vertical' ? 0 : -1 * offAxisSize / 2,
    subtract(end, start).x || offAxisSize,
    subtract(end, start).y || offAxisSize,
  );
  ctx.restore();
};

const getDoorSprite = (game: Game, door: Door): Object => {
  let width = 97.5;
  let height = 97.5;
  const img = game.sprites.GATE;
  const obj = {
    img,
    x: 0,
    y: height,
    width,
    height: door.open ? 10 : height,
  };

  return obj;
};

module.exports = {
  make: makeDoor,
  render: renderDoor,
};
