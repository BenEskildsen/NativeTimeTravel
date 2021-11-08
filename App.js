import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {Text, View, Image} from 'react-native';
import Main from './js/ui/Main.react';
const {createStore} = require('redux');
const {rootReducer} = require('./js/reducers/rootReducer');
import { Provider } from 'react-redux';

const store = createStore(rootReducer);
window.store = store; // useful for debugging and a few hacks

export default function App() {
  return (
    <Provider store={store} >
      <Main
        store={store}
        dispatch={store.dispatch}
      />
    </Provider>
  );
}

