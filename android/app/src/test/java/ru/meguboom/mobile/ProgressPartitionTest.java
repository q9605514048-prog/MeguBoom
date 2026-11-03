package ru.meguboom.mobile;
import org.junit.Test;import org.json.*;import static org.junit.Assert.*;
public class ProgressPartitionTest {
 @Test public void firstAccountAdoptsTimestampedOfflineEdits()throws Exception{JSONObject pending=new JSONObject().put("book",new JSONObject().put("positionMs",2000).put("durationMs",10000).put("completed",false).put("updatedAt",200).put("deviceId","11111111-1111-4111-8111-111111111111"));JSONObject own=new JSONObject();ProgressPartition.adopt(own,pending,true);assertEquals(200,own.getJSONObject("book").getLong("updatedAt"));}
 @Test public void changingAccountNeverAdoptsPreviousAccount()throws Exception{JSONObject own=new JSONObject();ProgressPartition.adopt(own,new JSONObject().put("private-A",new JSONObject()),false);assertEquals(0,own.length());}
}
