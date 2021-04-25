const { createFile, install, addScript, runScript } = require("..")

module.exports = {
   name: "Eslint & Prettier Setup",
   tags: ["eslint", "prettier", "lint", "typescript"],
   description:
      "This script installs eslint + prettier and creates their config",
   questions: [
      {
         title: "Does your project use TypeScript?",
         type: "boolean",
         name: "typescript",
      },
      {
         title: "Does your project use React?",
         type: "boolean",
         name: "react",
      },
      {
         title: "Require semicolons?",
         type: "boolean",
         default: false,
         name: "semi",
      },
      {
         title: "Tab width?",
         type: "number",
         default: 4,
         name: "tabWidth",
      },
      {
         title: "Single quote (' instead of \")?",
         type: "boolean",
         default: true,
         name: "singleQuote",
      },
      {
         title: "Bracket spacing ( { name } instead of {name})?",
         type: "boolean",
         default: true,
         name: "bracketSpacing",
      },
      {
         title: "Arrow Parens ( (name) => {} instead of name => {} )?",
         type: "boolean",
         default: false,
         name: "arrowParens",
      },
      {
         title: "Trailing Comma?",
         type: "boolean",
         default: false,
         name: "trailingComma",
      },
   ],
   templates: {
      eslint: (args) => ({
         env: {
            browser: args.react,
            es6: true,
            node: true,
         },
         root: true,
         parser: args.typescript ? "@typescript-eslint/parser" : undefined,
         parserOptions: {
            ecmaVersion: 2021,
            sourceType: "module",
            ecmaFeatures: {
               jsx: args.react,
            },
         },
         extends: args.typescript
            ? [
                 "eslint:recommended",
                 "plugin:@typescript-eslint/recommended",
                 "prettier",
              ]
            : ["eslint:recommended", "prettier"],
         rules: {
            "no-unused-vars": args.typescript ? "off" : undefined,
            "no-nested-ternary": "off",

            "no-return-await": "error",

            "@typescript-eslint/no-unused-vars": args.typescript
               ? [
                    "error",
                    { vars: "all", args: "all", argsIgnorePattern: "^_" },
                 ]
               : undefined,
         },
      }),
      prettier: (args) => ({
         semi: args.semi || false,
         tabWidth: args.tabWidth || 4,
         useTabs: false,
         singleQuote: args.singleQuote || true,
         bracketSpacing: args.bracketSpacing || true,
         arrowParens: args.arrowParens ? "always" : "avoid" || "avoid",
         jsxBracketSameLine: true,
         jsxSingleQuote: false,
         trailingComma: args.trailingComma ? "all" : "none" || "none",
         overrides: args.typescript
            ? [
                 {
                    files: "*.ts",
                    options: { parser: "typescript" },
                 },
              ]
            : [],
      }),
   },
   handler: async function (args) {
      console.log(args)
      await createFile(".eslintrc.js", this.templates.eslint, args)
      await createFile(".prettierrc", this.templates.prettier, args)
      await createFile(".eslintignore", "node_modules/")
      await install(
         [
            "eslint",
            "eslint-config-prettier",
            "prettier",
            ...(args.typescript
               ? [
                    "@typescript-eslint/eslint-plugin",
                    "@typescript-eslint/parser",
                    "typescript",
                 ]
               : []),
         ],
         { dev: true }
      )
      await addScript("lint", "eslint .")
      await runScript("lint")
   },
}
