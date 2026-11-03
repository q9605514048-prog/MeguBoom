(function(root){
 const valid=k=>['music','book'].includes(k);
 function classify(item,assignments={}){if(valid(assignments['file:'+item.id]))return assignments['file:'+item.id];for(const id of [...(item.parentIds||[])].reverse())if(valid(assignments['folder:'+id]))return assignments['folder:'+id];return valid(item.kind)?item.kind:'unassigned'}
 function select(items,source,kind,query='',assignments={}){const words=String(query).toLocaleLowerCase('ru').replace(/ё/g,'е').trim().split(/\s+/).filter(Boolean);return items.filter(i=>i.storage===source&&classify(i,assignments)===kind&&words.every(w=>[i.title,i.name,i.author,i.artist,i.series].join(' ').toLocaleLowerCase('ru').replace(/ё/g,'е').includes(w))).sort((a,b)=>String(a.catalogPath||a.name||a.title).localeCompare(String(b.catalogPath||b.name||b.title),'ru',{numeric:true}))}
 const api={classify,select};if(typeof module==='object'&&module.exports)module.exports=api;else root.mobileLibrary=api;
})(globalThis);
