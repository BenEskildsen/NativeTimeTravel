// @flow

const {subtract} = require('../utils/vectors');
const {filterObj, forEachObj} = require('../utils/helpers');

const getPlayerAgent = (game) => {
  for (let entityID of Object.keys(game.AGENT)) {
    const agent = game.AGENT[entityID];
    if (agent.isPlayerAgent) {
      return agent;
    }
  }
  console.log("no player agent found");
  return null;
};

const hitsWall = (game, curPos: Coord, nextPos: Coord): boolean => {
  const wallCollisions = filterObj({...game.WALL, ...game.DOOR}, (wall) => {
    if (wall.open) {
      return false;
    }
    if (curPos.x !== nextPos.x && wall.orientation == 'vertical') {
      const startDist = curPos.x - wall.start.x;
      const endDist = nextPos.x - wall.start.x;
      return curPos.y >= wall.start.y && curPos.y < wall.end.y && startDist != endDist &&
        ((startDist == -1 && endDist == 0) || (startDist == 0 && endDist == -1))
    } else if (curPos.y !== nextPos.y && wall.orientation == 'horizontal') {
      const startDist = curPos.y - wall.start.y;
      const endDist = nextPos.y - wall.start.y;
      return curPos.x >= wall.start.x && curPos.x < wall.end.x && startDist != endDist &&
        ((startDist == -1 && endDist == 0) || (startDist == 0 && endDist == -1))
    }
    return false;
  });
  return Object.keys(wallCollisions).length > 0;
}

const getTarget = (game) => {
  for (let entityID in game.TARGET) {
    return game.TARGET[entityID];
  }
}

const getKeyFromDir = (dir) => {
  if (dir.y == -1) return 'up';
  if (dir.y == 1) return 'down';
  if (dir.x == -1) return 'left';
  if (dir.x == 1) return 'right';
};

const getDirFromKey = (key) => {
  if (key == 'up') return {y: -1};
  if (key == 'down') return {y: 1};
  if (key == 'left') return {x: -1};
  if (key == 'right') return {x: 1};
};

const getMoveDirFromPositions = (curPos, nextPos) => {
  const dir = subtract(nextPos, curPos);
  if (dir.x == 0) delete dir.x;
  if (dir.y == 0) delete dir.y;
  return {dir, key: getKeyFromDir(dir)};
};

const getNextDoorID = (game) => {
  let doorID = -1;
  forEachObj(game.DOOR, (door) => {
    if (door.doorID > doorID) {
      doorID = door.doorID;
    }
  });
  return doorID + 1;
};

module.exports = {
  getPlayerAgent,
  hitsWall,
  getTarget,
  getKeyFromDir,
  getDirFromKey,
  getMoveDirFromPositions,
  getNextDoorID,
};
