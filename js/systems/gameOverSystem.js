// @flow

const React = require('react');
import {Text, View, Image, Dimensions} from 'react-native';
// const axios = require('axios');
import Divider from '../ui/Components/Divider.react';
import Modal from '../ui/Components/Modal.react';
import Button from '../ui/Components/Button.react';
const {config} = require('../config');
const {render} = require('../render/render');
const {getLevel, allLevels} = require('../state/levels');
const AsyncStorage = require('@react-native-async-storage/async-storage').default;

/**
 * Checks the state every tick for game-over conditions, then orchestrates
 * transition out of the level on win or loss
 *
 * Can short-circuit the game-over checks by setting the gameOver flag on the
 * game directly or with the SET_GAME_OVER action
 */
const initGameOverSystem = (store) => {
  const {dispatch} = store;
  store.subscribe(() => {
    const state = store.getState();
    const {game} = state;
    if (!game) return;
    if (game.paused) return;

    // handle game win conditions
    if (game.levelWon && game.level + 1 >= Object.keys(allLevels).length) {
      dispatch({type: 'SET', property: 'paused', value: true});
      handleGameWon(store, dispatch, state);
      return;
    }

    // handle level won
    if (game.levelWon) {
      dispatch({type: 'SET', property: 'paused', value: true});
      handleLevelWon(store, dispatch, state);
      return;
    }

    // LOSS CONDITIONS

    let reason = '';
    // no more move attempts
    const {left, right, up, down, reverseTime} = game.moveAttempts;
    const noMovesLeft = left && right && up && down && reverseTime;
    if (noMovesLeft) reason = "You're stuck! You'll run into yourself if you" +
      " move left, right, up, down, or go back in time!";

    // run out of steps
    const noMoreSteps = game.time > game.stepLimit;
    if (noMoreSteps) reason = 'You ran out of steps!';

    if (noMovesLeft || noMoreSteps) {
      dispatch({type: 'SET', property: 'paused', value: true});
      handleGameLoss(store, dispatch, state, reason);
    }

  });
};

const handleLevelWon = (store, dispatch, state): void => {
  const {game} = state;
  // increment level
  const nextLevelNum = game.level + 1;
  // store level progress
  try {
    AsyncStorage.setItem('levelNum', '' + nextLevelNum);
  } catch (e) {
    console.log(e);
  }

  const continueButton = {
    label: 'Continue',
    onClick: () => {
      dispatch({type: 'DISMISS_MODAL'});
      dispatch({type: 'SET_LEVEL', level: getLevel(nextLevelNum), num: nextLevelNum});
    }
  };

  const body = (
    <View
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        display: 'inline',
        zIndex: -1,
      }}
    >
      <Image
        style={{
          width: '100%',
          height: '100%',
        }}
        source={require('../../assets/background2.png')}
      />
    </View>
  );

  dispatch({type: 'SET_MODAL',
    modal: (<Modal
      title={<Text style={{
        color: 'white', fontWeight: '900', fontSize: config.fontSize + 4,
        textAlign: 'center',
      }}>Level Won</Text>}
      body={body}
      buttons={[continueButton]}
      splash={true}
    />),
  });
};


const handleGameLoss = (store, dispatch, state, reason): void => {
  dispatch({type: 'SET', property: 'levelAudio', value: config.gameLossAudioFiles});
  const {game} = state;

  const returnButton = {
    label: 'Back to Main Menu',
    onClick: () => {
      dispatch({type: 'DISMISS_MODAL'});
      dispatch({type: 'RETURN_TO_LOBBY'});
    }
  };
  const resetButton = {
    label: 'Restart Level',
    onClick: () => {
      dispatch({type: 'DISMISS_MODAL'});
      dispatch({type: 'SET', property: 'levelAudio', value: config.gameAudioFiles});
      dispatch({type: 'RESET_LEVEL'});
      if (state.screen == 'EDITOR') {
        render(store.getState().game); // HACK for level editor
      }
    },
  };
  const buttons = [resetButton, returnButton];

  const body = (
    <View
      style={{
        backgroundColor: 'black',
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        display: 'inline',
      }}
    >
      <View
        style={{
          opacity: 0.6,
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          display: 'inline',
          zIndex: -1,
        }}
      >
        <Image
          style={{
            width: '100%',
            height: '100%',
          }}
          source={require('../../assets/background3.png')}
        />
      </View>
      <Text
        style={{
          fontFamily: config.font,
          fontSize: config.fontSize + 4,
          zIndex: 3,
          fontWeight: '900',
          textAlign: 'center',
        }}
      >
        Game Over
      </Text>
      <View></View>
      <Text
        style={{
          fontFamily: config.font,
          fontSize: config.fontSize,
          zIndex: 3,
          textAlign: 'center',
        }}
      >
        {reason}
      </Text>
    </View>
  );

  dispatch({type: 'SET_MODAL',
    modal: (<Modal
      title={
        <Text style={{
          textAlign: 'center', fontFamily: config.font,
          fontWeight: '900',
        }}>
          Game Over
        </Text>
      }
      body={body}
      buttons={buttons}
      splash={true}
    />),
  });
};

const handleGameWon = (store, dispatch, state): void => {
  const {game} = state;
  dispatch({type: 'CLEAR_CAMPAIGN'});

  const returnButton = {
    label: 'Back to Main Menu',
    onClick: () => {
      dispatch({type: 'DISMISS_MODAL'});
      dispatch({type: 'RETURN_TO_LOBBY'});
    }
  };
  const resetButton = {
    label: 'Reset',
    onClick: () => {
      dispatch({type: 'DISMISS_MODAL'});
      dispatch({type: 'SET_PLAYERS_AND_SIZE'});
      render(store.getState().game); // HACK for level editor
    },
  };
  const buttons = [returnButton];

  const body = (
    <View
      style={{
        backgroundColor: 'black',
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        display: 'inline',
      }}
    >
      <View
        style={{
          opacity: 0.6,
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          display: 'inline',
          zIndex: -1,
        }}
      >
        <Image
          style={{
            width: '100%',
            height: '100%',
          }}
          source={require('../../assets/background2.png')}
        />
      </View>
      <Text
        style={{
          fontFamily: config.font,
          fontSize: config.fontSize + 4,
          zIndex: 3,
          fontWeight: '900',
          color: 'white',
          textAlign: 'center',
        }}
      >
        You've Escaped! Game Won!
      </Text>
      <View></View>
      <Text
        style={{
          color: 'white',
          fontFamily: config.font,
          fontSize: config.fontSize,
          zIndex: 3,
          textAlign: 'center',
        }}
      >
        Thank you for playing
      </Text>
      <View
        style={{
          textAlign: 'left',
          marginLeft: 40,
          marginTop: 40,
        }}
      >
        <Text
          style={{
            color: 'white',
            fontFamily: config.font,
            zIndex: 3,
          }}
        >
          Programming: Ben Eskildsen
        </Text>
        <View></View>
        <Text
          style={{
            color: 'white',
            fontFamily: config.font,
            zIndex: 3,
          }}
        >
          Art: Amanda Zuo
        </Text>
        <View></View>
        <Text
          style={{
            color: 'white',
            fontFamily: config.font,
            zIndex: 3,
          }}
        >
          Music: Ben Eskildsen
        </Text>
      </View>
    </View>
  );

  dispatch({type: 'SET_MODAL',
    modal: (<Modal
      title={'Level Won'}
      body={body}
      buttons={buttons}
      splash={true}
    />),
  });
};

export default initGameOverSystem;
