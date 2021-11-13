// @flow

const React = require('react');
import {Text, View, Image, Dimensions} from 'react-native';
import Button from './Components/Button.react';
import TopBar from './TopBar.react';
import initGameOverSystem from '../systems/gameOverSystem';
const {initSpriteSheetSystem} = require('../systems/spriteSheetSystem');
const {initKeyboardControlsSystem} = require('../systems/keyboardControlsSystem');
const {initMouseControlsSystem} = require('../systems/mouseControlsSystem');
const {config} = require('../config');
const {add, equals} = require('../utils/vectors');
const {useEffect, useState, useMemo, Component, memo} = React;
const {
  getPlayerAgent, getTarget, getDirFromKey, hitsWall,
} = require('../selectors/selectors');
const {makeAction} = require('../entities/actions');
const {
  getFloorSprite, getFrame,
} = require('../render/sprites');

import type {Action, State} from '../types';

type Props = {
  dispatch: (action: Action) => Action,
  store:  Object,
  isInLevelEditor: boolean,
  topBar: mixed,
  controlButtons: mixed,
};

function Game(props: Props): React.Node {
  const {isInLevelEditor, gameID, state} = props;
  // const state = store.getState();
  const dispatch = store.dispatch;

  // init systems
  useEffect(() => {
    // initKeyboardControlsSystem(store);
    // if (state.game.isExperimental) {
    //   initMouseControlsSystem(store,
    //     {leftDown: (s, d, gridPos) => {
    //       d({type: 'SET_SELECTED_POSITION', pos: gridPos});
    //     }}
    //   );
    // }
    initGameOverSystem(store);
    // registerHotkeys(dispatch);
  }, [gameID]);

  const {game} = state;

  return (
    <View
      className="background" id="background"
      style={{
        position: 'relative',
        display: 'inline-block',
        width: '100%',
      }}
    >
      <RenderSprites
        game={game}
      />
      <TopBar dispatch={dispatch}
        isExperimental={props.isInLevelEditor}
        modal={state.modal}
        isMuted={state.isMuted}
        stepsRemaining={game.stepLimit - game.time}
        isTimeReversed={game.isTimeReversed}
        numReversals={game.numReversals}
        level={game.level}
        soundEffect={game.soundEffect}
        levelAudio={game.levelAudio}
      />
      <Controls
        dispatch={dispatch}
        isInLevelEditor={props.isInLevelEditor}
        store={store}
      />
    </View>
  );
}

const Controls = (props) => {
  const {store, dispatch, isInLevelEditor} = props;
  if (isInLevelEditor) return null;
  const {modal} = store.getState();

  return (
    <View>
      <View
        style={{
          position: 'absolute',
          bottom: 70,
          left: 8,
          zIndex: 3,
        }}
      >
        <Button
          label="Reverse Time"
          onClick={() => reverseTime(store)}
          style={{width: 125}}
          disabled={modal != null}
        />
      </View>
      <View
        style={{
          position: 'absolute',
          bottom: 40,
          right: 8,
        }}
      >
        <Button
          label="^"
          onClick={() => up(store)}
          style={{width: 125}}
          disabled={modal != null}
        />
        <View
          style={{
            flexDirection: 'row',
            marginTop: 5,
            marginBottom: 5,
          }}
        >
          <Button
            label="<"
            onClick={() => left(store)}
            style={{
              marginRight: 5,
              width: 60,
            }}
            disabled={modal != null}
          />
          <Button
            label=">"
            onClick={() => right(store)}
            style={{
              width: 60,
            }}
            disabled={modal != null}
          />
        </View>
        <Button
          label="v"
          onClick={() => down(store)}
          style={{width: 125}}
          disabled={modal != null}
        />
      </View>
    </View>
  );
};

// ------------------------------------------------------------
// HTML Render
// -------------------------------------------------------------

const RenderSprites = ({game}) => {
  let sprites = [];

  const size = Dimensions.get('window').height / game.gridHeight;

  // FLOOR
  const floorSprites = useMemo(() => {
    const toReturn = [];
    const floorWidth = 1;
    const floorHeight = 1;
    for (let x = 0; x < game.gridWidth; x += floorWidth) {
      for (let y = 0; y < game.gridHeight; y += floorHeight) {
        let width = x + floorWidth - game.gridWidth - 1;
        if (width <= 0) width = floorWidth
        let height = y + floorHeight - game.gridHeight - 1;
        if (height <= 0) height = floorHeight
        if (x < 0 && (y % 2) == 0) continue;
        const grid = {
          x, y,
          width, height,
          size,
        };
        toReturn.push(<Sprite
          key={"floor_" + x + "_" + y}
          src={require('../../assets/floorsheet3.png')}
          sheet={{x: 0, y: 0, width: 1, height: 1, size: size}}
          grid={grid}
        />);
      }
    }
    return toReturn;
  }, [game.level]);
  sprites.push(...floorSprites);

  // BUTTON
  for (const entityID in game.BUTTON) {
    const button = game.BUTTON[entityID];
    const sheet = {
      x: (button.doorID % 3),
      y: Math.floor(button.doorID / 3),
      width: 4,
      height: 3,
      size: size * 0.7,
    };
    let yOffset = 0;
    if (button.pressed) {
      if (sheet.y == 0) yOffset = 0.2;
      if (sheet.y == 1) yOffset = 0.2;
      if (sheet.y == 2) yOffset = -0.1;
    }
    const grid = {
      x: button.position.x * 10/7 + 0.2,
      y: (button.position.y * 10/7) + yOffset + 0.2,
      width: 1, height: button.pressed ? 0.9 : 1,
      size: size * 0.7,
    };

    sprites.push(<Sprite
      key={"entityID_" + entityID}
      src={button.pressed
        ? require('../../assets/pressedSheet2.png')
        : require('../../assets/buttonSheet2.png')
      }
      grid={grid}
      sheet={sheet}
    />);
  }

  // WALL
  const wallSprites = useMemo(() => {
    const toReturn = [];
    // initial pass for main sections of the walls
    for (const entityID in game.WALL) {
      const wall = game.WALL[entityID];
      const {orientation, start, end, isVisible} = wall;
      if (!isVisible) continue;
      const offAxisSize = 1/3;

      const grid = {
        x: orientation == 'horizontal' ? start.x : start.x - offAxisSize / 2,
        y: orientation == 'vertical' ? start.y : start.y - offAxisSize / 2,
        width: orientation == 'horizontal' ? 1 : offAxisSize,
        height: orientation == 'vertical' ? 1 : offAxisSize,
        size,
      }
      const sheet = {
        x: orientation == 'horizontal' ? 0 : 3,
        y: orientation == 'vertical' ? 0 : 3,
        width: 4, height: 4,
        size: 16,
      }
      toReturn.push(<Sprite
        key={"entityID_" + entityID}
        src={require('../../assets/wall1.png')}
        grid={grid}
        sheet={sheet}
      />);
    }
    // pass over all the vertices
    for (let x = 0; x < game.gridWidth + 1; x++) {
      for (let y = 0; y < game.gridHeight + 1; y++) {
        let numNeighbors = 0;
        for (const entityID in game.WALL) {
          const wall = game.WALL[entityID];
          if (
            (wall.start.x == x && wall.start.y == y) ||
            (wall.end.x == x && wall.end.y == y)
          ) {
            numNeighbors++;
          }
        }
        if (numNeighbors == 0) continue;
        const offAxisSize = 1/3;
        const sheet = {
          x: 3,
          y: 3,
          width: 4, height: 4,
          size: 16,
        }
        const grid = {
          x: x - offAxisSize / 2,
          y: y - offAxisSize / 2,
          width: offAxisSize,
          height: offAxisSize,
          size,
        }
        toReturn.push(<Sprite
          key={"wallSpot_" + x + '_' + y}
          src={require('../../assets/wall1.png')}
          grid={grid}
          sheet={sheet}
        />);
      }
    }

    return toReturn;
  }, [game.level]);
  sprites.push(...wallSprites);

  // DOOR
  for (const entityID in game.DOOR) {
    const door = game.DOOR[entityID];
    const {start, orientation, open} = door;
    const offAxisSize = open ? 1/8 : 1/3;
    const sheet = {
      x: 1, y: 0,
      width: 2, height: 2,
      size,
    };
    const grid = {
      x: orientation == 'horizontal' ? start.x : start.x - offAxisSize / 2,
      y: orientation == 'vertical' ? start.y : start.y - offAxisSize / 2,
      width: orientation == 'horizontal' ? 1 : offAxisSize,
      height: orientation == 'vertical' ? 1 : offAxisSize,
      size,
    };

    sprites.push(<Sprite
      key={"entityID_" + entityID}
      src={require('../../assets/gate1.png')}
      grid={grid}
      sheet={sheet}
    />);
    sprites.push(<View
      key={"entityID_div" + entityID}
      style={{
        position: 'absolute',
        top: grid.y * grid.size,
        left: grid.x * grid.size,
        width: grid.width * grid.size,
        height: grid.height * grid.size,
        backgroundColor: config.buttonColors[door.doorID],
        opacity: 0.4,
      }}
    />);
  }

  // TARGET
  for (const entityID in game.TARGET) {
    const target = game.TARGET[entityID];
    const sheet = {
      x: 1, y: 0,
      width: 3, height: 1,
      size,
    };
    const grid = {
      ...target.position,
      width: 1, height: 1,
      size,
    }

    sprites.push(<Sprite
      key={"entityID_" + entityID}
      src={require('../../assets/exclamations1.png')}
      grid={grid}
      sheet={sheet}
    />);
  }

  // AGENT
  let playerAgentInterPos = {x: 0, y: 0};
  for (const entityID in game.AGENT) {
    const agent = game.AGENT[entityID];

    let position = agent.history[game.time];
    const curAction = agent.actionQueue[0];
    if (!position) {
      if (agent.isPlayerAgent) {
        position = agent.history[0];
      }
      if (curAction && curAction.type == 'GO_BACK_IN_TIME') {
        position = agent.history[agent.history.length - 1];
      }

      if (position == null) continue;
    }
    const interPosition = {...position};
    let opacity = 1;
    let key = agent.facing;

    if (curAction != null) {
      const animation = curAction.animation;
      if (curAction.type == 'MOVE') {
        const dir = curAction.payload.dir;
        const interp = 1 - animation.tick / animation.duration;
        if (dir.x) {
          if (dir.x < 0) {
            interPosition.x += dir.x * interp + 1;
          } else if (dir.x > 0) {
            interPosition.x += dir.x * interp - 1;
          }
        }
        if (dir.y) {
          if (dir.y < 0) {
            interPosition.y += dir.y * interp + 1;
          } else if (dir.y > 0) {
            interPosition.y += dir.y * interp - 1;
          }
        }
        if (agent.isPlayerAgent) {
          playerAgentInterPos = interPosition;
        }
      } else if (curAction.type == 'GO_BACK_IN_TIME' || curAction.type == 'REACH_TARGET') {
        const interp = 1 - animation.tick / animation.duration;
        key = ['left', 'up', 'right', 'down'][Math.max(0, Math.round(interp * 4 - 1))];
        if (!agent.isPlayerAgent) {
          opacity = game.isTimeReversed ? interp : 1 - interp;
        }
      } else if (curAction.type == 'RUMBLE') {
        const interp = Math.sin(10 * (1 - animation.tick / animation.duration)) / 4 + 0.1;
        const dir = getDirFromKey(key);
        if (dir.x) {
          if (dir.x < 0) {
            interPosition.x += dir.x * interp;
          } else if (dir.x > 0) {
            interPosition.x += dir.x * interp;
          }
        }
        if (dir.y) {
          if (dir.y < 0) {
            interPosition.y += dir.y * interp;
          } else if (dir.y > 0) {
            interPosition.y += dir.y * interp;
          }
        }
      }
    }
    const frame = getFrame(game, {...agent, facing: key});
    let x = frame.x;
    let y = frame.y;
    let style = !agent.isPlayerAgent ? null :
      {
        // boxShadow: '0 0 0 5000px rgba(0, 0, 0, 0.25)',
        // shadowColor: 'black',
        // shadowOpacity: 1,
        // shadowRadius: 50000,
        // shadowOffset: {width: 0, height: 0},
        // borderRadius: '100%',
        // backgroundColor: 'rgba(200, 200, 200, 1)',
        // opacity: 0.5
      };

    sprites.push(<Sprite
      style={style}
      key={"entityID_" + entityID}
      src={require('../../assets/characterSheet3.png')}
      grid={{...interPosition, width: 1, height: 1, size}}
      sheet={{x, y, width: 5, height: 4, size}}
      opacity={opacity}
      useLarge={agent.isPlayerAgent}
    />);
  }


  // darken squares
  const playerPos = getPlayerAgent(game).history[game.time];
  const darkenSprites = useMemo(() => {
    const toReturn = [];
    const darkenGrid = [];
    for (let x = 0; x < game.gridWidth; x++) {
      const darkenRow = [];
      for (let y = 0; y < game.gridHeight; y++) {
        darkenRow.push(true);
      }
      darkenGrid.push(darkenRow);
    }
    for (let x = 0; x < game.gridWidth; x++) {
      for (let y = 0; y < game.gridHeight; y++) {
        if (equals(playerPos, {x, y})) {
          darkenGrid[x][y] = false;
          const dirs = [{x:0,y:1},{x:0,y:-1},{x:1,y:0},{x:-1,y:0}];
          for (let i = 0; i < 4; i++) {
            const pos = add(playerPos, dirs[i]);
            if (!hitsWall(game, playerPos, pos)) {
              darkenGrid[pos.x][pos.y] = false;
            }
          }
        }
      }
    }
    for (let x = 0; x < game.gridWidth; x++) {
      for (let y = 0; y < game.gridHeight; y++) {
        if (!darkenGrid[x][y]) continue;
        toReturn.push(<View
          key={'darken_' + x + '_' + y}
          style={{
            width: size, height: size,
            position: 'absolute',
            top: y * size,
            left: x * size,
            backgroundColor: 'black',
            opacity: 0.3,
          }}
        />);
      }
    }
    return toReturn;
  }, [playerPos.x, playerPos.y]);
  sprites.push(...darkenSprites);


  const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;
  return (
    <View
      style={{
        width: height,
        height,
        marginLeft: (width - height) / 2,
        position: 'relative',
        backgroundColor: 'rgb(136, 118, 99)',
        zIndex: 0,
      }}
    >
      {sprites}
    </View>
  );
};

const Sprite = (props) => {
  const {src, grid, sheet, style, useLarge} = props;
  const imgStyle = style ? style : {};

  // const multiplier = props.useLarge ? 3 : 1;
  // const offset = props.useLarge ? -1 : 0;
  const multiplier = 3;
  const offset = -1;
  return (
    <View
      style={{
        position: 'absolute',
        top: (grid.y + offset) * grid.size,
        left: (grid.x + offset)* grid.size,
        padding: grid.size,
        ...imgStyle,
        width: grid.width * grid.size * multiplier,
        height: grid.height * grid.size * multiplier,
      }}
    >
      <View
        style={{
          display: 'inline-block',
          position: 'relative',
          overflow: props.overflow ? 'default' : 'hidden',
          width: grid.width * grid.size,
          height: grid.height * grid.size,
          border: props.border ? '1px solid red': 'none',
        }}
      >
        <Image
          style={{
            position: 'absolute',
            top: sheet.y * sheet.size * -1 ,
            left: sheet.x * sheet.size * -1,
            width: sheet.width * sheet.size,
            height: sheet.height * sheet.size,
            opacity: props.opacity != null ? props.opacity : 1,
          }}
          source={src}
        />
      </View>
    </View>
  );
};

// ------------------------------------------------------------
// Hotkeys
// -------------------------------------------------------------

function registerHotkeys(dispatch) {
  dispatch({
    type: 'SET_HOTKEY', press: 'onKeyDown',
    key: 'space',
    fn: reverseTime,
  });
  dispatch({
    type: 'SET_HOTKEY', press: 'onKeyDown',
    key: 'up',
    fn: up,
  });
  dispatch({
    type: 'SET_HOTKEY', press: 'onKeyDown',
    key: 'down',
    fn: down,
  });
  dispatch({
    type: 'SET_HOTKEY', press: 'onKeyDown',
    key: 'left',
    fn: left,
  });
  dispatch({
    type: 'SET_HOTKEY', press: 'onKeyDown',
    key: 'right',
    fn: right,
  });
}

const up = (s) => {
  const game = s.getState().game;
  const dispatch = s.dispatch;
  if (game.paused) return;
  const action = makeAction('MOVE', {dir: {y: -1}, key: 'up'});
  dispatch({type: 'ENQUEUE_ACTION', entityID: getPlayerAgent(game).id, action});
};

const down = (s) => {
  const game = s.getState().game;
  const dispatch = s.dispatch;
  if (game.paused) return;
  const action = makeAction('MOVE', {dir: {y: 1}, key: 'down'});
  dispatch({type: 'ENQUEUE_ACTION', entityID: getPlayerAgent(game).id, action});
};

const left = (s) => {
  const game = s.getState().game;
  const dispatch = s.dispatch;
  if (game.paused) return;
  const action = makeAction('MOVE', {dir: {x: -1}, key: 'left'});
  dispatch({type: 'ENQUEUE_ACTION', entityID: getPlayerAgent(game).id, action});
};

const right = (s) => {
  const game = s.getState().game;
  const dispatch = s.dispatch;
  if (game.paused) return;
  const action = makeAction('MOVE', {dir: {x: 1}, key: 'right'});
  dispatch({type: 'ENQUEUE_ACTION', entityID: getPlayerAgent(game).id, action});
};

const reverseTime = (s) => {
  const game = s.getState().game;
  const dispatch = s.dispatch;
  const playerChar = getPlayerAgent(game);
  if (!playerChar) return;
  if (game.isTimeReversed) return;
  if (playerChar.actionQueue.length > 0) return;
  if (game.paused) return;

  const action = makeAction('REVERSE_TIME');
  dispatch({type: 'ENQUEUE_ACTION', entityID: getTarget(game).id, action});
  // dispatch({type: 'ENQUEUE_ACTION', entityID: playerChar.id, action});
};

export default Game;
