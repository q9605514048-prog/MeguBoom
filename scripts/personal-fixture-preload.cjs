const {contextBridge}=require('electron');
let connected=true;const callbacks=[];const files=[{id:'local-one',title:'Local Song',artist:'Ado',storage:'local',kind:'music',name:'Ado - Local Song.wav',size:768044,available:true}];
const bytes=new Uint8Array(44+8000*96),dv=new DataView(bytes.buffer);const text=(offset,s)=>[...s].forEach((c,i)=>bytes[offset+i]=c.charCodeAt(0));text(0,'RIFF');dv.setUint32(4,bytes.length-8,true);text(8,'WAVEfmt ');dv.setUint32(16,16,true);dv.setUint16(20,1,true);dv.setUint16(22,1,true);dv.setUint32(24,8000,true);dv.setUint32(28,8000,true);dv.setUint16(32,1,true);dv.setUint16(34,8,true);text(36,'data');dv.setUint32(40,bytes.length-44,true);bytes.fill(128,44);
const audioURL=URL.createObjectURL(new Blob([bytes],{type:'audio/wav'}));
contextBridge.exposeInMainWorld('personal',{
 onJob:fn=>{callbacks.push(fn);return ()=>{}},
 call:async(method,args)=>{switch(method){
 case 'status':return {drive:{configured:true,connected,connecting:false},version:'0.5.1-fixture',libraryDirectory:'C:/Music/MeguBoom'};
 case 'listLocal':return [...files];
 case 'driveInfo':return {user:{displayName:'Тестовый Диск'},storageQuota:{limit:String(5*1099511627776),usage:String(1073741824)}};
 case 'listDrive':return args.pageToken?{files:[{id:'drive-three',fileId:'three',title:'Third file',artist:'Ado',name:'Ado - Third.mp3',storage:'drive',kind:'music',canDownload:true}],nextPageToken:null}:{files:[{id:'drive-one',fileId:'one',title:'Cloud Song',artist:'Ado',name:'Ado - Cloud Song.mp3',storage:'drive',kind:'music',canDownload:true},{id:'drive-blocked',fileId:'blocked',title:'Restricted',artist:'Artist',name:'Restricted.mp3',storage:'drive',kind:'music',canDownload:false}],nextPageToken:'page-two'};
 case 'playback':return {url:audioURL};
 case 'uploadLocal':return {id:'drive-uploaded',fileId:'uploaded',title:'Local Song',artist:'Ado',name:'Local Song.mp3',storage:'drive',kind:'music',canDownload:true};
 case 'downloadDrive':{const item={id:'local-cloud',title:'Cloud Song',artist:'Ado',storage:'local',kind:'music',available:true};if(!files.some(f=>f.id===item.id))files.push(item);for(const cb of callbacks)cb({id:'job-one',type:'download',title:'Cloud Song',state:'done',progress:1});return item}
 case 'disconnectDrive':connected=false;return {};
 case 'importLocal':return {added:[],duplicates:0,skipped:0};
 case 'jobs':return [];
 case 'openLibrary':return '';
 default:return {};
 }}
});
