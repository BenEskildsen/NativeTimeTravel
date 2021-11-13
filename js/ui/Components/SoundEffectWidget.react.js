
import React from 'react';
import Button from './Button.react';
import {Text, View} from 'react-native';
import {Audio} from 'expo-av';
const {useState, useEffect, useMemo} = React;

/**
 * Props:
 *
 * audioFiles, // array of {path, type} pairs
 * isMuted, // optional boolean for outside control of this widget
 * setIsMuted, // optional function called when this is toggled
 * isShuffled, // optional boolean for whether audio should play in random order
 * style, // optional object of css styles
 *
 */
let everPlayed = false;
const SoundEffectWidget = (props) => {
  const {isMuted} = props;
  const [isLoaded, setIsLoaded] = useState(false);

  // load tracks
  const tracks = useMemo(() => {
    const toReturn = {};
    let l = false;
    for (const file of props.audioFiles) {
      const a = new Audio.Sound();
      Audio.setAudioModeAsync({playsInSilentModeIOS: true});
      a.loadAsync(file.path, {shouldPlay: false});
      toReturn[file.name] = a;
      if (!l) {
        l = true;
        a.setOnPlaybackStatusUpdate((stat) => {
          if (stat.isLoaded) {
            setIsLoaded(true);
          }
        });
      }
    }
    return toReturn;
  }, [props.audioFiles]);

  // player
  const audioPlayer = useMemo(() => {
    if (props.playing == null && isLoaded) {
      for (const name in tracks) {
        tracks[name].pauseAsync();
      }
      return null;
    }
    if (props.playing == null) return null;
    if (isMuted) return null;
    tracks[props.playing].replayAsync();

    return tracks[props.playing];
  }, [tracks, props.playing, isMuted]);

  // component unmount
  useEffect(() => {
    return () => {
      if (isLoaded) {
        for (const title in tracks) {
          tracks[title].unloadAsync().catch(() => {});
        }
      }
    }
  }, []);


  return (<View></View>);
};

export default SoundEffectWidget;
