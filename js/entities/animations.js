// @flow

const {config} = require('../config');

const makeAnimation = (type): Animation => {
  if (type == 'TURN') {
    return {
      duration: 1,
      tick: 1,
    };
  }
  // type ignored for now, but different animations might have different durations
  return {
    duration: config.animationDuration,
    tick: config.animationDuration,
  };
};

module.exports = {
  makeAnimation,
};
