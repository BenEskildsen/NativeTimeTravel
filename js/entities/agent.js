// @flow

const {makeEntity} = require('../entities/entities');
const {getFrame} = require('../render/sprites');

const makeAgent = (history, isPlayerAgent) => {
  return {
    ...makeEntity(),
    type: 'AGENT',
    facing: 'left',
    history: history || [],
    isPlayerAgent: isPlayerAgent || false,
  };
};

const renderAgent = (ctx, game, agent) => {
  const canvas = document.getElementById('canvasWrapper');
  console.log("wrapper", canvas);

	// render relative to top left of grid square,
  let position = agent.history[game.time];

  if (!position) {
    if (agent.isPlayerAgent) {
      position = agent.history[0];
    }
    const curAction = agent.actionQueue[0];
    if (curAction && curAction.type == 'GO_BACK_IN_TIME') {
      position = agent.history[agent.history.length - 1];
    }

    if (position == null) return;
  }

	ctx.save();

	ctx.translate(
    position.x, //  + agent.width / 2,
    position.y, //  + agent.height / 2,
  );
  // ctx.translate(-agent.width / 2, -agent.height / 2);

  // render the specific agent here:
  spriteRenderFn(ctx, game, agent);

  ctx.restore();
};

const spriteRenderFn = (ctx, game, agent) => {
  const img = game.sprites.CHARACTER;
  if (!img) return;
  ctx.save();
  // if (game.controlledEntity == null || game.controlledEntity.id != agent.id) {
  //   ctx.globalAlpha = 0.5;
  // }
  const obj = {
    x: 0,
    y: 0,
    width: 90,
    height: 90,
  };

  let key = agent.facing;
  const curAction = agent.actionQueue[0];
  if (curAction) {
    const animation = curAction.animation;
    switch (curAction.type) {
      case 'MOVE': {
        key = curAction.payload.key;
        const position = agent.history[game.time];
        const translate = {x: 0, y: 0};
        const dir = curAction.payload.dir;
        if (dir.x) {
          const interp = 1 - animation.tick / animation.duration;
          if (dir.x < 0) {
            translate.x = dir.x * interp + 1;
          } else if (dir.x > 0) {
            translate.x = dir.x * interp - 1;
          }
        }
        if (dir.y) {
          const interp = 1 - animation.tick / animation.duration;
          if (dir.y < 0) {
            translate.y = dir.y * interp + 1;
          } else if (dir.y > 0) {
            translate.y = dir.y * interp - 1;
          }
        }
        ctx.translate(translate.x, translate.y);
        break;
      }
      case 'GO_BACK_IN_TIME': {
        const interp = 1 - animation.tick / animation.duration;
        key = ['left', 'up', 'right', 'down'][Math.max(0, Math.round(interp * 4 - 1))];
        if (!agent.isPlayerAgent) {
          ctx.globalAlpha = game.isTimeReversed ? interp : 1 - interp;
        }
        break;
      }
    }
  }
  const tr = game.isTimeReversed || game.prevTime > game.time;
  if ((key == 'left' && !tr) || (tr && key == 'right')) {
    obj.y = 0;
  } else if ((key == 'right' && !tr) || (tr && key == 'left')) {
    obj.y = obj.height * 1;
  } else if ((key == 'down' && !tr) || (tr && key == 'up')) {
    obj.y = obj.height * 2;
  } else if ((key == 'up' && !tr) || (tr && key == 'down')) {
    obj.y = obj.height * 3;
  }

  const frame = getFrame(game, agent);
  obj.x = frame * obj.width;
  // if (dir == 'left' || dir == 'right') {
  //   obj.x *= 2;
  // }

  ctx.drawImage(
    img,
    obj.x, obj.y, obj.width, obj.height,
    0, 0, 1, 1,
  );
  ctx.restore();
}

module.exports = {
  make: makeAgent,
  render: renderAgent,
};
