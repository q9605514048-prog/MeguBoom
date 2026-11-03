package ru.meguboom.mobile;
import org.json.*;
/** Pending edits made before first authorization belong only to that first account. */
final class ProgressPartition {
 static void adopt(JSONObject target,JSONObject pending,boolean firstAccount)throws JSONException {if(firstAccount)ProgressRecords.merge(target,pending);}
}
