&gt; 越洒脱越放不下，明天总要微笑啊。

使用模块：

vue-cli-plugin-electron-builder

node-ids

vuex

已实现功能：

  

1.  添加播放本地音乐
    
2.  在线音乐搜索（以下在线接口来自网易云音乐api）
    
3.  登陆功能
    
4.  获取登陆人歌单
    
5.  滚动歌词及展示专辑海报
    

### 基础功能：

  

*   本地音乐信息获取（专辑封面，歌手等）：使用node-id3 模块获取
    

  

  

*   本地音乐播放url获取：
    

  

  

  

  

```
const fs = window.require("fs");
let musicAudio = new Audio();
let data = fs.readFileSync(music.filePath);
let musicBlob = new Blob([data], { type: "audio/x-mpeg" });
musicAudio.src = URL.createObjectURL(musicBlob);
```

  

  

  

  

*   随机播放、单曲循环、调节音量、调整播放进度等
    

### 打包：

打包exe/dmg格式的包已配好，在对应平台下执行electron:build即可  

  

  

  

```
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
```

  

  

功能截图：

本地音乐列表

  

![](https://user-gold-cdn.xitu.io/2020/7/5/1731f59f1a33d502?w=1485&amp;h=1050&amp;f=png&amp;s=80397)  

加载歌单音乐

  

![](https://user-gold-cdn.xitu.io/2020/7/5/1731f5b2af95b051?w=1485&amp;h=1050&amp;f=png&amp;s=177928)  

歌词及专辑封面展示：

  

![](https://user-gold-cdn.xitu.io/2020/7/5/1731f5be86bb1801?w=1485&amp;h=1050&amp;f=png&amp;s=1164795)