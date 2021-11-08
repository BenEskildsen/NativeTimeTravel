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

  const buttonHTML = buttons.map(b => {
    return (<Button
      key={"b_" + b.label}
      disabled={!!b.disabled}
      label={b.label} onClick={b.onClick}
      style={{width: 200, marginLeft: width / 2 - 103}}
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
          style={{visibility: i < bodyIndex ? 'inherit' : 'hidden'}}
          key={"body_letter_" + i}
        >
          {body[i]}
        </Text>
      );
    }
  }
  bodyHTML = splash ? bodyHTML :
    (<Text style={{fontFamily: config.font}}>{bodyHTML}</Text>);

  return (
    <View
      style={{
        position: 'absolute',
        backgroundColor: 'whitesmoke',
        border: '1px solid black',
        padding: 4,
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
      <Text style={{fontFamily: config.font}}>{title}</Text>
      {bodyHTML}
      <View
        style={{

        }}
      >
        {buttonHTML}
      </View>
    </View>
  );
}

export default Modal;
