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
                @import "@/assets/scss/01_base/_headings.scss";
                @import "@/assets/scss/01_base/_reset.scss";
                @import "@/assets/scss/01_base/_root.scss";
                @import "@/assets/scss/02_component/_button.scss";
                @import "@/assets/scss/02_component/_header.scss";
                @import "@/assets/scss/02_component/_search.scss";
                @import "@/assets/scss/02_component/_player.scss";
                @import "@/assets/scss/02_component/_queue.scss";
                @import "@/assets/scss/02_component/_queue-track.scss";
                @import "@/assets/scss/03_page/_home.scss";
                @import "@/assets/scss/03_page/_room.scss";
            `
      }
    }
  },
  chainWebpack: config => {
    const svgRule = config.module.rule("svg");
    svgRule.uses.clear();
    svgRule.use("vue-svg-loader").loader("vue-svg-loader");
  }
};
