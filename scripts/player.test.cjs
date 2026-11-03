const {test}=require('node:test');const assert=require('node:assert/strict');const {formatTime,resumePosition}=require('../player-utils');
test('Long audiobook time and bounds',()=>{assert.equal(formatTime(3661),'1:01:01');assert.equal(formatTime(61),'1:01');assert.equal(formatTime(-5),'0:00');assert.equal(formatTime(Infinity),'--:--')});
test('Resume positions are safe and completed chapters restart',()=>{assert.equal(resumePosition(42,100),42);assert.equal(resumePosition(-1,100),0);assert.equal(resumePosition('broken',100),0);assert.equal(resumePosition(100,100),0)});
