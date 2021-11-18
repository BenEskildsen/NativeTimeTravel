// @flow

import React from 'react';
import Button from '../Components/Button.react';
const {useState, useEffect, useMemo} = React;
const {config} = require('../../config');
import {Text, View, Dimensions} from 'react-native';

type Props = {
  title: ?string,
  body: ?string,
  buttons: Array<{
    label: string,
    onClick: () => void,
  }>,
  height: ?number,
  typewriter: ?boolean,
  splash: ?boolean,
};

function Modal(props: Props): React.Node {
  const {content, title, body, buttons, typewriter, splash} = props;
  const height = props.height ? props.height : 450;

  // using 2 rects to properly position width and height
  const rect = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  };

  let width = props.width ? props.width : Math.min(rect.width * 0.8, 350);
  width = splash ? rect.width : width;

  let buttonHTML = buttons.map(b => {
    return (<Button
      key={"b_" + b.label}
      disabled={!!b.disabled}
      label={b.label} onClick={b.onClick}
      style={{width: 200, marginLeft: width / 2 - 103, marginBottom: 4}}
    />);
  });

  // typewriter
  const [bodyIndex, setBodyIndex] = useState(0);
  useEffect(() => {
    if (!typewriter) return;
    let interval = null;
    if (bodyIndex < body.length) {
      interval = setTimeout(() => setBodyIndex(bodyIndex + 1), 20)
    }
    return () => clearTimeout(interval);
  }, [bodyIndex]);

  let bodyHTML = body;
  if (typewriter) {
    bodyHTML = [];
    for (let i = 0; i < body.length; i++) {
      bodyHTML.push(
        <Text
          style={{opacity: i < bodyIndex ? 1 : 0}}
          key={"body_letter_" + i}
        >
          {body[i]}
        </Text>
      );
    }
  }
  if (typewriter && bodyIndex < body.length) {
    buttonHTML = null;
  }

  bodyHTML = splash ? bodyHTML :
    (<Text style={{fontFamily: config.font, fontSize: config.fontSize}}>{bodyHTML}</Text>);

  return (
    <View
      style={{
        position: 'absolute',
        backgroundColor: 'whitesmoke',
        border: '1px solid black',
        padding: splash ? 0 : 4,
        boxShadow: '2px 2px #666666',
        borderRadius: 3,
        color: '#46403a',
        textAlign: 'center',
        width: splash ? '100%' : width,
        height: splash ? '100%' : 'auto',
        top: splash ? 0 : 40,
        left: splash ? 0 : (rect.width - width) / 2,
        zIndex: 10,
      }}
    >
      <Text style={{fontFamily: config.font, fontSize: config.fontSize + 4}}>{title}</Text>
      {bodyHTML}
      <View
        style={splash ? {
          position: 'absolute',
          bottom: 4,
        } : {}}
      >
        {buttonHTML}
      </View>
    </View>
  );
}

export default Modal;
