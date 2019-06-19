module.exports = {
  configureWebpack: {
    module: {
      rules: [
        { parser: { amd: false } }
      ]
    }
  },
  css: {
    loaderOptions: {
      sass: {
        data: `
          @import "@/scss/_variables.scss";
        `
      }
    }
  }
}
