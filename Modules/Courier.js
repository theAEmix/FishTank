//optimized on 8/15
module.exports = function(creep, creeplimit, croom, spawn) {
 var home = Game.spawns[spawn];
 var loosenrg = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY);
 var idle = croom.memory.idlespot.creeptype.courier;
 var centerlink = Game.getObjectById(croom.memory.links.centerlink);
 var roomStorage = croom.storage;
 var cState = 0;
 var sState = 0;
 //state variables to handle if the structures exist or are empty and need refilling
 if (centerlink) {
  if (centerlink.energy !== centerlink.energyCapacity) {
   cState = 1;
  }
 }
 if (roomStorage) {
  if (roomStorage.store !== roomStorage.storeCapacity) {
   sState = 1;
  }
 }
 //the pickup script, basically if it needs energy, and some is available somewhere, get it
 if (creep.carry.energy !== creep.carryCapacity && (loosenrg || roomStorage)) {
  if (loosenrg) {
   creep.moveTo(loosenrg);
   creep.pickup(loosenrg);
   //creep.say('nrg');
  }
  else {
   if (creep.pos.getRangeTo(roomStorage) > 1) {
    creep.moveTo(roomStorage);
   }
   croom.storage.transferEnergy(creep);
   //creep.say('GetStr');
  }
 }
 //This part is the delivery logic, top down deliver to what needs it the most
 else {
  if (home.energy !== home.energyCapacity && cState !== 1) {
   creep.moveTo(home);
   creep.transferEnergy(home);
   //creep.say('Spwn');
  }
  else if (cState === 1) {
   if (creep.pos.getRangeTo(centerlink) > 1) creep.moveTo(centerlink);
   creep.transferEnergy(centerlink);
   //creep.say('center');
  }
  else if (sState === 1 && loosenrg) {
   if (creep.pos.getRangeTo(roomStorage) > 1) creep.moveTo(roomStorage);
   creep.transferEnergy(roomStorage);
   //creep.say('Store');
  }
  else if (sState === 1) {
   if (creep.pos.getRangeTo(roomStorage) > 1) creep.moveTo(roomStorage);
   //creep.say('wait');
  }
  else {
   creep.moveTo(idle.x, idle.y);
   //creep.say('Idle');
  }

 }

}