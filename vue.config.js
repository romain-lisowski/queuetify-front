module.exports = {
  configureWebpack: {
    resolve: {
      alias: require("./aliases.config").webpack
    }
  },
  css: {
    loaderOptions: {
        sass: {
            data: `
                @import "@/assets/scss/00_var/_color.scss";
                @import "@/assets/scss/00_var/_font.scss";
                @import "@/assets/scss/00_var/_media-queries.scss";
                @import "@/assets/scss/01_base/_misc.scss";
                @import "@/assets/scss/01_base/_reset.scss";
                @import "@/assets/scss/01_base/_root.scss";
            `
        }
    }
  },
  chainWebpack: (config) => {
    const svgRule = config.module.rule('svg');

    svgRule.uses.clear();

    svgRule
    .use('vue-svg-loader')
    .loader('vue-svg-loader');
  }
};
