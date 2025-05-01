// jest.config.js
const path = require('path');

module.exports = {
  roots: ['<rootDir>/tests'],
  testMatch: [
    '**/tests/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[tj]s?(x)',
  ],
  testEnvironment: 'node',

  moduleDirectories: ['node_modules', path.join(__dirname, 'backend')],
};
