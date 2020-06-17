const path = require('path')
module.exports = {
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'sass',
      patterns: [
        path.resolve(__dirname, './src/assets/styles/*.scss')      //你的.scss文件所在目录
      ]
    },
    electronBuilder: {
      "builderOptions": {
        "appId": "wenqd.github.io",
        "productName":"IMusic",
        "copyright":"Copyright © 2020",
        /* "directories":{
            "output":"./dist"
        }, */
        "win":{
            "icon":"./public/logo.ico",
            "target": [
                {
                    "target": "nsis",
                    "arch": [
                        "x64",
                        "ia32"
                    ]
                }
            ]
        }
      }
    }
  }
}