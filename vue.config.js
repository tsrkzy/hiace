module.exports = {
  configureWebpack: {
    mode: "development",
    devServer: {
      open: true,
      historyApiFallback: true,
    }
  }
};