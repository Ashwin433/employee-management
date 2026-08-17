const eslint = require("@eslint/js");

module.exports = [
    eslint.configs.recommended,
    {
        files: ["**/*.js"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "commonjs",
            globals: {
                console: "readonly",
                process: "readonly",
                require: "readonly",
                module: "readonly",
                __dirname: "readonly"
            }
        },
        rules: {
            "no-unused-vars": "warn"
        }
    }
];
