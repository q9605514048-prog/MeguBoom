(function(root){'use strict';const ROOT='CONFIGURE_DRIVE_FOLDER_ID';
function allowed(b){return !!b&&b.allowedRoot===ROOT&&/^[a-zA-Z0-9_-]{1,200}$/.test(b.fileId||'')&&(b.storage==='drive'||b.storage==='local'&&b.downloadOf==='drive-'+b.fileId)}
function project(state,ids){const positions={},completed=[];for(const id of ids){const r=state.entries?.[id];if(!r)continue;positions[id]={position:r.completed?0:r.positionMs,duration:r.durationMs};if(r.completed)completed.push(id)}return {positions,completed}}
const api={ROOT,allowed,project};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.phoneModel=api;
})(typeof window!=='undefined'?window:globalThis);
