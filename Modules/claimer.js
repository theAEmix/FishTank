
module.exports = function(creep, creeplimit, croom, spawn) {
 //return;
 var home = Game.spawns[spawn];
 var follow = require('!followpath');
 for (var i in Game.creeps) {
  if (Game.creeps[i].memory.start === 'Flag37') {
   //Game.creeps[i].move(LEFT);
  }
 }
 if (creep.memory.status !== 'arrived') {
  //console.log('Launching Follow');
  follow(creep, creep.memory.color);
  if (creep.memory.job === 'ups' && creep.carry.energy === creep.carryCapacity) {
   creep.memory.role = creep.memory.job;
  }
 }
 
 else if (creep.room.controller.level >= 1 && creep.memory.status == 'arrived' && creep.getActiveBodyparts(ATTACK) < 1 && creep.room.controller.owner.username === 'theAEmix') {
  creep.memory.role = 'buildroam';
  console.log(creep + ' changing to BuildRoam');
 }
 
 else if (creep.getActiveBodyparts(ATTACK) > 1 || creep.getActiveBodyparts(RANGED_ATTACK) > 0) {
  creep.say('Attack!');
  creep.memory.role = 'attacker';
 }
 else if (creep.memory.job) {
  if (creep.memory.job === 'rc' || creep.memory.job === 'buildroam') {
   creep.moveTo(creep.room.controller);
   creep.claimController(creep.room.controller);
  }
  
  else if (creep.memory.job === 'gather') {
   creep.memory.role = 'gather';
  }
  else if (creep.memory.job === 'ups') {
   creep.memory.role = 'ups';
  }
  else {
   console.log('Creep is lost : ' + creep.name);
  }
 }



}
