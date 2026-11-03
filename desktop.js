const {app,BrowserWindow,Menu,dialog,globalShortcut,ipcMain,shell,safeStorage}=require('electron');
const path=require('node:path');const {spawn}=require('node:child_process');const {randomUUID}=require('node:crypto');
const {waitForBackend}=require('./startup');const {createPersonalService}=require('./personal/desktop-service');
if(process.env.MEGUBOOM_DATA_DIR)app.setPath('userData',path.resolve(process.env.MEGUBOOM_DATA_DIR));
app.setAppUserModelId('ru.meguboom.desktop');
const port=process.env.MEGUBOOM_PORT||'41873',startupId=randomUUID();let win,backend,personal,quitting=false;
const locked=app.requestSingleInstanceLock();if(!locked)app.quit();
function startupError(error){if(quitting)return;quitting=true;dialog.showErrorBox('MeguBoom не запустился',error.message||String(error));app.quit()}
function createWindow(){
 win=new BrowserWindow({width:1360,height:860,minWidth:980,minHeight:650,backgroundColor:'#120d10',title:'MeguBoom',icon:path.join(__dirname,'assets/app-icon.png'),autoHideMenuBar:true,webPreferences:{contextIsolation:true,nodeIntegration:false,sandbox:true,backgroundThrottling:false,autoplayPolicy:'no-user-gesture-required',preload:path.join(__dirname,'desktop-preload.js')}});
 win.loadURL('http://127.0.0.1:'+port);
 win.webContents.setWindowOpenHandler(({url})=>{try{if(new URL(url).protocol==='https:')shell.openExternal(url)}catch{}return {action:'deny'}});
 win.webContents.on('will-navigate',(event,url)=>{if(!url.startsWith('http://127.0.0.1:'+port+'/'))event.preventDefault()});
 Menu.setApplicationMenu(Menu.buildFromTemplate([{label:'MeguBoom',submenu:[{label:'Выход',role:'quit'}]},{label:'Вид',submenu:[{label:'Перезагрузить',role:'reload'},{label:'Полный экран',role:'togglefullscreen'}]},{label:'Справка',submenu:[{label:'О приложении',click:()=>dialog.showMessageBox(win,{type:'info',title:'MeguBoom',message:'MeguBoom '+app.getVersion()+'\nGoogle Диск и локальная аудиобиблиотека'})}]}]));
 for(const [key,id] of [['MediaPlayPause','play'],['MediaNextTrack','next'],['MediaPreviousTrack','prev']])globalShortcut.register(key,()=>win?.webContents.executeJavaScript("document.getElementById('"+id+"')?.click()"));
}
ipcMain.handle('personal-call',async(event,method,args)=>{if(event.sender!==win?.webContents||event.senderFrame?.parent)return {ok:false,error:'Недопустимый запрос'};if(!personal||!Object.prototype.hasOwnProperty.call(personal.actions,method))return {ok:false,error:'Неизвестное действие'};try{return {ok:true,data:await personal.actions[method](args)}}catch(error){return {ok:false,error:error.message||'Операция не выполнена'}}});
if(locked){app.on('second-instance',()=>{if(win){if(win.isMinimized())win.restore();win.show();win.focus()}});app.whenReady().then(async()=>{try{
 personal=await createPersonalService({app,dialog,shell,safeStorage,send:(channel,value)=>{if(win&&!win.isDestroyed())win.webContents.send(channel,value)}});
 backend=spawn(process.execPath,[path.join(__dirname,'server.js')],{env:{...process.env,ELECTRON_RUN_AS_NODE:'1',PORT:port,MEGUBOOM_STARTUP_ID:startupId},stdio:'ignore'});
 backend.on('error',startupError);backend.on('exit',()=>{if(!quitting)startupError(Error('Встроенный сервер завершился'))});
 await waitForBackend(port,{version:app.getVersion(),startupId});if(!quitting)createWindow();
 }catch(error){startupError(error)}});app.on('activate',()=>{if(!BrowserWindow.getAllWindows().length&&personal)createWindow()})}
app.on('window-all-closed',()=>{if(process.platform!=='darwin')app.quit()});
app.on('before-quit',()=>{quitting=true;globalShortcut.unregisterAll();personal?.close();backend?.kill()});
