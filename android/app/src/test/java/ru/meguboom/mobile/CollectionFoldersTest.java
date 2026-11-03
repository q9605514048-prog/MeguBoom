package ru.meguboom.mobile;
import org.junit.Test;import static org.junit.Assert.*;import org.json.*;
public class CollectionFoldersTest {
 @Test public void exactCollectionsExcludeArchiveAndSubgenres(){for(String s:new String[]{"waha","Ваха 40k","Warhammer 40,000","40k-отсортировано","01. Ваха"})assertTrue(s,CollectionFolders.matches(s));for(String s:new String[]{"Архив повторного переноса40k","Warhammer Ужасы","Other"})assertFalse(s,CollectionFolders.matches(s));}
 @Test public void matchedDescendantIsSuppressedThroughUnmatchedParents()throws Exception{JSONArray input=new JSONArray().put(new JSONObject().put("id","root").put("name","waha")).put(new JSONObject().put("id","middle").put("name","Книги").put("parents",new JSONArray().put("root"))).put(new JSONObject().put("id","nested").put("name","40k").put("parents",new JSONArray().put("middle"))).put(new JSONObject().put("id","other").put("name","Архив повторного переноса40k"));JSONArray result=CollectionFolders.select(input);assertEquals(1,result.length());assertEquals("root",result.getJSONObject(0).getString("id"));}
}
