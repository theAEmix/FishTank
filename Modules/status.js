module.exports = function(creeplimit, croom, rmode, spawn) {
 var home = Game.spawns[spawn];
 var control = Game.rooms[croom.name].controller;
 var totalenergy;
 var extenergy = 0;
 //Memory Check
 for (var cmode in croom.memory.mode) {
  var i = croom.memory.mode[cmode];
  var total = _.sum(i) - _.get(i, 'totalCreeps');
  //console.log(total);
  i.totalCreeps = total;
  //console.log('Memory Checked');
 }

 console.log('Game Time -- ' + Game.time.toString() + ' : Room -- ' + home.room.name + '  Mode:  ' + Game.rooms[croom.name].memory.currentmode + ' -------------------------------------------');
 


 totalenergy = croom.energyAvailable;

 console.log('Current Energy -- ' + totalenergy.toString());

// var screep = Game.spawns[spawn].room.find(FIND_MY_CREEPS);
// console.log('Number of Creeps -- ' + screep.length + ' / ' + creeplimit);
 /*
 for(var i in screep){
     console.log(screep[i].toString() + ' Life: ' + screep[i].ticksToLive + ' / 1500');
 }*/
 console.log('Level ' + control.level.toString());
 if(control.level !== 8){
 console.log(control.progress.toString() + " / " + control.progressTotal.toString());
 }
/* console.log('Energy in Source 1 -- ' + Game.getObjectById(Game.rooms[croom.name].memory.sources.psource.Id).energy + ' / ' + Game.getObjectById(Game.rooms[croom.name].memory.sources.psource.Id).energyCapacity +
  '  Regen in -- ' + Game.getObjectById(Game.rooms[croom.name].memory.sources.psource.Id).ticksToRegeneration);*/
 /*if (Memory.rooms[croom.name].sources.ssource) {
  console.log('Energy in Source 2 -- ' + Game.getObjectById(Game.rooms[croom.name].memory.sources.ssource.Id).energy + ' / ' + Game.getObjectById(Game.rooms[croom.name].memory.sources.ssource.Id).energyCapacity +
   '  Regen in -- ' + Game.getObjectById(Game.rooms[croom.name].memory.sources.ssource.Id).ticksToRegeneration);
 }*/
 if (croom.storage) {
  console.log('Energy in Storage = ' + croom.storage.store.energy + ' / ' + croom.storage.storeCapacity);
 }
 console.log('Currently there are ' + croom.memory.mRepair.length + ' jobs on the repair docket');
 console.log('Average Cpu : ' + _.sum(Memory.cpuLog) / Memory.cpuLog.length);
 console.log('Max Cpu : ' + _.max(Memory.cpuLog));
 console.log('Min Cpu : ' + _.min(Memory.cpuLog));
 console.log('____________________________________________________________________________________');
 if (!Memory.averageLog) {
  Memory.averageLog = [];
 }

 Memory.averageLog.push(_.sum(Memory.cpuLog) / Memory.cpuLog.length);

 if (Memory.averageLog.length > 100) {
  Memory.averageLog = _.drop(Memory.averageLog, 5);
 }
 if(_.sum(Memory.averageLog) / Memory.averageLog.length > 65){
     var overall = _.sum(Memory.averageLog) / Memory.averageLog.length;
     Game.notify('Your average CPU is climbing, and may error out soon : Current Setting: ' + '67' +' Measured: ' + overall);
 }
}