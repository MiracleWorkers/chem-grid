module.exports = {
  devServer: {
    port: '8081'
  },
  chainWebpack: config => {
    config.entryPoints
      .clear()
      .end()
      .entry('app')
      .add('./example/main.js');
  }
};
