// @flow

const {thetaToDir} = require('../utils/helpers');

//////////////////////////////////////////////////////////////////////
// Helpers
/////////////////////////////////////////////////////////////////////

const getFrame = (game, entity) => {
  const curAction = entity.actionQueue[0];

  const index = getInterpolatedFrameIndex(game, entity);

  const frame = {x: 4, y: 0};
  const key = entity.facing;
  if (curAction != null) {
    switch (curAction.type) {
      case 'RUMBLE':
      case 'MOVE':
        frame.x = index;
        break;
    }
  }

  const tr = game.isTimeReversed || game.prevTime > game.time;
  if ((key == 'left' && !tr) || (tr && key == 'right')) {
    frame.y = 0;
  } else if ((key == 'right' && !tr) || (tr && key == 'left')) {
    frame.y = 1;
  } else if ((key == 'down' && !tr) || (tr && key == 'up')) {
    frame.y = 2;
    if (!curAction || curAction.type != 'MOVE') frame.x = 2;
  } else if ((key == 'up' && !tr) || (tr && key == 'down')) {
    frame.y = 3;
    if (!curAction || curAction.type != 'MOVE') frame.x = 2;
  }
  return frame;
}

const getInterpolatedFrameIndex = (game, entity) => {
  const curAction = entity.actionQueue[0];
  if (!curAction) return 0;
  const animation = curAction.animation;

  const interp = 1 - animation.tick / animation.duration;
  const numFrames = getNumFrames(game, entity);

  return Math.max(0, Math.round(interp * numFrames - 1));
}

const getNumFrames = (game, entity) => {
  const curAction = entity.actionQueue[0];
  if (!curAction) return 0;

  switch (curAction.type) {
    case 'RUMBLE':
    case 'MOVE':
      if (curAction.payload.key == 'left' || curAction.payload.key == 'right') {
        return 5;
      } else {
        return 3;
      }
    case 'GO_BACK_IN_TIME':
      return 1;
  }
  // console.log("getNumFrames not implemented", curAction.type);
  return 1;
}

//////////////////////////////////////////////////////////////////////
// Sprites
/////////////////////////////////////////////////////////////////////

const getFloorSprite = (game: Game): Object => {
  let width = 180;
  let height = 172;
  const img = game.sprites.FLOOR;
  const obj = {
    img,
    x: 0,
    y: 0,
    width,
    height,
  };

  return obj;
};

//////////////////////////////////////////////////////////////////////
// Tile-specific
/////////////////////////////////////////////////////////////////////

// indicies into the spritesheet
const tileDict = {
  'ltb': {x: 0, y: 1},
  'rtb': {x: 2, y: 1},
  'lrt': {x: 1, y: 0},
  'lrb': {x: 1, y: 2},
  't': {x: 3, y: 0},
  'b': {x: 3, y: 2},
  'tb': {x: 3, y: 1},
  'lt': {x: 0, y: 0},
  'lb': {x: 0, y: 2},
  'rt': {x: 2, y: 0},
  'rb': {x: 2, y: 2},
  'l': {x: 0, y: 3},
  'lr': {x: 1, y: 3},
  'r': {x: 2, y: 3},
  'lrtb': {x: 1, y: 1},
  '': {x: 3, y: 3},
};

const getTileSprite = (game: Game, entity: Entity): Object => {
  let entityType = entity.type;
  let width = 47.25;
  let height = 47.25;
  let spriteType = entityType.subtType != null ? entity.subType : entityType;
  spriteType = spriteType == null ? entityType : spriteType;
  let img = game.sprites[spriteType];
  const obj = {
    img,
    x: 0,
    y: 0,
    width,
    height,
  };
  let {dictIndexStr} = entity;
  if (dictIndexStr == null) dictIndexStr = '';

  if (tileDict[dictIndexStr] == null) {
    console.error("nothing in config for", dictIndexStr);
    return obj;
  }
  const {x, y} = tileDict[dictIndexStr];
  obj.x = x * width;
  obj.y = y * height;

  return obj;
};

const hasNeighbor = (game, pos, type): boolean => {
  return lookupInGrid(game.grid, pos)
    .map(id => game.entities[id])
    .filter(e => e != null && e.type == type)
    .length > 0;
}

const getDictIndexStr = (game: Game, entity: Entity): Object => {
  let dictIndexStr = '';
  if (entity.position == null) return dictIndexStr;
  if (hasNeighbor(game, add(entity.position, {x: 1, y: 0}), entity.type)) {
    dictIndexStr += 'l';
  }
  if (hasNeighbor(game, add(entity.position, {x: -1, y: 0}), entity.type)) {
    dictIndexStr += 'r';
  }
  if (hasNeighbor(game, add(entity.position, {x: 0, y: 1}), entity.type)) {
    dictIndexStr += 't';
  }
  if (hasNeighbor(game, add(entity.position, {x: 0, y: -1}), entity.type)) {
    dictIndexStr += 'b';
  }
  return dictIndexStr;
};

module.exports = {
  getFloorSprite,
  getFrame,
  getNumFrames,
  getTileSprite,
  getInterpolatedFrameIndex,
};
