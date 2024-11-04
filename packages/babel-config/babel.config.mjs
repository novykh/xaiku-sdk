const isES6 = process.env.BABEL_ENV === "es6";
const isTest = process.env.NODE_ENV === "test";

export default {
  presets: [
    ["@babel/preset-env", { loose: true, modules: isES6 ? false : "commonjs" }],
    "@babel/preset-react",
  ],
  plugins: [
    "@babel/plugin-transform-spread",
    [
      "module-resolver",
      {
        alias: {
          "@": "./src",
        },
      },
    ],
  ].filter(Boolean),
  env: {
    test: {
      presets: ["@babel/preset-env"],
      plugins: ["@babel/plugin-transform-runtime"],
    },
  },
};
