// @flow

import type {State, Action} from '../types';

const hotKeysReducer = (state: State, action: Action): HotKeys => {
  if (!state.game) return state;
  const hotKeys = state.game.hotKeys;

	switch (action.type) {
		case 'SET_KEY_PRESS': {
			const {key, pressed, once} = action;
			hotKeys.keysDown[key] = pressed;
      if (once == true) {
        hotKeys.once = true;
      }
      break;
		}
		case 'SET_HOTKEY': {
			const {key, press, fn} = action;
			hotKeys[press][key] = fn;
      break;
		}
	}
  return state;
}

module.exports = {hotKeysReducer};
