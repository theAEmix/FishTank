//Runner script, if we have all out creeps, then grab what you can and upgrade the controller
module.exports = function(creep, creeplimit, croom, spawn) {

	var home = Game.spawns[spawn];
	var creepTotal = home.room.find(FIND_MY_CREEPS).length;
	var target = creep.room.controller;
	var idle = croom.memory.idlespot.creeptype.runner;

	if (croom.memory.spawnBit === 0 && home.energy >= creep.carryCapacity) {
		if (creep.carry.energy == 0) {
			//creep.moveTo(home.room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_EXTENSION}})[8]);
			creep.moveTo(home);
			//home.room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_EXTENSION}})[8].transferEnergy(creep);
			home.transferEnergy(creep);
		}
		else {
			creep.moveTo(target /*,{reusePath: Infinity}*/ );
			creep.upgradeController(target);
		}
	}
	else if (creep.carry.energy == 0) {

		creep.moveTo(idle.x, idle.y);
		creep.say('On Hold');
		//creep.moveTo(Game.spawns.Home);

	}
	else {
		if (target) {
			creep.moveTo(target /*,{reusePath: Infinity}*/ );
			creep.upgradeController(target);
		}
	}
	if (croom.memory.currentmode === 'buildonly') {
		creep.memory.role = 'builder';
		console.log(creep.name + ' changed to a builder');
	}
}