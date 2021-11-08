// @flow

/**
 * Entity creation checklist:
 *  - add the entity here keyed by type (in render order)
 *  - add the entities/entityType file to this directory
 *  - add the entities options and arguments to ui/LevelEditor
 *  - if the entity has any special properties, add them to the gameState
 *    initialization and add an updating function for them in the tickReducer
 */


const Entities = {
  WALL: require('./wall.js'),
  BUTTON: require('./button.js'),
  DOOR: require('./door.js'),

  TARGET: require('./target.js'),
  AGENT: require('./agent.js'),
};

module.exports = {
  Entities,
};

