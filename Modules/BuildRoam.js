module.exports = function(creep, creeplimit, croom, spawn) {
 var home = Game.spawns[spawn];
 var thisroom = creep.room;
 var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
 var source = creep.pos.findClosestByRange(FIND_SOURCES, {
  filter: function(o) {
   return (o.energy !== 0 && o.pos.findInRange(FIND_MY_CREEPS, 1)[1] === undefined)
  }
 });
 if (creep.carry.energy < creep.carryCapacity && creep.pos.findInRange(FIND_SOURCES, 1)[0] !== undefined) {
  source = creep.pos.findInRange(FIND_SOURCES, 1)[0];
  creep.moveTo(source);
  creep.harvest(source);
  creep.say('Harvesting');


 }
 else if (creep.carry.energy == 0) {
  creep.moveTo(source);
  creep.say('To Source');
 }
 else if (targets.length) {
  creep.moveTo(targets[0]);
  creep.build(targets[0]);
  creep.say('Building');
 }
 else {
  creep.moveTo(creep.room.controller);
  creep.upgradeController(creep.room.controller);
  creep.say('Upgrade');


  //creep.moveTo(Game.spawns.Home)
 }
}