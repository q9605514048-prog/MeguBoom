package ru.meguboom.mobile;
import org.json.*;import java.util.*;
final class LibraryMigration {
 static JSONArray merge(JSONArray current,JSONArray catalog,Map<String,String> oldUris)throws JSONException{
  JSONArray result=new JSONArray(current.toString());Set<String> seen=new HashSet<>();for(int i=0;i<current.length();i++)seen.add(current.getJSONObject(i).optString("uri"));
  for(int i=0;i<catalog.length();i++){JSONObject b=new JSONObject(catalog.getJSONObject(i).toString());String currentId=b.optString("id"),oldId=b.optString("legacyId",currentId),uri=oldUris.get(currentId);if(uri==null||uri.isEmpty()||!seen.add(uri))continue;b.put("legacyId",oldId);b.put("id","local-legacy-"+oldId);b.put("uri",uri);b.put("kind","book");b.put("storage","local");result.put(b);}return result;
 }
}
