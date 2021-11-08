// @flow

import React from 'react';
import Button from './Button.react';
import Modal from './Modal.react';
import {Text, View} from 'react-native';

const QuitButton = (props) => {
  const {isInGame, dispatch, style} = props;

  if (!isInGame) return null;

  const buttonStyle = isInGame ? {} :
    {
      margin: 5,
      borderRadius: 8,
      left: 5,
    };
  return (
    <View
      style={buttonStyle}
    >
      <Button
        label="Quit"
        style={style || {}}
        onClick={() => {
          if (!isInGame) {
            remote.webFrame.context.close();
          } else {
            quitGameModal(dispatch);
          }
        }}
      />
    </View>
  );
}

const quitGameModal = (dispatch) => {
  const returnToMainMenuButton = {
    label: 'Main Menu',
    onClick: () => {
      dispatch({type: 'DISMISS_MODAL'});
      dispatch({type: 'RETURN_TO_LOBBY'});
    }
  };
  const returnToGameButton = {
    label: 'Return to Game',
    onClick: () => {
      dispatch({type: 'DISMISS_MODAL'});
    }
  };
  const quitAppButton = {
    label: 'Quit Application',
    onClick: () => {
      remote.webFrame.context.close();
    },
  };
  const buttons = [returnToGameButton, returnToMainMenuButton];

  const body = (
    <View>
    </View>
  );

  dispatch({type: 'SET_MODAL',
    modal: (<Modal
      title={'Quit Game?'}
      body={body}
      buttons={buttons}
    />),
  });
}

export default QuitButton;
