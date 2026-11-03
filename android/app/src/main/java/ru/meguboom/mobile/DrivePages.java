package ru.meguboom.mobile;
import org.json.*;import java.io.*;import java.util.*;import java.util.concurrent.CancellationException;import java.util.function.BooleanSupplier;
/** Complete folder snapshots: no partial result if a later page fails. */
final class DrivePages {
 interface Loader { JSONObject load(String page) throws Exception; }
 static JSONObject collect(Loader loader,BooleanSupplier cancelled)throws Exception{
  JSONArray folders=new JSONArray(),files=new JSONArray();String page="";HashSet<String> seen=new HashSet<>();
  do{if(cancelled.getAsBoolean())throw new CancellationException();JSONObject response=loader.load(page);JSONArray batch=response.optJSONArray("files");if(batch!=null)for(int i=0;i<batch.length();i++){JSONObject f=batch.getJSONObject(i);if("application/vnd.google-apps.folder".equals(f.optString("mimeType")))folders.put(f);else if(f.optString("mimeType").startsWith("audio/")||f.optString("name").toLowerCase(Locale.ROOT).matches(".*\\.(mp3|m4a|m4b|ogg|opus|aac|wav|flac)$"))files.put(f);}
   page=response.optString("nextPageToken");if(!page.isEmpty()&&!seen.add(page))throw new IOException("Google повторил страницу. Попробуйте обновить папку.");
  }while(!page.isEmpty());if(cancelled.getAsBoolean())throw new CancellationException();return new JSONObject().put("files",files).put("folders",folders);
 }
}
