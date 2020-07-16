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
const&nbsp;fs&nbsp;=&nbsp;window.require("fs");&nbsp;let&nbsp;musicAudio&nbsp;=&nbsp;new&nbsp;Audio();&nbsp;let&nbsp;data&nbsp;=&nbsp;fs.readFileSync(music.filePath);&nbsp;let&nbsp;musicBlob&nbsp;=&nbsp;new&nbsp;Blob(\[data\],&nbsp;{&nbsp;type:&nbsp;"audio/x-mpeg"&nbsp;});&nbsp;musicAudio.src&nbsp;=&nbsp;URL.createObjectURL(musicBlob);
```

  

  

  

  

*   随机播放、单曲循环、调节音量、调整播放进度等
    

### 打包：

打包exe/dmg格式的包已配好，在对应平台下执行electron:build即可  

  

  

  

```
"win":{&nbsp;"icon":"./public/logo.ico",&nbsp;"target":&nbsp;\[&nbsp;{&nbsp;"target":&nbsp;"nsis",&nbsp;"arch":&nbsp;\[&nbsp;/*&nbsp;"x64",&nbsp;*/&nbsp;"ia32"&nbsp;\]&nbsp;}&nbsp;\]&nbsp;},&nbsp;"nsis":&nbsp;{&nbsp;"oneClick":&nbsp;false,&nbsp;//&nbsp;一键安装&nbsp;"perMachine":&nbsp;true,&nbsp;//&nbsp;是否开启安装时权限限制（此电脑或当前用户）&nbsp;"allowElevation":&nbsp;true,&nbsp;//&nbsp;允许请求提升。&nbsp;如果为false，则用户必须使用提升的权限重新启动安装程序。&nbsp;"allowToChangeInstallationDirectory":&nbsp;true,&nbsp;//&nbsp;允许修改安装目录&nbsp;"installerIcon":&nbsp;"./public/logo.ico",&nbsp;//&nbsp;安装图标&nbsp;"uninstallerIcon":&nbsp;"./public/logo.ico",&nbsp;//卸载图标&nbsp;"installerHeaderIcon":&nbsp;"./public/logo.ico",&nbsp;//&nbsp;安装时头部图标&nbsp;"createDesktopShortcut":&nbsp;true,&nbsp;//&nbsp;创建桌面图标&nbsp;"createStartMenuShortcut":&nbsp;true,&nbsp;//&nbsp;创建开始菜单图标&nbsp;"shortcutName":&nbsp;"IMusic"&nbsp;//&nbsp;图标名称&nbsp;},&nbsp;"mac":{&nbsp;'icon':&nbsp;'./public/icon.icns',&nbsp;"category":&nbsp;"public.app-category.music",&nbsp;"artifactName":&nbsp;"${productName}-${version}-${arch}.${ext}"&nbsp;},&nbsp;'dmg':&nbsp;{&nbsp;'title':&nbsp;'I&nbsp;Music',&nbsp;"background":&nbsp;"./public/appdmg.png",&nbsp;'icon':&nbsp;'./public/icon.icns',&nbsp;"iconSize":'100',&nbsp;'contents':&nbsp;\[&nbsp;{&nbsp;&nbsp;&nbsp;'x':&nbsp;110,&nbsp;&nbsp;&nbsp;'y':&nbsp;280&nbsp;},&nbsp;{&nbsp;&nbsp;&nbsp;'x':&nbsp;380,&nbsp;&nbsp;&nbsp;'y':&nbsp;280,&nbsp;&nbsp;&nbsp;'type':&nbsp;'link',&nbsp;&nbsp;&nbsp;'path':&nbsp;'/Applications'&nbsp;}&nbsp;\],&nbsp;'window':&nbsp;{&nbsp;'x':&nbsp;500,&nbsp;'y':&nbsp;520&nbsp;}&nbsp;}&nbsp;}
```

  

  

功能截图：

本地音乐列表

  

![](https://user-gold-cdn.xitu.io/2020/7/5/1731f59f1a33d502?w=1485&amp;h=1050&amp;f=png&amp;s=80397)  

加载歌单音乐

  

![](https://user-gold-cdn.xitu.io/2020/7/5/1731f5b2af95b051?w=1485&amp;h=1050&amp;f=png&amp;s=177928)  

歌词及专辑封面展示：

  

![](https://user-gold-cdn.xitu.io/2020/7/5/1731f5be86bb1801?w=1485&amp;h=1050&amp;f=png&amp;s=1164795)