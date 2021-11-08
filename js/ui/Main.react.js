// @flow

import React from 'react';
import {Text, View} from 'react-native';
import { connect } from 'react-redux';
import Game from './Game.react';
import Lobby from './Lobby.react';

import type {State, Action} from '../types';

type Props = {
  state: State, // Game State
  dispatch: (action: Action) => Action,
  store: Object,
  modal: Object,
};

function Main(props: Props): React.Node {
  const state = store.getState();
  const modal = state.modal;
  let content = null;
  if (state.screen === 'LOBBY') {
    content = <Lobby dispatch={props.dispatch} store={props.store} />;
  } else if (state.screen === 'GAME') {
    content = (
      <Game
        dispatch={store.dispatch} store={store}
        state={store.getState()}
      />
    );
  }

  return (
    <View
      style={{
        backgroundColor: 'black',
        height: '100%',
        width: '100%',
        overflow: 'hidden',
      }}
    >
      {content}
      {modal}
    </View>
  );
}

let i = 0;
const mapStateToProps = (state) => {
  i++; // HACK to force re-render bcuz I'm 2 dum to figur out how you'd actually do this
  return {
    ...state,
    i,
  }
};

export default connect(mapStateToProps)(Main);
