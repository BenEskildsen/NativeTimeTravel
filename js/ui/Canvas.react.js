// @flow

import React, {Component} from 'react';
import {Text, View, Dimensions} from 'react-native';
import Canvas from 'react-native-canvas';
const {render} = require('../render/render');
// import config from '../config';
import initSpriteSheetSystem from '../systems/spriteSheetSystem';

class CustomCanvas extends Component {

  handleCanvas = (canvas) => {
    initSpriteSheetSystem(canvas);
    render(window.store.getState().game, canvas);
  }

  render() {
    const config = {
      width: Dimensions.get("window").width,
      height: Dimensions.get("window").height,
    };
    const maxWidth = config.width;
    const maxHeight = config.height;

    config.width = Math.min(maxWidth, maxHeight);
    config.height = Math.min(maxWidth, maxHeight);

    const defaultStyle = {
      height: config.height,
      width: config.width,
      maxWidth: config.width,
      maxHeight: config.height,
      flexDirection: 'row',
      alignItems: 'center',
      position: 'relative',
    };

    return (
      <View id="canvasWrapper"
        style={defaultStyle}
      >
        <Canvas
          ref={this.handleCanvas}
          id="canvas" style={{
            backgroundColor: 'white',
            cursor: 'pointer',
          }}
          width={config.width} height={config.height}
        />
      </View>
    );
  }
}

// function CustomCanvas(props: Props): React.Node {
// }

const renderRef = (canvas) => {
  initSpriteSheetSystem(canvas);
  render(window.store.getState().game, canvas);
};

export default CustomCanvas;
