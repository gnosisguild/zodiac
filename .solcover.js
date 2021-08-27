module.exports = {
  skipFiles: [
    "test/TestAvatar.sol",
    "test/TestModule.sol",
    "test/TestModifier.sol",
  ],
  mocha: {
    grep: "@skip-on-coverage", // Find everything with this tag
    invert: true, // Run the grep's inverse set.
  },
};
