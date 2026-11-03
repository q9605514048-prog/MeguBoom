package ru.meguboom.mobile;

import android.app.Activity;
import android.os.Handler;
import android.os.Looper;
import android.content.Intent;
import android.content.SharedPreferences;
import com.google.android.gms.auth.api.identity.*;
import com.google.android.gms.common.api.Scope;
import org.json.*;
import java.net.*;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.concurrent.*;

/** Google credentials stay in the native layer; GIS owns the persisted authorization. */
final class DriveClient {
 interface Listener { void state(JSONObject state); }
 interface CollectionsListener { void result(JSONArray items); }
 interface TokenAction { void run(String token,int generation); }
 final Activity activity; final SharedPreferences prefs; final Listener listener;
 final ExecutorService io=Executors.newSingleThreadExecutor();
 volatile int generation=0; private String token=""; private long expires=0; boolean authorizing=false;
 TokenAction pending; final Handler timer=new Handler(Looper.getMainLooper()); Runnable authTimeout;
 DriveClient(Activity a,Listener l){activity=a;listener=l;prefs=a.getSharedPreferences("drive",0);}
 void emit(Object... values){JSONObject s=new JSONObject();try{for(int i=0;i<values.length;i+=2)s.put((String)values[i],values[i+1]);listener.state(s);}catch(JSONException ignored){}}
 boolean connected(){return prefs.getBoolean("connected",false);}
 void connect(boolean interactive){if(interactive){if(authorizing)return;generation++;token="";expires=0;prefs.edit().putBoolean("connected",false).apply();NativeProgress.get(activity).disconnect();}withToken((t,g)->{prefs.edit().putBoolean("connected",true).apply();emit("connected",true,"loading",false,"error","");NativeProgress.get(activity).request(true,null);browse(FolderAccess.ROOT,new JSONArray());},interactive);}
 void withToken(TokenAction action,boolean interactive){
  if(!token.isEmpty()&&System.currentTimeMillis()<expires){action.run(token,generation);return;}
  if(authorizing){emit("connected",connected(),"loading",true,"error","");return;}
  authorizing=true;pending=action;final int current=generation;authTimeout=()->{if(current==generation&&authorizing){generation++;fail("Время входа истекло. Попробуйте подключить Google Диск заново.");}};timer.postDelayed(authTimeout,180000);
  emit("connected",connected(),"loading",true,"error","");
  AuthorizationRequest request=AuthorizationRequest.builder().setRequestedScopes(NativeProgress.SCOPES).build();
  Identity.getAuthorizationClient(activity).authorize(request).addOnSuccessListener(result->{
   if(current!=generation)return;
   if(result.hasResolution()){
    if(!interactive){fail("Нужно подтвердить доступ. Нажмите «Подключить Google Диск».");emit("needsAuthorization",true);return;}
    try{activity.startIntentSenderForResult(result.getPendingIntent().getIntentSender(),31,null,0,0,0);}catch(Exception e){fail("Не удалось открыть вход Google");}
   }else accepted(result);
  }).addOnFailureListener(e->{if(current==generation)fail("Не удалось войти в Google. Проверьте интернет, сервисы Google Play и регистрацию Android-приложения в проекте конфига.");});
 }
 void accepted(AuthorizationResult result){
  if(!authorizing)return;String value=result.getAccessToken();
  if(value==null||value.isEmpty()){fail("Google не выдал доступ к Диску");return;}
  if(authTimeout!=null)timer.removeCallbacks(authTimeout);token=value;emit("connected",true,"loading",false,"needsAuthorization",false,"error","");expires=System.currentTimeMillis()+50*60*1000L;authorizing=false;prefs.edit().putBoolean("connected",true).apply();
  TokenAction action=pending;pending=null;if(action!=null)action.run(token,generation);
 }
 void result(int resultCode,Intent data){if(!authorizing)return;if(resultCode!=Activity.RESULT_OK||data==null){fail("Вход в Google отменён");return;}try{accepted(Identity.getAuthorizationClient(activity).getAuthorizationResultFromIntent(data));}catch(Exception e){fail("Google не подтвердил доступ. Проверьте Android-клиент и разрешение Drive API.");}}
 void fail(String message){if(authTimeout!=null)timer.removeCallbacks(authTimeout);authorizing=false;pending=null;emit("connected",connected(),"loading",false,"needsAuthorization",true,"error",message);}
 void disconnect(){NativeProgress.get(activity).disconnect();if(authTimeout!=null)timer.removeCallbacks(authTimeout);generation++;authorizing=false;pending=null;final String old=token;token="";expires=0;prefs.edit().putBoolean("connected",false).apply();if(!old.isEmpty())Identity.getAuthorizationClient(activity).clearToken(ClearTokenRequest.builder().setToken(old).build());emit("connected",false,"loading",false,"error","","files",new JSONArray(),"folders",new JSONArray());}
 static boolean validId(String id){return id!=null&&id.matches("[a-zA-Z0-9_-]{1,200}");}
 static String encode(String s)throws Exception{return URLEncoder.encode(s,"UTF-8");}
 static JSONObject get(String url,String token)throws Exception {
  HttpURLConnection c=(HttpURLConnection)new URL(url).openConnection();c.setRequestProperty("Authorization","Bearer "+token);c.setConnectTimeout(15000);c.setReadTimeout(20000);c.setInstanceFollowRedirects(false);
  try{int code=c.getResponseCode();if(code==401)throw new Expired();if(code!=200)throw new IOException(code==403?"Нет доступа к папке или Drive API выключен":code==404?"Папка не найдена":"Google Диск временно недоступен ("+code+")");try(InputStream in=c.getInputStream();ByteArrayOutputStream out=new ByteArrayOutputStream()){byte[] b=new byte[8192];int n;while((n=in.read(b))!=-1)out.write(b,0,n);return new JSONObject(out.toString("UTF-8"));}}finally{c.disconnect();}
 }
 static class Expired extends IOException {}
 void browse(String id,JSONArray parents){if(!validId(id)){fail("Некорректная ссылка на папку");return;}emit("connected",connected(),"loading",true,"error","");withToken((t,g)->list(id,parents,t,g,false),true);}
 void list(String id,JSONArray parents,String access,int current,boolean retried){io.execute(()->{try{
  JSONArray actualParents=FolderAccess.path(id,key->FolderAccess.metadata(key,access));if(actualParents==null)throw new IOException("На телефоне доступна только выбранная папка MeguBoom");JSONObject listing=DrivePages.collect(page->{String q="'"+id+"' in parents and trashed = false";String url="https://www.googleapis.com/drive/v3/files?pageSize=1000&supportsAllDrives=true&includeItemsFromAllDrives=true&q="+encode(q)+"&fields="+encode("nextPageToken,files(id,name,mimeType,size,parents,modifiedTime,createdTime)")+(page.isEmpty()?"":"&pageToken="+encode(page));return get(url,access);},()->current!=generation);JSONArray folders=listing.getJSONArray("folders"),files=listing.getJSONArray("files");
  activity.runOnUiThread(()->{if(current==generation)emit("connected",true,"loading",false,"error","","folderId",id,"parentIds",actualParents,"folders",folders,"files",files);});
 }catch(Expired e){activity.runOnUiThread(()->{if(current!=generation)return;if(retried){fail("Доступ истёк. Подключите Google Диск заново.");return;}String old=token;token="";expires=0;Identity.getAuthorizationClient(activity).clearToken(ClearTokenRequest.builder().setToken(old).build()).addOnCompleteListener(task->{if(current==generation)withToken((t,g)->list(id,parents,t,g,true),true);});});
 }catch(Exception e){activity.runOnUiThread(()->{if(current==generation)fail(e instanceof IOException&&e.getMessage()!=null?e.getMessage():"Не удалось загрузить Google Диск. Проверьте интернет.");});}});}
 void collections(CollectionsListener found){found.result(new JSONArray());}
 void close(){timer.removeCallbacksAndMessages(null);generation++;io.shutdownNow();}
}
