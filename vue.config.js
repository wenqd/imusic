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
        "asar": true,
        "copyright":"Copyright © 2020",
        "compression": "maximum",// "store" | "normal"| "maximum" 打包压缩情况(store 相对较快)，
        /* "directories":{
            "output":"./dist"
        }, */
        "win":{
            "icon":"./public/logo.ico",
            "target": [
                {
                    "target": "nsis",
                    "arch": [
                        /* "x64", */
                        "ia32"
                    ]
                }
            ]
        },
        "nsis": {
            "oneClick": false, // 一键安装
            "perMachine": true, // 是否开启安装时权限限制（此电脑或当前用户）
            "allowElevation": true, // 允许请求提升。 如果为false，则用户必须使用提升的权限重新启动安装程序。
            "allowToChangeInstallationDirectory": true, // 允许修改安装目录
            "installerIcon": "./public/logo.ico", // 安装图标
            "uninstallerIcon": "./public/logo.ico", //卸载图标
            "installerHeaderIcon": "./public/logo.ico", // 安装时头部图标
            "createDesktopShortcut": true, // 创建桌面图标
            "createStartMenuShortcut": true, // 创建开始菜单图标
            "shortcutName": "IMusic" // 图标名称
        },
       "mac":{
        'icon': './public/icon.icns',
        "category": "public.app-category.music",
        "artifactName": "${productName}-${version}-${arch}.${ext}"
       },
        'dmg': {
          'title': 'I Music',
          "background": "./public/appdmg.png",
          'icon': './public/icon.icns',
          "iconSize":'100',
          'contents': [
            {
              'x': 110,
              'y': 280
            },
            {
              'x': 380,
              'y': 280,
              'type': 'link',
              'path': '/Applications'
            }
          ],
          'window': {
            'x': 500,
            'y': 520
          }
        }
      }
    }
  }
}