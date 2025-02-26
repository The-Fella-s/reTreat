// jest.config.js
module.exports = {
    roots: ['<rootDir>/tests'], // or adjust if your tests are elsewhere
    testMatch: [
        '**/tests/**/*.[jt]s?(x)',
        '**/?(*.)+(spec|test).[tj]s?(x)'
    ],
    testEnvironment: 'node',
};
