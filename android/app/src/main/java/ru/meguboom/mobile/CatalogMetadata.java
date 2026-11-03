package ru.meguboom.mobile;
import org.json.*;import java.util.*;
final class CatalogMetadata {
 static JSONObject driveBook(JSONObject raw,JSONArray catalog)throws JSONException{
  String id=raw.getString("id"),name=raw.optString("name");JSONObject match=null;int names=0;
  for(int i=0;i<catalog.length();i++){JSONObject c=catalog.getJSONObject(i);if(id.equals(c.optString("fileId"))||("drive-"+id).equals(c.optString("id"))){match=c;break;}}
  if(match==null){for(int i=0;i<catalog.length();i++){JSONObject c=catalog.getJSONObject(i);if(!name.isEmpty()&&name.equals(c.optString("name"))){match=c;names++;}}if(names!=1)match=null;}
  JSONObject b=match==null?new JSONObject():new JSONObject(match.toString());
  if(match!=null&&!match.optString("id").isEmpty()&&!("drive-"+id).equals(match.optString("id")))b.put("legacyId",match.optString("id"));
  if(match==null)b.put("title",name.replaceFirst("\\.[^.]+$","")).put("kind","unassigned");else b.put("kind","book");
  for(String field:Arrays.asList("modifiedTime","createdTime","size"))if(raw.has(field))b.put(field,raw.get(field));
  return b.put("id","drive-"+id).put("fileId",id).put("name",name).put("storage","drive");
 }
 static String key(String s){return s.toLowerCase(Locale.ROOT).replace('ё','е').replaceAll("[^а-яa-z0-9]","");}
 static JSONArray refresh(JSONArray library,JSONArray catalog)throws JSONException{JSONArray result=new JSONArray(library.toString());for(int i=0;i<result.length();i++){JSONObject b=result.getJSONObject(i);if(!"book".equals(b.optString("kind")))continue;for(int j=0;j<catalog.length();j++){JSONObject c=catalog.getJSONObject(j);String author=b.optString("author"),known=c.optString("author");boolean sameFile=!b.optString("fileId").isEmpty()&&b.optString("fileId").equals(c.optString("fileId")),sameName=!b.optString("name").isEmpty()&&b.optString("name").equals(c.optString("name")),sameTitle=!key(b.optString("title")).isEmpty()&&key(b.optString("title")).equals(key(c.optString("title")));boolean authorMatches=author.isEmpty()||known.isEmpty()||key(author).equals(key(known));if(sameFile||(sameName&&authorMatches)||(sameTitle&&!author.isEmpty()&&!known.isEmpty()&&authorMatches)){for(String field:Arrays.asList("title","author","series","catalogPath","cover","description","descriptionType","metadataSource","year"))if(!c.optString(field).isEmpty())b.put(field,c.get(field));break;}}}return result;}
}
