
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

const AudioWidget = (props) => {
  const [isMuted, setIsMuted] = useState(!!props.isMuted);
  const [playIndex, setPlayIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // TODO: shuffle the playOrder array

  // player
  const audioPlayer = useMemo(() => {
    const a = new Audio.Sound();
    Audio.setAudioModeAsync({playsInSilentModeIOS: true});
    a.setOnPlaybackStatusUpdate((stat) => {
      if (stat.isLoaded && stat.didJustFinish) {
        setIsLoaded(false);
        a.unloadAsync();
        setPlayIndex((playIndex + 1) % props.audioFiles.length);
      } else if (stat.isLoaded) {
        setIsLoaded(true);
      }
    });
    a.loadAsync(props.audioFiles[playIndex].path, {shouldPlay: !isMuted});
    return a;
  }, [playIndex, props.audioFiles]);

  // handling mute toggle as well as loading new files
  useEffect(() => {
    if (!isLoaded || !audioPlayer) return;
    try {
      if (isMuted) {
        audioPlayer.pauseAsync().catch(() => {});
      } else {
        audioPlayer.playAsync().catch(() => {});
      }
    } catch (e) {
      console.log(e);
    }
  }, [isMuted, props.audioFiles, audioPlayer, isLoaded]);

  // component unmount
  useEffect(() => {
    if (isLoaded) {
      return () => {
        audioPlayer.unloadAsync().catch(() => {});
      }
    }
  }, []);

  // also unload when audio files switch
  useEffect(() => {
    if (isLoaded) {
      return () => {
        audioPlayer.unloadAsync().catch(() => {});
      }
    }
  }, [props.audioFiles]);

  let widgetStyle = {
    margin: 5,
    borderRadius: 8,
    left: 5,
  };
  return (
    <View
      style={{
        display: props.hidden ? 'none' : 'initial',
      }}
    >
      <Button
        style={props.style ? props.style : widgetStyle}
        label={isMuted ? 'Music On' : 'Music Off'}
        onClick={() => {
          setIsMuted(!isMuted);
          if (props.setIsMuted) {
            props.setIsMuted(!isMuted);
          }
        }}
      />
    </View>
  );
};

export default AudioWidget;
