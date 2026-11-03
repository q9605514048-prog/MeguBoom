package ru.meguboom.mobile;
import org.json.*;import org.junit.Test;import static org.junit.Assert.*;import java.io.*;
public class DrivePagesTest {
 @Test public void readsEveryPageAndKeepsOnlyFoldersAndAudio()throws Exception{int[] calls={0};JSONObject result=DrivePages.collect(page->{calls[0]++;return new JSONObject(page.isEmpty()?"{files:[{id:'folder',mimeType:'application/vnd.google-apps.folder'},{id:'a',name:'book.M4B',mimeType:'application/octet-stream'},{id:'doc',name:'list.txt'}],nextPageToken:'next'}":"{files:[{id:'b',name:'song',mimeType:'audio/mpeg'}]}");},()->false);assertEquals(2,calls[0]);assertEquals(1,result.getJSONArray("folders").length());assertEquals(2,result.getJSONArray("files").length());}
 @Test(expected=IOException.class) public void repeatedPageDoesNotLoopForever()throws Exception{DrivePages.collect(page->new JSONObject("{files:[],nextPageToken:'same'}"),()->false);}
 @Test(expected=IOException.class) public void failedSecondPageDoesNotReturnPartialLibrary()throws Exception{DrivePages.collect(page->{if(!page.isEmpty())throw new IOException("offline");return new JSONObject("{files:[{id:'a',mimeType:'audio/mpeg'}],nextPageToken:'next'}");},()->false);}
 @Test(expected=java.util.concurrent.CancellationException.class) public void disconnectCancelsListing()throws Exception{DrivePages.collect(page->{throw new AssertionError("must not fetch after disconnect");},()->true);}
}
