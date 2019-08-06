const path = require('path')
module.exports = {
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        path.resolve(__dirname, './src/common/style.less'),
      ]
    }
  },
  devServer: {
    overlay: {
      warnings: true,
      errors: true
    },
    // proxy: {
    //   '/api': {
    //     target: 'https://openapi.youdao.com',
    //     secure: false,
    //     changeOrigin: true,
    //   }
    // }
  },
  lintOnSave: false
}