const {test}=require('node:test');const assert=require('node:assert/strict');const {nextId,shuffleIds}=require('../queue-utils');
const base={ids:['a','b','c'],currentId:'c'};
test('Natural end stops without repeat; manual next wraps',()=>{assert.equal(nextId({...base,ended:true}),null);assert.equal(nextId(base),'a');assert.equal(nextId({...base,currentId:'a',direction:-1}),'c')});
test('Repeat all wraps, repeat one applies only to natural end',()=>{assert.equal(nextId({...base,ended:true,repeat:'all'}),'a');assert.equal(nextId({...base,ended:true,repeat:'one'}),'c');assert.equal(nextId({...base,repeat:'one'}),'a')});
test('Shuffle keeps current first, visits each song once and ends',()=>{const ids=shuffleIds(['a','b','c','b'],'b',()=>0);assert.equal(ids[0],'b');assert.equal(new Set(ids).size,3);assert.equal(ids.length,3);assert.equal(nextId({ids,currentId:ids.at(-1),ended:true}),null);assert.deepEqual(shuffleIds(['a'],'a'),['a']);assert.equal(nextId({ids:[]}),null)});
