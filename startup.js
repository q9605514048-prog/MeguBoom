const http=require('node:http');
function waitForBackend(port,expected,{timeout=15000,interval=100}={}){
 return new Promise((resolve,reject)=>{
  let settled=false,request;
  const deadline=setTimeout(()=>finish(new Error('Сервер не запустился вовремя.')),timeout);
  function finish(error){if(settled)return;settled=true;clearTimeout(deadline);request?.destroy();error?reject(error):resolve()}
  function check(){
   if(settled)return;
   request=http.get(`http://127.0.0.1:${port}/api/health`,response=>{
    let body='';response.on('data',chunk=>{body+=chunk;if(body.length>4096)finish(new Error('Неожиданный ответ сервера.'))});
    response.on('end',()=>{try{const data=JSON.parse(body);if(response.statusCode!==200||data.app!=='MeguBoom'||data.version!==expected.version||data.startupId!==expected.startupId)throw Error('Порт занят другой копией приложения. Закрой её и повтори запуск.');finish()}catch(error){finish(error)}});
    response.on('error',error=>finish(error));
   });
   request.on('error',()=>{if(!settled)setTimeout(check,interval)});
   request.setTimeout(1000,()=>request.destroy());
  }
  check();
 });
}
module.exports={waitForBackend};
