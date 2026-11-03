package ru.meguboom.mobile;
import org.junit.Test;import static org.junit.Assert.*;
public class PlaybackControlsTest {
 static class Fake implements PlaybackControls.Player {long position=2000,duration=10000;boolean playing=false;float speed=1;public long position(){return position;}public long duration(){return duration;}public boolean playing(){return playing;}public void seek(long p){position=p;}public void speed(float s){speed=s;playing=true;}public void pause(){playing=false;}}
 @Test public void relativeSeekClampsBothEnds(){Fake p=new Fake();PlaybackControls.seekBy(p,-5000);assertEquals(0,p.position);PlaybackControls.seekBy(p,5000);assertEquals(5000,p.position);PlaybackControls.seekBy(p,50000);assertEquals(10000,p.position);}
 @Test public void changingSpeedDoesNotStartPausedAudio(){Fake p=new Fake();PlaybackControls.setSpeed(p,1.5f);assertEquals(1.5f,p.speed,.001);assertFalse(p.playing);}
 @Test public void changingSpeedKeepsPlayingAudioPlaying(){Fake p=new Fake();p.playing=true;PlaybackControls.setSpeed(p,1.25f);assertTrue(p.playing);}
 @Test public void rejectsInvalidSpeedWithoutChangingPlayback(){Fake p=new Fake();for(float value:new float[]{0,-1,Float.NaN,Float.POSITIVE_INFINITY,4}){try{PlaybackControls.setSpeed(p,value);fail("invalid accepted");}catch(IllegalArgumentException expected){}}assertEquals(1,p.speed,.001);assertFalse(p.playing);}
 @Test public void notificationSpeedCyclesAndWraps(){assertEquals(1.25f,PlaybackControls.nextSpeed(1),.001);assertEquals(.75f,PlaybackControls.nextSpeed(2),.001);assertEquals(1f,PlaybackControls.nextSpeed(.75f),.001);}
}
