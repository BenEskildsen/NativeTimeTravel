// @flow

import type {Mouse, Action} from '../types';

const mouseReducer = (state: State, action: Action): Mouse => {
  if (state.game == null || state.game.mouse == null) return state;

  const mouse = state.game.mouse;
  switch (action.type) {
    case 'SET_MOUSE_DOWN': {
      const {isLeft, isDown, downPos} = action;
      state.game.mouse = {
        ...mouse,
        isLeftDown: isLeft ? isDown : mouse.isLeftDown,
        isRightDown: isLeft ? mouse.isRightDOwn : isDown,
        downPos: isDown && downPos != null ? downPos : mouse.downPos,
      };
    }
    case 'SET_MOUSE_POS': {
      const {curPos, curPixel} = action;
      state.game.mouse = {
        ...mouse,
        prevPos: {...mouse.curPos},
        curPos,
        prevPixel: {...mouse.curPixel},
        curPixel,
      };
    }
  }
  return state;
};

module.exports = {mouseReducer};
