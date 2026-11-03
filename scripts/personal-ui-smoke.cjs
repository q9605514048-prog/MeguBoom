const {app,BrowserWindow}=require('electron');const path=require('node:path');const fs=require('node:fs');const os=require('node:os');
app.whenReady().then(async()=>{const errors=[];const win=new BrowserWindow({show:false,width:1360,height:860,webPreferences:{partition:'personal-ui-'+Date.now(),preload:path.join(__dirname,'personal-fixture-preload.cjs'),backgroundThrottling:false}});win.webContents.on('console-message',(_,level,message)=>{if(level>=3&&!message.includes('ERR_FILE_NOT_FOUND'))errors.push(message)});try{
 await win.loadFile(path.join(__dirname,'../index.html'));await new Promise(r=>setTimeout(r,300));
 const checks=async()=>{const expect=(v,m)=>{if(!v)throw Error(m)},$=s=>document.querySelector(s),tick=()=>new Promise(r=>setTimeout(r,100));
  expect(!document.querySelector('iframe')&&!document.querySelector('[data-view="books"]'),'External playback remains');
  $('[data-view="library"]').click();expect($('#library-list').textContent.includes('Local Song'),'Native library missing');
  $('#library-list [data-favorite="local-one"]').click();$('#library-list [data-add="local-one"]').click();expect(JSON.parse(localStorage.getItem('meguboom-playlist')).includes('local-one'),'Playlist not saved');
  $('#audio').muted=true;$('#library-list [data-play="local-one"]').click();for(let i=0;i<50&&$('#audio').currentTime===0;i++)await tick();expect($('#audio').currentTime>0&&$('#now-title').textContent==='Local Song','Local audio did not play: '+$('#status').textContent);
  $('#audio').currentTime=61;await tick();expect($('#audio').currentTime>61,'Seek after one minute failed');$('#play').click();expect($('#audio').paused,'Pause failed');
  $('[data-view="drive"]').click();$('#drive-kind').value='music';$('#drive-kind').dispatchEvent(new Event('change'));expect($('#drive-list').textContent.includes('Cloud Song'),'Drive listing missing');expect($('#drive-list [data-play="drive-blocked"]').disabled,'Restricted cloud audio enabled');
  $('#drive-next').click();await tick();expect($('#drive-list').textContent.includes('Third file'),'Drive pagination failed');$('#drive-first').click();await tick();
  expect(!$('#discover')&&!document.querySelector('[data-view="discover"]')&&!document.querySelector('[data-download]'),'External discovery remains');
  $('#drive-list [data-offline="drive-one"]').click();await tick();await tick();$('[data-view="library"]').click();expect($('#library-list').textContent.includes('Cloud Song'),'Offline Drive file not in personal library');
  $('[data-view="downloads"]').click();expect($('#jobs').textContent.includes('Готово'),'Download job not shown');
  const imported=await localLibrary.import('meguboom-music',[new File([new Uint8Array(64)],'Legacy Song.mp3',{type:'audio/mpeg'})]);localStorage.setItem('legacy-test-id',imported.added[0].id);
  return 'PASS local playback/seek, storage-only UI, playlist, cloud pagination, access restriction and Drive offline copy';
 };
 console.log(await win.webContents.executeJavaScript('('+checks.toString()+')()'));
 const loaded=new Promise(r=>win.webContents.once('did-finish-load',r));win.reload();await loaded;await new Promise(r=>setTimeout(r,250));
 console.log(await win.webContents.executeJavaScript("(()=>{document.querySelector('[data-view=\"library\"]').click();if(!document.querySelector('#library-list').textContent.includes('Legacy Song')||!JSON.parse(localStorage.getItem('meguboom-playlist')).includes('local-one'))throw Error('Legacy migration or playlist restore failed');return 'PASS legacy IndexedDB files and playlist preserved after reload'})()"));
 for(const width of [1360,980]){win.setSize(width,860);await new Promise(r=>setTimeout(r,120));await win.webContents.executeJavaScript("(()=>{const player=document.querySelector('.player').getBoundingClientRect(),controls=document.querySelector('.controls').getBoundingClientRect(),now=document.querySelector('.now').getBoundingClientRect();if(now.right>controls.left+1||controls.right>player.right+1||document.documentElement.scrollWidth>innerWidth)throw Error('Layout overlap')})()");console.log('PASS personal layout '+width+'px');fs.writeFileSync(path.join(os.tmpdir(),'meguboom-personal-library-'+width+'.png'),(await win.webContents.capturePage()).toPNG())}
 await win.webContents.executeJavaScript("document.querySelector('[data-view=\"drive\"]').click()");await new Promise(r=>setTimeout(r,150));fs.writeFileSync(path.join(os.tmpdir(),'meguboom-personal-drive.png'),(await win.webContents.capturePage()).toPNG());
 if(errors.some(e=>/SyntaxError|ReferenceError|TypeError/.test(e)))throw Error(errors.join('\n'));app.exit(0);
 }catch(error){console.error(error);app.exit(1)}});
