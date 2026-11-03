(function(root){
  function formatTime(value){const seconds=Math.max(0,Math.floor(Number(value)||0));if(!Number.isFinite(seconds))return '--:--';const s=String(seconds%60).padStart(2,'0');const m=Math.floor(seconds/60)%60;return seconds>=3600?Math.floor(seconds/3600)+':'+String(m).padStart(2,'0')+':'+s:m+':'+s}
  function resumePosition(position,duration){const n=Number(position);if(!Number.isFinite(n)||n<0)return 0;if(Number.isFinite(duration)&&n>=duration-0.5)return 0;return n}
  const api={formatTime,resumePosition};if(typeof module==='object')module.exports=api;else root.playerUtils=api;
})(globalThis);
