(function(root){
  function nextId({ids,currentId,direction=1,ended=false,repeat='off'}){
    const unique=[...new Set(ids)];
    if(!unique.length)return null;
    const index=unique.indexOf(currentId);
    if(ended&&repeat==='one'&&index>=0)return currentId;
    const next=index<0?(direction>0?0:unique.length-1):index+direction;
    if(ended&&repeat==='off'&&(next<0||next>=unique.length))return null;
    return unique[(next+unique.length)%unique.length];
  }
  function shuffleIds(ids,currentId,random=Math.random){const rest=[...new Set(ids)].filter(id=>id!==currentId);for(let i=rest.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[rest[i],rest[j]]=[rest[j],rest[i]]}return ids.includes(currentId)?[currentId,...rest]:rest}
  const api={nextId,shuffleIds};if(typeof module==='object'&&module.exports)module.exports=api;else root.queueUtils=api;
})(typeof globalThis==='object'?globalThis:this);
