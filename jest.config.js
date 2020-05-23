process.env.REALM_DISABLE_ANALYTICS = 'true';

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["<rootDir>/tests/**/?(*.)+(spec|test).[jt]s?(x)"],
  coveragePathIgnorePatterns: ["/node_modules/", "<rootDir>/tests/helpers/"],
};
