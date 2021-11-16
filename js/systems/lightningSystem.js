// @flow

const {config} = require('../config');

/**
 * Checks the state every tick for game-over conditions, then orchestrates
 * transition out of the level on win or loss
 *
 * Can short-circuit the game-over checks by setting the gameOver flag on the
 * game directly or with the SET_GAME_OVER action
 */
let time = new Date().getTime();
const initLightningSystem = (store) => {
  const {dispatch} = store;
  store.subscribe(() => {
    const state = store.getState();
    const {game} = state;
    if (!game) return;
    if (game.paused) return;

    const curTime = new Date().getTime();
    if (curTime - time > 5000 && game.lightning == 0) {
      let lightningVal = 5;
      store.dispatch({type: 'SET', property: 'lightning', value: lightningVal});
      let interval = setInterval(() => {
        lightningVal -= 1;
        store.dispatch({type: 'SET', property: 'lightning', value: lightningVal});
        if (lightningVal == 0) {
          clearInterval(interval);
          time = new Date().getTime();
        }
      }, 150);


    }


  });
};

module.exports = {initLightningSystem};
