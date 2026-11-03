const {titleFrom}=require('./book-metadata');
// Only presentation/voice labels are removed; real subtitles stay part of the identity.
function canonicalTitle(value){let title=titleFrom(String(value||''));const edition=/\s*[\[(](?:с(?:о)?\s+(?:звуковым|музыкальным)\s+(?:оформлением|сопровождением)|ии[\s-]*(?:озвучка|озвучивание)|нейроозвучка|озвучено\s+ии)[\])]\s*$/i;for(let i=0;i<3;i++){const next=title.replace(edition,'').trim();if(next===title)break;title=next;}return title;}
module.exports={canonicalTitle};
