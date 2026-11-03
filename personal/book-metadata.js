const covers=require('./book-covers.json');
const information=require('./book-info.json');
const synopses=require('./book-synopses.json');
const clean=value=>String(value||'').normalize('NFKC').toLowerCase().replace(/ё/g,'е').replace(/[^а-яa-z0-9]/g,'');
const escape=value=>String(value||'').replace(/[|\\{}()[\]^$+*?.-]/g,'\\$&');
function titleFrom(name,series=''){
 let title=String(name||'').replace(/\.(mp3|m4a|m4b|ogg|wav|flac|aac|opus)$/i,'').replace(/_/g,' ').trim();
 const labels=series.split(' / ').map(x=>x.replace(/^\d+\.?\s*/,'').trim()).filter(Boolean);
 for(let i=0;i<5;i++){const before=title;title=title.replace(/^\d+(?:\.\d+)*(?:\+\d+(?:\.\d+)*)?\.\s*/,'');for(const label of labels)title=title.replace(new RegExp('^'+escape(label)+'[. :] *','i'),'');title=title.replace(/^Ересь Хоруса[. :] */i,'').trim();if(title===before)break}
 return title.replace(/\s*\(ИИ озвучка\)\s*/ig,' ').replace(/\s*[—-]\s*копия\s*$/i,'').replace(/\s+/g,' ').trim();
}
function coverFor(title){const wanted=clean(title);if(covers[wanted])return covers[wanted];const match=Object.keys(covers).filter(key=>key.length>8&&(wanted.endsWith(key)||key.endsWith(wanted))).sort((a,b)=>b.length-a.length)[0];return match?covers[match]:'personal/book-placeholder.svg'}
function enrich(track,path){const parts=String(path||track.name||'').split('\\'),series=parts.slice(0,-1).join(' / ');if(!series)return track;const title=titleFrom(parts.at(-1),series),info={...(information[clean(title)]||{}),...(synopses[clean(title)]||{})};return {...track,title,series,artist:info.author||series,author:info.author||'',description:info.description||'',descriptionType:info.descriptionType||'',metadataSource:info.source||'',year:info.year||'',kind:'book',cover:coverFor(title),catalogPath:path}}
module.exports={enrich,titleFrom,coverFor};
