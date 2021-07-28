module.exports = {
    root: true,
    env: {
        es2020: true,
        node: true,
    },
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 2020,
    },
    plugins: ["@typescript-eslint", "import", "prettier"],
    extends: [
        "eslint:recommended",
        "plugin:import/recommended",
        "plugin:import/typescript",
        "plugin:@typescript-eslint/recommended",
        "plugin:prettier/recommended",
        "prettier/@typescript-eslint",
    ],
    ignorePatterns: ["build/", "node_modules/", "!.prettierrc.js"],
    rules: {
        "import/order": [
            "error",
            {
                "newlines-between": "always",
                alphabetize: {
                    order: "asc",
                },
            },
        ],
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-empty-function": "off",
    },
};
