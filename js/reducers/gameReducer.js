// @flow

const {render} = require('../render/render');
const {config} = require('../config');
const {doNextAction, isActionTypeQueued} = require('../entities/actions');
const {getPlayerAgent, getTarget} = require('../selectors/selectors');
const {filterObj, forEachObj, deepCopy} = require('../utils/helpers');
const {initMoveAttempts} = require('../state/state');

const gameReducer = (game: GameState, action: Action) => {
  switch (action.type) {
    case 'SET_SPRITE_SHEET':
      game.sprites[action.name] = action.img;
      return game;
    case 'SET_STEP_LIMIT':
      game.stepLimit = action.stepLimit;
      return game;
    case 'SET_GAME_OVER': {
      const {won} = action;
      game.levelWon = won;
      return game;
    }
    case 'SET_START_LOCATION': {
      const agent = getPlayerAgent(game);
      agent.history[0] = {...game.selectedPosition};
      render(game);
      return game;
    }
    case 'SET_SELECTED_POSITION':
      game.selectedPosition = action.pos;
      render(game);
      return game;
    case 'ADD_ENTITY': {
      const {entity} = action;
      game[entity.type][entity.id] = entity;
      game.entities[entity.id] = entity;
      return game;
    }
    case 'REMOVE_ENTITY': {
      const {entity} = action;
      delete game[entity.type][entity.id];
      delete game.entities[entity.id];
      return game;
    }
    case 'SET': {
      const {property, value} = action;
      game[property] = value;
      return game;
    }
    case 'RESET_LEVEL': {
      // remove extra agents
      let i = 0;
      for (const id in game.AGENT) {
        if (i == 0) {
          game.AGENT[id].isPlayerAgent = true;
          game.AGENT[id].facing = 'down';
          game.AGENT[id].history = [game.AGENT[id].history[0]];

          i++;
          continue;
        }
        delete game.AGENT[id];
        delete game.entities[id];
        i++;
      }

      // open all doors
      if (game.level >= config.openDoorCutoff) {
        forEachObj(game.DOOR, door => door.open = true);
        forEachObj(game.BUTTON, button => button.pressed = true);
      } else {
        forEachObj(game.DOOR, door => door.open = false);
        forEachObj(game.BUTTON, button => button.pressed = false);
      }

      // reset game
      game.time = 0;
      game.prevTime = -1;
      game.numReversals = 0;
      game.paused = false;
      game.moveAttempts = initMoveAttempts();

      return {...game};
    }
    case 'ENQUEUE_ACTION': {
      const {entityID} =  action;
      let nextGame = game;
      const entity = game.entities[entityID];

      // disable agents when the win is in hand
      if (entity.type == 'AGENT') {
        const target = getTarget(nextGame);
        if (isActionTypeQueued(target, 'LEVEL_WON')) {
          return nextGame;
        }
      }

      const startCurrent = entity.actionQueue.length == 0;
      entity.actionQueue.push(action.action);
      if (startCurrent) {
        nextGame = doNextAction(game, entity);
      }
      return nextGame;
    }
    case 'STEP_ANIMATION': {
      let nextGame = game;
      const curTime = new Date().getTime();
      for (const entityID in nextGame.entities) {
        const entity = nextGame.entities[entityID];
        if (entity.actionQueue.length == 0) continue;
        const curAnimation = entity.actionQueue[0].animation;
        if (curAnimation.tick <= 0) {
          entity.actionQueue.shift();
          if (entity.actionQueue.length > 0) {
            nextGame = doNextAction(nextGame, entity);
          }
          continue;
        }
        curAnimation.tick -= curTime - game.prevTickTime;
      }

      // handle interval
      let stopAnimating = true;
      for (const entityID in nextGame.entities) {
        const entity = nextGame.entities[entityID];
        if (entity.actionQueue.length > 0) {
          stopAnimating = false;
          break;
        }
      }
      if (stopAnimating) {
        clearInterval(nextGame.tickInterval);
        nextGame.tickInterval = null;
      }

      render(nextGame);
      game.prevTickTime = curTime;
      return nextGame;
    }
  }
};



module.exports = {
  gameReducer,
}
