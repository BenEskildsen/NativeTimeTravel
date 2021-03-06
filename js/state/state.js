// @flow
const {config} = require('../config');

const initState = () => {
  return {
    screen: 'LOBBY',
    game: null,
    sprites: {},
    editor: {},
    isMuted: true,
  };
};

const initGameState = () => {
  return {
    time: 0,
    prevTime: -1,
    numReversals: 0,

    entities: {},
    AGENT: {},
    WALL: {},
    DOOR: {},
    BUTTON: {},
    TARGET: {},

    tickInterval: null,
    prevTickTime: 0,

    hotKeys: {
      onKeyDown: {},
      onKeyPress: {},
      onKeyUp: {},
      keysDown: {},
    },
    mouse: {
      isLeftDown: false,
      isRightDown: false,
      downPos: {x: 0, y: 0},
      prevPos: {x: 0, y: 0},
      curPos: {x: 0, y: 0},
      curPixel: {x: 0, y: 0},
      prevPixel: {x: 0, y: 0},
    },
    sprites: {},
    levelAudio: config.gameAudioFiles,
    lightning: 0,

    level: 0,
    stepLimit: 10,
    moveAttempts: initMoveAttempts(),

    gridWidth: 7,
    gridHeight: 7,
    viewWidth: 7,
    viewHeight: 7,
    viewPos: {x: 0, y: 0},
  };
};

const initMoveAttempts = () => {
  return {
    left: false,
    right: false,
    up: false,
    down: false,
    reverseTime: false,
  };
};

const setSoundEffect = (game, soundEffect, time) => {
  game.soundEffect = soundEffect;
  setTimeout(() => {
    const state = store.getState();
    if (state.game && state.game.soundEffect == soundEffect) {
      store.dispatch({type: 'SET', property: 'soundEffect', value: null});
    }
  }, time || 400);
  return game;
}

module.exports = {
  initState,
  initGameState,
  initMoveAttempts,
  setSoundEffect,
};
