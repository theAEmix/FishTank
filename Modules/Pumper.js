module.exports = function(creep, creeplimit, croom, spawn) {
 var home = Game.spawns[spawn];
 var idle = croom.memory.idlespot.creeptype.pumper;
 var localcreeps = creep.pos.findInRange(FIND_MY_CREEPS, 1, {
  filter: function(o) {
   return o.memory.role === 'pumper'
  }
 });
 var rc = croom.controller;

 var slink = Game.getObjectById(croom.memory.links.slink);
 var clink = Game.getObjectById(croom.memory.links.clink);
 var centerlink = Game.getObjectById(croom.memory.links.centerlink);
 var hlink = Game.getObjectById(croom.memory.links.hlink);
 if (creep.ticksToLive < 2) {
  console.log(creep.name + ' spent ' + creep.memory.idleTicks + ' ticks Idle');
 }
 if (!creep.memory.idleTicks) {
  creep.memory.idleTicks = 0;
 }
 if (creep.carry.energy === 0) {
  creep.memory.idleTicks = creep.memory.idleTicks + 1;
 }
 if (hlink && hlink.energy > hlink.energyCapacity-50 && clink.energy <= 15) {
  hlink.transferEnergy(clink);
 }
 else if (centerlink && centerlink.energy === centerlink.energyCapacity && clink.energy === 0) {
  centerlink.transferEnergy(clink);
 }
 if (creep.pos.getRangeTo(rc) > 1) {
  creep.moveTo(rc);
 }
 else {
  if (!localcreeps[1]) {
   creep.moveTo(creep.pos.findInRange(FIND_MY_CREEPS, 2, {
    filter: function(o) {
     return o.memory.role === 'pumper'
    }
   })[1]);
   creep.upgradeController(rc);
   creep.say('Adjust');
  }
  for (var i in localcreeps) {
   if (localcreeps[i].carry.energy < creep.carry.energy && localcreeps[i].memory.role === 'pumper') {
    creep.transferEnergy(localcreeps[i], creep.carry.energy / 3);
   }
  }
  creep.upgradeController(rc);
 }

 if (clink) {
  if (!clink.pos.findInRange(FIND_MY_CREEPS, 1, {
    filter: function(o) {
     return o.memory.role === 'pumper'
    }
   })[0]) {
   creep.moveTo(clink);
  }
  clink.transferEnergy(creep);
  creep.upgradeController(rc);
 }




}