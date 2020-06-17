'use strict'

import { app, protocol, BrowserWindow,ipcMain,dialog} from 'electron'
const MusicStore = require('./common/js/MusicDataStore')
const myMusic = new MusicStore({name:'iMusic'})
/*隐藏electron创听的菜单栏*/
import {
  createProtocol,
  /* installVueDevtools */
} from 'vue-cli-plugin-electron-builder/lib'
const isDevelopment = process.env.NODE_ENV !== 'production'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{scheme: 'app', privileges: { secure: true, standard: true } }])

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({ width: 990, height: 700,frame: false, webPreferences: {
    // Use pluginOptions.nodeIntegration, leave this alone
    // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
    nodeIntegration: true ,//process.env.ELECTRON_NODE_INTEGRATION
  } })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

  win.on('closed', () => {
    win = null
  })
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})
ipcMain.on("open-dialog",(event,msg)=>{
  console.log(msg)
  dialog.showOpenDialog({
    properties:['openFile','multiSelections'],
    filters: [{ name: 'Music', extensions: ['mp3'] }]
  }).then(function(tracks){
    myMusic.addTracks(tracks.filePaths);
    console.log("持久化音乐列表数据")
    win.send("getTracks",myMusic.getTracks())
  })
})
//删除音乐
ipcMain.on('delete-track',(event,deleteId)=>{
    const updateTracks = myMusic.deleteTrack(deleteId).getTracks();
    win.send("getTracks",updateTracks)
})
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    //
  }
  createWindow()
  win.webContents.on('did-finish-load',()=>{
    win.send("getTracks",myMusic.getTracks())
  })
})
//接收最小化命令
ipcMain.on('window-min', function() {
  win.minimize();
})
//接收最大化命令
ipcMain.on('window-max', function() {
  if (win.isMaximized()) {
    win.restore();
  } else {
    win.maximize();
  }
})
//接收关闭命令
ipcMain.on('window-close', function() {
  win.close();
})
// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
