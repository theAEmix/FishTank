/* 
global Game, Memory, FIND_MY_CREEPS, FIND_STRUCTURES, STRUCTURE_ROAD, STRUCTURE_WALL, STRUCTURE_RAMPART, _, WORK,ATTACK,
FIND_HOSTILE_CREEPS,FIND_CONSTRUCTION_SITES,CARRY,MOVE,AE,ERR_NOT_OWNER,ERR_BUSY, ERR_NOT_IN_RANGE,C,FIND_MY_STRUCTURES,STRUCTURE_EXTENSION,
FIND_MY_SPAWNS,RANGED_ATTACK
*/

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

 console.log('Current Energy -- ' + totalenergy.toString() + ' : ' + 'Level ' + control.level.toString());
 if(control.level !== 8){
 console.log(control.progress.toString() + " / " + control.progressTotal.toString());
 }
 if (croom.storage) {
  console.log('Energy in Storage = ' + croom.storage.store.energy + ' / ' + croom.storage.storeCapacity);
 }
 console.log('Currently there are ' + croom.memory.mRepair.length + ' jobs on the repair docket');
 console.log('Average Cpu : ' + _.sum(Memory.cpuLog) / Memory.cpuLog.length);
 console.log('Max Cpu : ' + _.max(Memory.cpuLog) + ' / Min Cpu : ' + _.min(Memory.cpuLog) + '  _______________________________________________________');
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