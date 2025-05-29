export default {
	transform: {
		"^.+\\.(m?js|ts)$": "babel-jest",
	},
	testPathIgnorePatterns: ["/node_modules/"],
    collectCoverage: true,
    coverageDirectory: "coverage",
	coverageDirectory: 'docs/componet/coverage',
};
