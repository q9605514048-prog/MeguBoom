package ru.meguboom.mobile;
import org.json.*;import java.util.*;import java.io.*;
/** Membership comes only from Drive metadata, never a WebView-supplied breadcrumb. */
final class FolderAccess {
 static final String ROOT="CONFIGURE_DRIVE_FOLDER_ID";
 interface Loader {JSONObject load(String id)throws Exception;}
 static JSONArray path(String id,Loader loader)throws Exception{return path(id,loader,new HashSet<>(),0);}
 private static JSONArray path(String id,Loader loader,Set<String> seen,int depth)throws Exception{if(!ProgressRecords.validId(id)||depth>100||!seen.add(id))return null;if(ROOT.equals(id))return new JSONArray();JSONObject f=loader.load(id);if(f.optBoolean("trashed"))return null;JSONArray parents=f.optJSONArray("parents");if(parents==null)return null;for(int i=0;i<parents.length();i++){String parent=parents.getString(i);JSONArray found=path(parent,loader,seen,depth+1);if(found!=null)return found.put(parent);}return null;}
 static boolean contains(String id,Loader loader)throws Exception{return path(id,loader)!=null;}
 static JSONObject metadata(String id,String token)throws Exception{return DriveClient.get("https://www.googleapis.com/drive/v3/files/"+id+"?supportsAllDrives=true&fields=id,parents,trashed,mimeType",token);}
 static void require(String id,String token)throws Exception{if(!contains(id,key->metadata(key,token)))throw new IOException("На телефоне доступна только выбранная папка MeguBoom");}
}
