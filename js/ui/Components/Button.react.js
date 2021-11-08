import React from 'react';
import {Text, View, Button, TouchableOpacity} from 'react-native';
const {config} = require('../../config');

// props:
// id: ?string
// label: string
// onClick: () => void
// onMouseDown: optional () => void
// onMouseUp: optional () => void
// disabled: optional boolean
// style: optional Object

function CustomButton(props) {
  const id = props.id || props.label;

  return (
    <View
      style={{
        // touchAction: 'initial',
        backgroundColor: 'rgb(239, 239, 239)',
        color: 'darkslategrey',
        borderStyle: 'outset',
        borderWidth: '2px',
        boxSizing: 'border-box',
        borderColor: 'rgb(118, 118, 188)',
        ...props.style,
      }}
    >
      <TouchableOpacity
        title={props.label}
        style={{
          touchAction: 'initial',
          marginTop: 2,
          marginBottom: 2,
        }}
        key={id || label}
        className={props.disabled ? 'buttonDisable' : ''}
        id={id.toUpperCase() + '_button'}
        onPress={props.disabled ? () => {} : props.onClick}
        disabled={props.disabled}
      >
        <Text
          style={{
            fontSize: 18,
            fontFamily: config.font,
            textAlign: 'center',
          }}
        >
          {props.label}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default CustomButton;
