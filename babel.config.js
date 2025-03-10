// Required by webpack: OTEL dependencies do not compile nicely otherwise

module.exports = {
    presets: [
        [
          "@babel/preset-env",
          { targets: { node: "current" } }
        ],
    ],
  };