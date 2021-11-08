// @flow

const config = {
  cellWidth: 32,
  cellHeight: 32,
  canvasWidth: 640,
  canvasHeight: 640,
  useFullScreen: true,

  msPerTick: 40,
  animationDuration: 500, // in ms

  buttonColors: [
    'red', 'teal', 'green',
    'pink', 'orange', 'blue',
    'brown', 'beige', 'purple',
  ],
  openDoorCutoff: 2, // levels below this will start with doors closed

  audioFiles: [
    {path: require('../audio/timetravelmainmenu1.mp3'), type: 'mp3'},
    {path: require('../audio/timetravelmainmenu1ext.mp3'), type: 'mp3'},
  ],

  font: 'Cochin',
  // font: 'Copperplate',
};

module.exports = {config};
