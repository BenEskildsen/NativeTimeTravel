
import React from 'react';
import {Text, View, Dimensions} from 'react-native';
import AudioWidget from './Components/AudioWidget.react';
import Button from './Components/Button.react';
import Divider from './Components/Divider.react';
import Modal from './Components/Modal.react';
import QuitButton from '../ui/Components/QuitButton.react';
const {config} = require('../config');
const {getDisplayTime, isElectron} = require('../utils/helpers');
const {memo, useState, useEffect, useMemo} = React;

function TopBar(props) {
  const {
    dispatch,
    isExperimental,
    modal,
    isMuted,
    isTimeReversed,
  } = props;

  const height = 100;
  const topPadding = 8;
  const leftPadding = Dimensions.get("window").width / 2 - 100;

  return (
    <View
      id="topBar"
      style={{
        position: 'absolute',
        top: topPadding,
        height,
        width: isExperimental ? '400px' : '100%',
        zIndex: 2,
        pointerEvents: isExperimental ? 'none' : 'auto',
        // textShadow: '-1px -1px 0 #FFF, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff',
      }}
    >
      <ButtonStack {...props} />
      <InfoStack {...props} />
    </View>
  );
}

function InfoStack(props) {
  const {
    dispatch,
    isExperimental,
    modal,
    isMuted,
    isTimeReversed,
    stepsRemaining,
    numReversals,
    level,
  } = props;

  const [flickerIndex, setFlickerIndex] = useState(0);

  // useEffect(() => {
  //   const flickerFunc = (f) => {
  //     setFlickerIndex(f - 1);
  //     if (f > 1) {
  //       setTimeout(() => flickerFunc(f - 1), 100);
  //     }
  //   }
  //   if (stepsRemaining <= 2 && !isTimeReversed) {
  //     flickerFunc(8);
  //   }
  // }, [stepsRemaining, isTimeReversed]);

  return (
    <View
      style={{
        display: 'inline-block',
        verticalAlign: 'top',
        position: 'absolute',
        right: 5,
        fontSize: flickerIndex % 2 == 0 ? '13' : '15',
        float: 'right',
        marginRight: 8,
        color: flickerIndex % 2 == 0 ? 'white' : 'red',
      }}
    >
      <Text style={{fontFamily: config.font, color: 'white'}}>Level: {level + 1}</Text>
      <View></View>
      <Text style={{fontFamily: config.font, color: 'white'}}>Steps Left: {stepsRemaining}</Text>
      <View></View>
      <Text style={{fontFamily: config.font, color: 'white'}}>Time Reversals: {numReversals}</Text>
    </View>
  );
}

function ButtonStack(props) {
  const {
    dispatch,
    isExperimental,
    modal,
    isMuted,
  } = props;

  if (isExperimental) return null;

  return (
    <View
      style={{
        // float: 'left',
        paddingLeft: 8,
        display: 'inline-block',
        color: 'black',
      }}
    >
      <QuitButton
        isInGame={true} dispatch={dispatch}
        style={{width: 125, marginBottom: 5}}
      />
      <View>
        <Button
          label="Reset Level"
          style={{width: 125, marginBottom: 5}}
          onClick={() => {
            dispatch({type: 'RESET_LEVEL'});
          }}
        />
      </View>
      <AudioWidget
        audioFiles={config.audioFiles}
        isShuffled={false}
        isMuted={isMuted}
        setIsMuted={() => {
          store.dispatch({type: 'SET_IS_MUTED', isMuted: !isMuted});
        }}
        style={{width: 125, marginBottom: 5}}
      />
      <View>
        <Button
          label="Instructions"
          style={{width: 125, marginBottom: 5}}
          onClick={() => {
            instructionsModal(dispatch);
          }}
        />
      </View>
    </View>
  );
}

function instructionsModal(dispatch) {
  dispatch({
    type: 'SET_MODAL',
    modal: (<Modal
      title={
        <Text style={{textAlign: 'center', fontWeight: '900'}}>Instructions</Text>
      }
      body={(<View style={{textAlign: 'initial'}}>
        <View>
          <Text style={{textAlign: 'center', fontWeight: '900'}}>Controls:</Text>
          <Text>Arrows: move character</Text>
          <Text>Reverse Time: go back in time</Text>
        </View>
        <Divider style={{
          marginTop: 6,
          marginBottom: 6,
        }} />
        <View>
          <Text style={{textAlign: 'center', fontWeight: '900'}}>Goal:</Text>
          <Text>
            Reach the staircase while avoiding paradoxes.
            Open doors by pressing the color-corresponding buttons.
            If you pass through an open door, you must open the door. If you
            reach the staircase without opening a door you passed through, then you
            must go back in time and open the door before you win the level.
          </Text>
        </View>
      </View>)}
      buttons={[{label: 'Dismiss', onClick: () => {
        dismissModal(dispatch);
      }}]}
    />),
  });
}

function dismissModal(dispatch) {
  dispatch({type: 'DISMISS_MODAL'});
}


export default TopBar;
