const test=require('node:test'),assert=require('node:assert/strict');
const {DriveAuth}=require('../personal/drive-auth');
test('a pending refresh cannot replace the access token of a newly connected account',async()=>{
 let release,opened;
 const gate=new Promise(resolve=>release=resolve),openedPromise=new Promise(resolve=>opened=resolve);
 const auth=new DriveAuth({
  store:{read:()=>({client:{clientId:'project.apps.googleusercontent.com'},tokens:{refresh_token:'refresh-A',expiresAt:0}}),write(){}},
  openExternal:async url=>opened(new URL(url)),
  fetchImpl:async(_url,options)=>{
   if(options.body.get('grant_type')==='refresh_token'){await gate;return Response.json({access_token:'access-A',expires_in:3600})}
   return Response.json({refresh_token:'refresh-B',access_token:'access-B',expires_in:3600});
  }
 });
 const oldRefresh=auth.accessToken().then(value=>({value}),error=>({error}));
 const connecting=auth.connect();
 try{
  const url=await openedPromise,callback=new URL(url.searchParams.get('redirect_uri'));
  callback.searchParams.set('state',url.searchParams.get('state'));
  callback.searchParams.set('code','account-B');
  const response=await fetch(callback);assert.equal(response.status,200);await connecting;
  release();await oldRefresh;
  assert.equal(auth.state.tokens.refresh_token,'refresh-B');
  assert.equal(auth.state.tokens.access_token,'access-B');
  assert.equal(await auth.accessToken(),'access-B');
 }finally{release();auth.cancel?.();await oldRefresh;await connecting.catch(()=>{})}
});
