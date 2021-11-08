// @flow
///////////////////////////////////////////////////////////////////
// General

export type Vector = {x: number, y: number};
export type EntityID = number;

export type Entity = {
  id: EntityID,
  actionQueue: Array<EntityAction>,
}

export type Animation = {
  tick: number, // current progress in the animation
  duration: number, // total length of the animation
};

export type EntityAction = {
  type: 'MOVE' | 'REVERSE_TIME' | 'STUCK' | 'REACHED_TARGET' | 'OPEN' | 'CLOSE' | 'PRESS',
  animation: ?Animation,
  payload: ?Object,
};


///////////////////////////////////////////////////////////////////
// Entities

export type Agent = Entity & {
  history: Array<Vector>,
  isPlayerAgent: boolean,
  facing: 'left' | 'right' | 'up' | 'down',
}

export type Wall = Entity & {
  orientation: 'horizontal' | 'vertical',
  start: Vector, // left -> right or top -> bottom (small x/y -> big x/y)
  end: Vector, // walls should never be diagonal
  isVisible: ?boolean,
};

export type Door = Wall & {
  doorID: number,
  open: boolean,
};

export type Button = Entity & {
  position: Vector,
  doorID: number,
  pressed: boolean,
};

export type Target = Entity & {
  position: Vector,
  reached: number,
  isVisible: boolean,
};

///////////////////////////////////////////////////////////////////
// Game

export type GameState = {
  time: number,
  prevTime: number, // prevTime > time when you just reversed time
  numReversals: number,
  level: number, // which level you're on
  stepLimit: number,

  entities: {[EntityID]: Entity},
  // EntityTypes
  AGENT: {[EntityID]: Agent}, // 0th agent is player-controlled
  WALL: {[EntityID]: Wall},
  DOOR: {[EntityID]: Door},
  BUTTON: {[EntityID]: Button},
  TARGET: {[EntityID]: Button},

  tickInterval: ?mixed,
  prevTickTime: number, // for tracking durations in ms

  hotKeys: {[string]: () => void},
  sprites: {[string]: mixed},

  moveAttempts: {
    left: boolean,
    right: boolean,
    up: boolean,
    down: boolean,
    reverseTime: boolean,
  },
};

///////////////////////////////////////////////////////////////////
// State

export type State = {
  screen: 'LOBBY' | 'GAME' | 'EDITOR',
  game: ?Game,
  editor: ?Object,
  sprites: {[string]: mixed},
}
