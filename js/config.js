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

  menuAudioFiles: [
    // {path: require('../audio/timetravelmainmenu1.mp3'), type: 'mp3'},
    {path: require('../audio/timetravelmainmenu1ext.mp3'), type: 'mp3'},
  ],
  gameAudioFiles: [
    {name: 'GAME_1', path: require('../audio/timetravelingame3.mp3'), type: 'mp3'},
    {name: 'GAME_2', path: require('../audio/timetravelingame2.mp3'), type: 'mp3'},
  ],
  gameLossAudioFiles: [
    {name: 'LOSS_1', path: require('../audio/timetravelingame1.mp3'), type: 'mp3'},
  ],
  effectAudioFiles: [
    {name: 'RUMBLE', path: require('../audio/rumble1.mp3'), type: 'mp3'},
    {name: 'REVERSE_TIME', path: require('../audio/reversetime1.mp3'), type: 'mp3'},
  ],

  font: 'Cochin',
  fontSize: 18,
  // font: 'Copperplate',
};

module.exports = {config};
