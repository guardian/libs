// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
	preset: 'ts-jest/presets/js-with-ts',
	testEnvironment: 'jest-environment-jsdom',
	clearMocks: true,
	collectCoverage: true,
	collectCoverageFrom: ['src/**/*'],
	coveragePathIgnorePatterns: ['types'],
	transformIgnorePatterns: ['node_modules/(?!@guardian)'],
	testPathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/node_modules/'],
};
