// .eslintrc.js
module.exports = {
    env: {
        browser: true,
        node: true,
        jest: true, // This line tells ESLint that your code will run in a Jest environment
    },
    settings: {
        react: {
            version: "detect", // React version. "detect" automatically picks the version you have installed.
        },
    },
    overrides: [
        {
            files: ["**/*.js", "**/*.jsx"],
            extends: ["eslint:recommended", "plugin:react/recommended"],
            parserOptions: {
                ecmaVersion: 2022,
                sourceType: "module",
            },
            rules: {
                // Add your custom rules here
            },
        },
    ],
};