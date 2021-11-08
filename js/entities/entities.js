// @flow

let entityID = 0;

const makeEntity = () => {
  return {
    id: entityID++,
    actionQueue: [],
  };
};

const touchEntityID = (max) => {
  if (max) {
    entityID = max + 1;
  } else {
    entityID++;
  }
};

module.exports = {
  makeEntity,
  touchEntityID,
};
