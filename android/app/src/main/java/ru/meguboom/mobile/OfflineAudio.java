package ru.meguboom.mobile;
import java.io.*;
/** Publish only a complete audio file; incomplete/cancelled copies never reach the library. */
final class OfflineAudio {
 static File availableTarget(File requested){return requested.exists()?new File(requested.getParentFile(),requested.getName()+"-"+java.util.UUID.randomUUID()):requested;}
 interface State { boolean cancelled(); void progress(long bytes,long expected); }
 static void copy(InputStream input,File temp,File target,long expected,State state)throws IOException{
  boolean published=false;long copied=0;
  try{try(InputStream in=input;OutputStream out=new FileOutputStream(temp)){byte[] buffer=new byte[65536];int n;while((n=in.read(buffer))!=-1){if(state.cancelled())throw new IOException("cancelled");out.write(buffer,0,n);copied+=n;state.progress(copied,expected);}out.flush();}
   if(state.cancelled())throw new IOException("cancelled");if(copied==0||expected>=0&&copied!=expected)throw new IOException("incomplete");if(target.exists())throw new IOException("already exists");if(!temp.renameTo(target))throw new IOException("publish failed");published=true;
  }finally{if(!published)temp.delete();}
 }
}
