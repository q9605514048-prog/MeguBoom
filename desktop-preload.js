const {contextBridge,ipcRenderer}=require('electron');
contextBridge.exposeInMainWorld('personal',{
 call:async(method,args)=>{const result=await ipcRenderer.invoke('personal-call',method,args);if(!result.ok)throw Error(result.error);return result.data},
 onJob:handler=>{const listener=(_,value)=>handler(value);ipcRenderer.on('personal-job',listener);return ()=>ipcRenderer.removeListener('personal-job',listener)}
});
