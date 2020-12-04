// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'jest-environment-jsdom-sixteen',
	clearMocks: true,
	collectCoverage: true,
	collectCoverageFrom: ['src/**/*'],
	coveragePathIgnorePatterns: ['types'],
};
