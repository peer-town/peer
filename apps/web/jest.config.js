const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  collectCoverage: true,
  collectCoverageFrom: [
    'src/components/**/*.{js,jsx,ts,tsx}',
    'src/utils/*.{js,jsx,ts,tsx}',
    'src/store/*.{js,jsx,ts,tsx}',
    '!src/{store,components}/**/index.{js,jsx,ts,tsx}',
    // library issue, cannot test connect wallet
    '!src/components/Button/ConnectWallet/ConnectWalletButton.tsx'
  ],
  coverageDirectory: 'coverage',
  testEnvironment: 'jsdom',
  preset: 'ts-jest',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper:{
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    '\\.(gif|ttf|eot|svg)$': '<rootDir>/__mocks__/fileMock.ts'
  },
  transformIgnorePatterns: [
    '/node_modules'
  ],
  // TODO: add threshold once enough % ;)
};

module.exports = createJestConfig(customJestConfig)
