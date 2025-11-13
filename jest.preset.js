const nxPreset = require('@nx/jest/preset').default;

module.exports = {
  ...nxPreset,
  transform: {
    ...nxPreset.transform,
    '^.+\\.html$': 'ts-jest',
  },
};
