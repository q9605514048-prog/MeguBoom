package ru.meguboom.mobile;
import org.json.*;import org.junit.Test;import static org.junit.Assert.*;import java.util.*;
public class LibraryMigrationTest {
 @Test public void reuploadedCatalogueRetainsLegacyIdForCompletionAndProgress()throws Exception{JSONArray catalog=new JSONArray("[{id:'drive-new',legacyId:'drive-old',title:'Book'}]");JSONObject b=LibraryMigration.merge(new JSONArray(),catalog,Collections.singletonMap("drive-new","content://audio/book")).getJSONObject(0);assertEquals("drive-old",b.getString("legacyId"));}
 @Test public void keepsLegacyUriAndOriginalAssociation()throws Exception{JSONArray old=new JSONArray("[{id:'drive-a',title:'Book',kind:'book'}]");JSONArray result=LibraryMigration.merge(new JSONArray(),old,Collections.singletonMap("drive-a","content://audio/a"));JSONObject b=result.getJSONObject(0);assertEquals("local-legacy-drive-a",b.getString("id"));assertEquals("drive-a",b.getString("legacyId"));assertEquals("content://audio/a",b.getString("uri"));assertEquals("local",b.getString("storage"));}
 @Test public void doesNotDuplicateExistingUri()throws Exception{JSONArray current=new JSONArray("[{id:'local-new',uri:'content://audio/a'}]"),catalog=new JSONArray("[{id:'drive-a'}]");assertEquals(1,LibraryMigration.merge(current,catalog,Collections.singletonMap("drive-a","content://audio/a")).length());}
}
