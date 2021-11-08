// @flow

import React from 'react';
import {Image} from 'react-native-canvas';
import {Image as RNimage} from 'react-native';

const initSpriteSheetSystem = (canvas) => {
  console.log(canvas);
  const {dispatch} = window.store; // HACK: store is global

  // loadSprite(dispatch, canvas, 'WALL', require('../../assets/wall1.png'));
  // loadSprite(dispatch, canvas, 'CHARACTER', require('../../assets/characterSheet1.png'));
  // loadSprite(dispatch, canvas, 'FLOOR', require('../../assets/floorSheet1.png'));
  // loadSprite(dispatch, canvas, 'BUTTON', require('../../assets/buttonSheet2.png'));
  // loadSprite(dispatch, canvas, 'PRESSED_BUTTON', require('../../assets/pressedSheet2.png'));
  // loadSprite(dispatch, canvas, 'EXCLAMATION', require('../../assets/exclamations1.png'));
  // loadSprite(dispatch, canvas, 'GATE', require('../../assets/gate1.png'));

  // loadSprite(dispatch, canvas, 'PHEROMONE', require('../../assets/pheromones.png'));

  // loadSprite(dispatch, canvas, 'BACKGROUND', require('../../assets/background1.png'));
};

const loadSprite = (dispatch, canvas, name, src): void => {
  console.log("trying to load image", src);
  const img = new Image(canvas);
  img.onload = () => {
    console.log("loaded " + src + " spritesheet A");
    dispatch({
      type: 'SET_SPRITE_SHEET',
      name,
      img,
    });
  };
  img.addEventListener('load', () => {
    console.log("loaded " + src + " spritesheet B");
    dispatch({
      type: 'SET_SPRITE_SHEET',
      name,
      img,
    });
  }, false);
  img.addEventListener('onLoad', () => {
    console.log("loaded " + src + " spritesheet C");
    dispatch({
      type: 'SET_SPRITE_SHEET',
      name,
      img,
    });
  }, false);
  img.onLoad = () => {
    console.log("loaded " + src + " spritesheet D");
    dispatch({
      type: 'SET_SPRITE_SHEET',
      name,
      img,
    });
  };
  img.addEventListener('onload', () => {
    console.log("loaded " + src + " spritesheet E");
    dispatch({
      type: 'SET_SPRITE_SHEET',
      name,
      img,
    });
  }, false);


  // const asset = Expo.Asset.fromModule(require(src));
  // const imageUri = RNimage.resolveAssetSource(src).uri
  img.src = src;
}

export default initSpriteSheetSystem;
