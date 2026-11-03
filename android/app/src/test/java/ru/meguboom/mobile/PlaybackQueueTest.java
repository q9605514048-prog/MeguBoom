package ru.meguboom.mobile;
import org.junit.Test;import static org.junit.Assert.*;
public class PlaybackQueueTest {
 @Test public void stopsAtEndUnlessRepeatAll(){assertEquals(-1,PlaybackQueue.next(2,3,1,false,"off",false,0));assertEquals(0,PlaybackQueue.next(2,3,1,false,"all",false,0));assertEquals(2,PlaybackQueue.next(0,3,-1,false,"all",false,0));}
 @Test public void repeatOneOnlyRepeatsOnCompletion(){assertEquals(1,PlaybackQueue.next(1,3,1,true,"one",false,0));assertEquals(2,PlaybackQueue.next(1,3,1,false,"one",false,0));}
 @Test public void shuffleMovesAwayFromCurrent(){assertEquals(2,PlaybackQueue.next(1,3,1,false,"off",true,1));assertEquals(0,PlaybackQueue.next(1,3,1,false,"off",true,0));assertEquals(-1,PlaybackQueue.next(0,1,1,true,"off",true,0));}
 @Test public void shuffledOrderVisitsEachRecordOnceAndStops(){int[] order=PlaybackQueue.order(40,17,new java.util.Random(3));assertEquals(17,order[0]);java.util.Set<Integer> seen=new java.util.HashSet<>();int at=0;while(at>=0){assertTrue(seen.add(order[at]));at=PlaybackQueue.next(at,order.length,1,true,"off",false,0);}assertEquals(40,seen.size());assertEquals(0,PlaybackQueue.next(39,40,1,true,"all",false,0));}
 @Test public void emptyQueueHasNoNext(){assertEquals(-1,PlaybackQueue.next(-1,0,1,false,"off",false,0));}
}
