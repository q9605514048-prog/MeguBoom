const {spawn}=require('node:child_process');const net=require('node:net');const fs=require('node:fs');const os=require('node:os');const path=require('node:path');
const delay=ms=>new Promise(r=>setTimeout(r,ms));
async function freePort(){const server=net.createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;await new Promise(r=>server.close(r));return port}
(async()=>{
 const port=await freePort(),debugPort=await freePort(),profile=fs.mkdtempSync(path.join(os.tmpdir(),'meguboom-personal-package-'));
 const libraryDir=path.join(profile,'Library');fs.mkdirSync(libraryDir);
 const bytes=Buffer.alloc(44+8000*96,128);bytes.write('RIFF',0);bytes.writeUInt32LE(bytes.length-8,4);bytes.write('WAVEfmt ',8);bytes.writeUInt32LE(16,16);bytes.writeUInt16LE(1,20);bytes.writeUInt16LE(1,22);bytes.writeUInt32LE(8000,24);bytes.writeUInt32LE(8000,28);bytes.writeUInt16LE(1,32);bytes.writeUInt16LE(8,34);bytes.write('data',36);bytes.writeUInt32LE(bytes.length-44,40);
 const library=new(require('../personal/local-library').PersonalLibrary)(path.join(profile,'personal-library.json'),libraryDir);
 for(const [name,kind] of [['Personal Song.wav','music'],['Personal Audiobook.wav','book']]){const file=path.join(libraryDir,name);fs.writeFileSync(file,bytes);library.add(file,{kind})}
 const child=spawn(path.join(__dirname,'../dist/win-unpacked/MeguBoom.exe'),['--remote-debugging-port='+debugPort],{env:{...process.env,MEGUBOOM_PORT:String(port),MEGUBOOM_DATA_DIR:profile,MEGUBOOM_LIBRARY_DIR:path.join(profile,'Library')},windowsHide:true,stdio:'ignore'});
 let socket,counter=0;const pending=new Map();
 function rpc(method,params={}){return new Promise((resolve,reject)=>{const id=++counter,timer=setTimeout(()=>{pending.delete(id);reject(Error('CDP timeout '+method))},90000);pending.set(id,{resolve:value=>{clearTimeout(timer);resolve(value)},reject:error=>{clearTimeout(timer);reject(error)}});socket.send(JSON.stringify({id,method,params}))})}
 async function evaluate(expression){const result=await rpc('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(result.exceptionDetails)throw Error(JSON.stringify(result.exceptionDetails));return result.result.value}
 try{
  let target;for(let i=0;i<100&&!target;i++){try{const pages=await(await fetch('http://127.0.0.1:'+debugPort+'/json')).json();target=pages.find(p=>p.type==='page'&&p.url.startsWith('http://127.0.0.1:'+port))}catch{}if(!target)await delay(200)}
  if(!target)throw Error('Personal app window did not start');
  socket=new WebSocket(target.webSocketDebuggerUrl);await new Promise((resolve,reject)=>{socket.onopen=resolve;socket.onerror=reject});socket.onmessage=event=>{const message=JSON.parse(event.data),entry=pending.get(message.id);if(entry){pending.delete(message.id);message.error?entry.reject(Error(message.error.message)):entry.resolve(message.result)}};
  const health=await(await fetch('http://127.0.0.1:'+port+'/api/health')).json();if(health.version!==require('../package.json').version)throw Error('Wrong app version');console.log('PASS packaged personal startup '+health.version);
  let ready=false;for(let i=0;i<100&&!ready;i++){try{ready=await evaluate("document.readyState==='complete'&&!!document.querySelector('#connect-drive')&&!!window.personal")}catch{}if(!ready)await delay(100)}if(!ready)throw Error('Personal UI did not finish loading');await delay(300);
  const checks=async()=>{
   const expect=(value,message)=>{if(!value)throw Error(message)},$=s=>document.querySelector(s),wait=ms=>new Promise(r=>setTimeout(r,ms));
   const edition=await personal.call('bookDetails',{title:'Возвышение Хоруса (с звуковым оформлением)',author:'Дэн Абнетт'});expect(edition?.description?.includes('Хорус'),'Packaged edition synopsis failed');const status=await personal.call('status');expect(!status.drive.connected&&!status.drive.configured,'Isolated profile unexpectedly authenticated');
   expect(!document.querySelector('iframe')&&!document.querySelector('[data-view="books"]'),'Old external player still present');
   document.querySelector('[data-view="drive"]').click();expect($('#connect-drive').disabled,'Google login should require OAuth client JSON');
   expect(!$('#discover')&&!document.querySelector('[data-view="discover"]'),'External discovery remains');
   expect((await fetch('/assets/app-icon.png')).headers.get('content-type')==='image/png','Packaged app icon not served');expect($('#drive-kind'),'Drive media selector missing');expect((await fetch('/api/discover')).status===404,'Discovery endpoint remains');
   for(const method of ['discover','download']){let denied=false;try{await personal.call(method,{})}catch{denied=true}expect(denied,'External IPC action remains: '+method)}
   const files=await personal.call('listLocal');expect(files.length===2&&files.some(t=>t.kind==='book'),'Own music and audiobook missing');
   return {id:files[0].id,title:files[0].title};
  };
  const saved=await evaluate('('+checks.toString()+')()');await rpc('Page.reload');await delay(1500);
  const playChecks=async()=>{
   const expect=(value,message)=>{if(!value)throw Error(message)},$=s=>document.querySelector(s);
   const items=await personal.call('listLocal');const track=items.find(t=>t.storage==='local'&&t.kind==='music');expect(track,'Own music lost after reload');document.querySelector('[data-view="library"]').click();
   const button=[...$('#library-list').querySelectorAll('[data-play]')].find(b=>b.dataset.play===track.id);expect(button,'Stored file not displayed');const audio=$('#audio');audio.muted=true;button.click();
   const waitFor=(predicate,message)=>new Promise((resolve,reject)=>{const end=Date.now()+20000,timer=setInterval(()=>{if(predicate()){clearInterval(timer);resolve()}else if(audio.error||Date.now()>end){clearInterval(timer);reject(Error(message+': '+$('#status').textContent))}},100)});
   await waitFor(()=>audio.currentTime>.2&&audio.duration>80,'Local audio did not decode');
   expect(new URL(audio.src).hostname==='127.0.0.1','Playback bypassed local storage');audio.currentTime=61;await waitFor(()=>audio.currentTime>61.5,'Playback failed after 61 seconds');audio.pause();
   const favorite=[...$('#library-list').querySelectorAll('[data-favorite]')].find(b=>b.dataset.favorite===track.id);favorite.click();const add=[...$('#library-list').querySelectorAll('[data-add]')].find(b=>b.dataset.add===track.id);add.click();expect(JSON.parse(localStorage.getItem('meguboom-playlist')).includes(track.id),'Playlist was not persisted');
   $('#kind-filter').value='book';$('#kind-filter').dispatchEvent(new Event('change'));expect($('#library-list').textContent.includes('Personal Audiobook')&&!$('#library-list').textContent.includes('Personal Song'),'Audiobook filter failed');
   $('#library-list [data-play]').click();await waitFor(()=>$('#now-title').textContent==='Personal Audiobook'&&audio.currentTime>.1,'Audiobook playback failed');audio.currentTime=62;await waitFor(()=>audio.currentTime>62.2,'Audiobook seeking failed');audio.pause();$('#kind-filter').value='all';$('#kind-filter').dispatchEvent(new Event('change'));
   document.querySelector('[data-view="library"]').click();return 'PASS local music and audiobook playback, no external catalog UI/API/IPC; duration '+Math.round(audio.duration)+'s, playback after '+Math.floor(audio.currentTime)+'s; favorite and playlist';
  };
  console.log(await evaluate('('+playChecks.toString()+')()'));
  const shot=await rpc('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(os.tmpdir(),'meguboom-personal-packaged.png'),Buffer.from(shot.data,'base64'));
  await rpc('Page.reload');await delay(1000);
  console.log(await evaluate("(()=>{if(!JSON.parse(localStorage.getItem('meguboom-playlist')||'[]').some(id=>id.startsWith('local-')))throw Error('Playlist lost');return 'PASS personal settings restored; live Google Drive not tested without OAuth credentials'})()"));
 }finally{if(socket?.readyState===WebSocket.OPEN){socket.send(JSON.stringify({id:++counter,method:'Runtime.evaluate',params:{expression:'window.close()'}}));await delay(250);socket.close()}for(let i=0;i<30&&child.exitCode===null;i++)await delay(100);if(child.exitCode===null)spawn('taskkill',['/PID',String(child.pid),'/T','/F'],{windowsHide:true,stdio:'ignore'})}
})().catch(error=>{console.error(error);process.exitCode=1});
