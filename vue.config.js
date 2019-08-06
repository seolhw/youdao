const path = require('path')
module.exports = {
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        path.resolve(__dirname, './src/common/style.less'),
      ]
    },
    electronBuilder: {
      builderOptions:{
        "appId":"youdao",
        "productName":"有道简易版",
        "win": {    //windows下安装软件配置参数
            "target": [
                "nsis",  //打包为nsis安装文件
                // "zip"   //打包为安装文件zip
                ,
            ]
        },
        "publish": [
          {
            "provider": "generic",
            "url": "http://127.0.0.1:5500/",//隐藏版本服务器地址
          }
        ],
        "nsis": {   //nsis配置参数
            "oneClick": false,    //可单击打开
            "allowToChangeInstallationDirectory": true,    //允许用户选择安装位置
            "perMachine": true
        }
      }
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