// @flow

const {makeEntity} = require('../entities/entities');

const makeButton = (position, doorID) => {
  return {
    ...makeEntity(),
    type: 'BUTTON',
    position,
    doorID,
    pressed: true,
  };
};

const renderButton = (ctx, game, button): void => {
  const {position} = button;
  ctx.save();
	ctx.translate(
    position.x,
    position.y,
  );

  const obj = getButtonSprite(game, button);
  if (obj == null || obj.img == null) {
    ctx.restore();
    return;
  }
  let yOffset = 0;
  if (button.pressed) {
    if (obj.y == 0) yOffset = 0.1;
    if (obj.y == obj.height) yOffset = 0.1;
    if (obj.y == obj.height * 2) yOffset = -0.1;
  }
  ctx.drawImage(
    obj.img,
    obj.x, obj.y, obj.width, obj.height,
    0, 0 + yOffset, 1, 1,
  );

  ctx.restore();
};

const getButtonSprite = (game: Game, button: Button): Object => {
  let width = 94.5;
  let height = button.pressed ? 88 : 94.3;
  let img = button.pressed
    ? game.sprites.PRESSED_BUTTON
    : game.sprites.BUTTON;

  const obj = {
    img,
    x: (button.doorID % 3) * width,
    y: Math.floor(button.doorID / 3) * height,
    width,
    height,
  };

  return obj;
};

module.exports = {
  make: makeButton,
  render: renderButton,
};
