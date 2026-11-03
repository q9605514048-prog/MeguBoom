package ru.meguboom.mobile;
final class PlaybackControls {
 interface Player {long position();long duration();boolean playing();void seek(long position);void speed(float value);void pause();}
 static void seekBy(Player player,long offset){player.seek(Math.max(0,Math.min(player.duration(),player.position()+offset)));}
 static void setSpeed(Player player,float speed){if(Float.isNaN(speed)||Float.isInfinite(speed)||speed<.5f||speed>3f)throw new IllegalArgumentException("Unsupported playback speed");boolean playing=player.playing();player.speed(speed);if(!playing)player.pause();}
 static float nextSpeed(float current){float[] values={.75f,1f,1.25f,1.5f,1.75f,2f};for(float speed:values)if(speed>current+.01f)return speed;return values[0];}
}
