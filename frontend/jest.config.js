// jest.config.js
export default {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '\\.(jpg|jpeg|png|gif|webp|svg|png)$': '<rootDir>/__mocks__/fileMock.js',
        '^framer-motion$': '<rootDir>/__mocks__/framer-motion.js',
        '^@mui/material/(.*)$': '<rootDir>/node_modules/@mui/material/$1',
    },
    transformIgnorePatterns: [
        '/node_modules/(?!@mui|framer-motion)'
    ]
  };
  