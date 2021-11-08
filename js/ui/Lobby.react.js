// @flow

import React from 'react';
import Button from './Components/Button.react';
import Modal from './Components/Modal.react';
import AudioWidget from './Components/AudioWidget.react';
const {config} = require('../config');
const {getLevel, initDefaultLevel} = require('../state/levels');
import {Text, View, Image, Dimensions} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {useState, useEffect, useMemo} = React;

const Lobby = (props) => {
  const {store, dispatch} = props;
  const [levelNum, setLevelNum] = useState(0);
  const state = store.getState();

  useEffect(() => {
    AsyncStorage.getItem('levelNum').then(s => setLevelNum(parseInt(s) || 0));
  }, [state.resetCampaign]);

  const resetButton = (
    <View>
      <Button
        style={{width: 200, marginBottom: 5}}
        onClick={() => dispatch({type: 'CLEAR_CAMPAIGN'})}
        label="Reset Game"
      />
    </View>
  );
  const isMuted = state.isMuted;

  const [opacity, setFlickerIndex] = useState(0);
  useEffect(() => {
    let t = null;
    const flickerFunc = (x) => {
      // sine version:
      setFlickerIndex(Math.cos(x) / 15 + 0.8);
      t = setTimeout(() => flickerFunc(x + 0.25), 100);

      // flicker version
      // setFlickerIndex((x % 2) * 0.1 + 0.8);
      //  t = setTimeout(() => flickerFunc(x + 1), Math.random() * 5000 * (x % 2) + 200);
    }
    flickerFunc(0);
    return () => {
      clearTimeout(t);
    }
  }, []);


  return (<View>
    <View
      style={{
        margin: 100,
        marginLeft: 45,
      }}
    >
      <View>
      <Button
        style={{width: 200, marginBottom: 5}}
        label={"Start " + (levelNum == 0 ? '' : 'Level ' + (levelNum + 1))}
        onClick={() => {
          dispatch({
            type: 'SET_MODAL',
            modal: (<Modal
              title={<Text style={{fontWeight: 900}}>The Clock That Went Backwards</Text>}
              body={'... How did I get in this strange mansion?' +
                ' ... WHEN did I get here? ... And how do I get out?'
              }
              typewriter={true}
              buttons={[{
                label: 'Continue...',
                onClick: () => {
                  dispatch({type: 'DISMISS_MODAL'});
                  dispatch({type: 'SET_LEVEL', level: getLevel(levelNum)});
                  dispatch({type: 'SET_SCREEN', screen: 'GAME'});
                },
              }]}
            />)
          });
        }}
      />
      </View>
      {levelNum == 0 ? null : resetButton}
      <AudioWidget
        audioFiles={config.audioFiles}
        isShuffled={false}
        isMuted={isMuted}
        setIsMuted={() => {
          store.dispatch({type: 'SET_IS_MUTED', isMuted: !isMuted});
        }}
        style={{width: 200, marginBottom: 5}}
      />
    </View>
    <View
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        display: 'inline',
        zIndex: -1,
        opacity,
      }}
    >
      <Image
        style={{
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height,
        }}
        source={require('../../assets/background1.png')}
      />
    </View>
  </View>);
};

export default Lobby;
