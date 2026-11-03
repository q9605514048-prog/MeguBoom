package ru.meguboom.mobile;
/** Queue indices only: no paths, credentials or UI dependencies. */
final class PlaybackQueue {
 static int[] order(int count,int current,java.util.Random random){if(count<=0||current<0||current>=count)return new int[0];int[] order=new int[count];order[0]=current;int at=1;for(int i=0;i<count;i++)if(i!=current)order[at++]=i;for(int i=count-1;i>1;i--){int j=1+random.nextInt(i);int swap=order[i];order[i]=order[j];order[j]=swap;}return order;}
 static int next(int current,int count,int direction,boolean completion,String repeat,boolean shuffle,int randomIndex){
  if(count<=0||current<0||current>=count)return -1;
  if(completion&&"one".equals(repeat))return current;
  if(shuffle&&count>1){int candidate=Math.floorMod(randomIndex,count-1);return candidate>=current?candidate+1:candidate;}
  int candidate=current+direction;
  if(candidate<0||candidate>=count)return "all".equals(repeat)?Math.floorMod(candidate,count):-1;
  return candidate;
 }
}
