// @flow

const {initState, initGameState} = require('../state/state');
const {gameReducer} = require('./gameReducer');
const {hotKeysReducer} = require('./hotKeysReducer');
const {modalReducer} = require('./modalReducer');
const {mouseReducer} = require('./mouseReducer');
const {render} = require('../render/render');
const {deepCopy} = require('../utils/helpers');
const levels = require('../levels/levels');
const AsyncStorage = require('@react-native-async-storage/async-storage').default;

import type {State, Action} from '../types';

const rootReducer = (state: State, action: Action): State => {
  if (state === undefined) return initState();

  switch (action.type) {
    case 'SET_SCREEN':
      return {
        ...state,
        screen: action.screen,
      };
    case 'SET_LEVEL': {
      const {level, isExperimental, num} = action;
      let hotKeys = null;
      if (state.game != null) {
        hotKeys = state.game.hotKeys;
        clearInterval(state.game.tickInterval);
        state.game.tickInterval = null;
      }
      state.game = deepCopy(action.level);
      state.game = action.level;
      if (hotKeys != null) {
        state.game.hotKeys = hotKeys;
      }
      state.game.isExperimental = isExperimental;
      if (num) {
        state.game.level = num;
      }
      state.game.sprites = {...state.sprites};
      return {...state};
    }
    case 'RETURN_TO_LOBBY':
      return {
        ...initState(),
        sprites: {...state.sprites},
        isMuted: state.isMuted,
      };
    case 'CLEAR_CAMPAIGN':
      AsyncStorage.setItem('levelNum', '0');
      return {...state, resetCampaign: true};
    case 'SET_MODAL':
    case 'DISMISS_MODAL':
      console.log("Set modal", action.modal);
      return modalReducer(state, action);
    case 'SET_HOTKEY':
    case 'SET_KEY_PRESS': {
      return hotKeysReducer(state, action);
    }
    case 'SET_MOUSE_POS':
    case 'SET_MOUSE_DOWN': {
      return mouseReducer(state, action);
    }
    case 'SET_IS_MUTED': {
      return {
        ...state,
        isMuted: action.isMuted,
        interactedWithIsMuted: true,
      };
    }
    case 'SET_SPRITE_SHEET':
      state.sprites[action.name] = action.img;
    case 'SET_SELECTED_POSITION':
    case 'SET_STEP_LIMIT':
    case 'SET_START_LOCATION':
    case 'SET_GAME_OVER':
    case 'RESET_LEVEL':
    case 'ADD_ENTITY':
    case 'REMOVE_ENTITY':
    case 'SET':
    case 'STEP_ANIMATION':
    case 'ENQUEUE_ACTION': {
      if (!state.game) return state;
      return {
        ...state,
        game: gameReducer(state.game, action),
      };
    }
  }
  console.log("not handling", action.type, action);
  return state;
};

module.exports = {rootReducer};
