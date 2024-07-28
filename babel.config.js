module.exports = function (api) {
  api.cache(true);
  const plugins = [
    ["module-resolver", {
      "root": ["."],
      extensions: ['.ts', '.tsx', '.js', 'jsx', '.ios.js', '.android.js'],
      alias: {
         
          "~/": "*",
      },
    }],
    'react-native-reanimated/plugin'
  ];

  return {
    presets: ['babel-preset-expo'],

    plugins,
  };
};
