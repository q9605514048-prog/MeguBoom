package ru.meguboom.mobile;
import org.junit.Test;import org.json.*;import static org.junit.Assert.*;
public class FolderAccessTest {
 @Test public void traversesActualParentsAndRejectsOutsideAndCycles()throws Exception {FolderAccess.Loader source=id->new JSONObject().put("id",id).put("parents",new JSONArray().put(id.equals("child")?FolderAccess.ROOT:id.equals("loop")?"loop":"outside"));assertTrue(FolderAccess.contains("child",source));assertFalse(FolderAccess.contains("foreign",source));assertFalse(FolderAccess.contains("loop",source));}
}
