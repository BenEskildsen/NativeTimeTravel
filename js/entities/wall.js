// @flow

const {makeEntity} = require('../entities/entities');
const {add, subtract} = require('../utils/vectors');

const makeWall = (start, end, isVisible) => {
  const orientation = start.y == end.y ? 'horizontal' : 'vertical';
  return {
    ...makeEntity(),
    type: 'WALL',
    start,
    end,
    orientation,
    isVisible: isVisible || true,
  };
};

const renderWall = (ctx, game, wall): void => {
  renderWallLike(ctx, game, wall, getWallSprite);
}

const renderWallLike = (ctx, game, wall, getSpriteFn): void => {
  const {start, end, orientation, isVisible} = wall;
  if (!isVisible) return;

  ctx.save();
  ctx.translate(start.x, start.y);

  const obj = getSpriteFn(game, wall);
  if (obj == null || obj.img == null) {
    ctx.restore();
    return;
  }

  const offAxisSize = 1/3;
  ctx.drawImage(
    obj.img,
    obj.x, obj.y, obj.width, obj.height,
    orientation == 'horizontal' ? 0 : -1 * offAxisSize / 2,
    orientation == 'vertical' ? 0 : -1 * offAxisSize / 2,
    subtract(end, start).x || offAxisSize,
    subtract(end, start).y || offAxisSize,
  );

  ctx.restore();
};

const getWallSprite = (game, wall) => {
  const tileSize = 16; // 47.25;
  const {orientation} = wall;
  const obj = {
    img: game.sprites.WALL,
    x: orientation == 'vertical' ? 3 * tileSize : 0,
    y: orientation == 'horizontal' ? 3 * tileSize : 0,
    width: orientation == 'horizontal' ? 3 * tileSize : tileSize,
    height: orientation == 'vertical' ? 3 * tileSize : tileSize,
  };

  return obj;
};

module.exports = {
  make: makeWall,
  render: renderWall,
  renderWallLike,
};
