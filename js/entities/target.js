// @flow

const {makeEntity} = require('../entities/entities');

const makeTarget = (position, isVisible) => {
  return {
    ...makeEntity(),
    type: 'TARGET',
    position,
    reached: 0,
    isVisible: isVisible || true,
  };
};

const renderTarget = (ctx, game, target): void => {
  const {position} = target;
  ctx.save();
	ctx.translate(
    position.x,
    position.y,
  );

  ctx.strokeStyle = 'black';
  ctx.fillStyle = 'gold';
  ctx.beginPath();
  const radius = 1 / 2;
  ctx.arc(
    1 / 2,
    1 / 2,
    radius, 0, Math.PI * 2,
  );
  ctx.closePath();
  ctx.stroke();
  ctx.fill();

  ctx.restore();

  // const obj = getTileSprite(game, target);
  // if (obj == null || obj.img == null) return;
  // ctx.drawImage(
  //   obj.img,
  //   obj.x, obj.y, obj.width, obj.height,
  //   target.position.x, target.position.y, target.width, target.height,
  // );
};


module.exports = {
  make: makeTarget,
  render: renderTarget,
};
