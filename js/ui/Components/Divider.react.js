// @flow

import React from 'react';
import {Text, View} from 'react-native';

type Props = {

};

function Divider(props: Props): React.Node {
  const {style} = props;
  return (
    <View
      style={{
        width: '100%',
        height: '0px',
        border: '1px solid black',
        ...style,
      }}
    >
    </View>
  );
}

export default Divider;
