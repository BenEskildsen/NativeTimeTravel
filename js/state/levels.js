// @flow

const {Entities} = require('../entities/registry');
const {touchEntityID} = require('../entities/entities');
const {deepCopy} = require('../utils/helpers');
const {initGameState} = require('./state');

const importLevel = (jsonRaw, levelNum) => {
  const json = deepCopy(jsonRaw);
  if (!json.entities) json.entities = {};
  let maxEntityID = 1;
  for (const entityType in Entities) {
    for (const entityID in json[entityType]) {
      json.entities[entityID] = json[entityType][entityID];
      if (parseInt(entityID) > maxEntityID) {
        maxEntityID = parseInt(entityID);
      }
    }
  }
  touchEntityID(maxEntityID);

  return {
    ...initGameState(),
    ...json,
    level: levelNum || 0,
  };
};

const getLevel = (levelNum) => {
  const nextLevel = allLevels[Object.keys(allLevels)[levelNum]];
  return importLevel(nextLevel, levelNum);
};

const initDefaultLevel = () => {
  const game = initGameState();

  addEntity(game, Entities.AGENT.make([{x: 3, y: 0}], true));

  for (let i = 0; i <= 6; i++) {
    addEntity(game, Entities.WALL.make({x: i, y: 0}, {x: i + 1, y: 0}));
    addEntity(game, Entities.WALL.make({x: i, y: 7}, {x: i + 1, y: 7}));
    addEntity(game, Entities.WALL.make({x: 0, y: i}, {x: 0, y: i + 1}));
    addEntity(game, Entities.WALL.make({x: 7, y: i}, {x: 7, y: i + 1}));
  }

  addEntity(game, Entities.TARGET.make({x: 6, y: 6}));
  return game;
}

const addEntity = (game, entity) => {
  game[entity.type][entity.id] = entity;
  game.entities[entity.id] = entity;
};

const allLevels = {
  level1: {...require('../levels/level1')},
  level2: {...require('../levels/level2')},
  level3: {...require('../levels/level3')},
  testLevel2: {...initDefaultLevel()},
  testLevel: {...require('../levels/testLevel')},
};

module.exports = {
  getLevel,
  initDefaultLevel,
  importLevel,
  allLevels,
};
