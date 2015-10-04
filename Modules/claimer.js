/* 
global Game, Memory, FIND_MY_CREEPS, FIND_STRUCTURES, STRUCTURE_ROAD, STRUCTURE_WALL, STRUCTURE_RAMPART, _, WORK,ATTACK,
FIND_HOSTILE_CREEPS,FIND_CONSTRUCTION_SITES,CARRY,MOVE,AE,ERR_NOT_OWNER,ERR_BUSY, ERR_NOT_IN_RANGE,C,FIND_MY_STRUCTURES,STRUCTURE_EXTENSION,
FIND_MY_SPAWNS,RANGED_ATTACK
*/

module.exports = function(creep, creeplimit, croom, spawn) {
 //return;
 var home = Game.spawns[spawn];
 var follow = require('!followpath');
 if(!creep.memory.color){
  creep.memory.color = AE.getColor(creep);
 }
 if (creep.memory.status !== 'arrived') {
  //console.log('Launching Follow');
  follow(creep, creep.memory.color);
  if (creep.memory.job === 'ups' && creep.carry.energy === creep.carryCapacity) {
   creep.memory.role = creep.memory.job;
  }
 }
 else if (creep.memory.job === 'gather') {
   creep.memory.role = 'gather';
  }
  else if (creep.memory.job === 'ups') {
   creep.memory.role = 'ups';
  }
  else if(creep.memory.job === 'cleric'){
      creep.memory.role = 'cleric';
  }
 else if (creep.room.controller && creep.room.controller.level >= 1 && creep.memory.status == 'arrived' && creep.getActiveBodyparts(ATTACK) < 1 && creep.getActiveBodyparts(RANGED_ATTACK) < 1 && creep.room.controller.owner.username === 'theAEmix') {
  creep.memory.role = 'buildroam';
  //creep.memory.spawnroom = creep.room.name;
  console.log(creep + ' changing to BuildRoam');
 }
 
 else if (creep.getActiveBodyparts(ATTACK) > 1 || creep.getActiveBodyparts(RANGED_ATTACK) > 0) {
  creep.say('Attack!');
  creep.memory.role = 'bruiser';
 }
 else if(!creep.room.controller){
     creep.moveTo(27,18, {reusePath: 15});
     creep.memory.role = creep.memory.job;
 }
 else if (creep.memory.job) {
  if (creep.memory.job === 'rc' || creep.memory.job === 'buildroam') {
   creep.moveTo(creep.room.controller);
   creep.claimController(creep.room.controller);
  }
  else {
   console.log('Creep is lost : ' + creep.name);
  }
 }
 



}
