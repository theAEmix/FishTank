module.exports = function(creep, creeplimit, croom, spawn) {
	//return;
	if (croom.storage) {
		home = croom.storage;
		storage = home.store.energy;
	}
	else {
		var home = Game.spawns[spawn];
	}
	var targetrole;
	if (croom.memory.currentmode === 'shutdown') {
		targetrole = 'repairer';
	}
	else {
		targetrole = 'pumper';
	}


	var creepTotal = creeplimit - 1;
	var targetcreep = creep.room.find(FIND_MY_CREEPS, {
		filter: function(object) {
			return object.memory.role == targetrole
		}
	});
	if (!targetcreep[0]) return;
	if (croom.memory.currentmode === 'shutdown') {
		creepTotal = 100;
	}
	targetcreep = _.sortBy(targetcreep, function(creep) {
		return creep.carry.energy
	});
	//console.log(targetcreep[0]);
	var idle = croom.memory.idlespot.creeptype.tanker;
	var target;
	//console.log(targetcreep[0].name);

	if (croom.memory.spawnBit === 0 || croom.storage) {
		if (creep.carry.energy < creep.carryCapacity && creep.pos.getRangeTo(home) < 2) {
			//creep.moveTo(home.room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_EXTENSION}})[8]);
			creep.moveTo(home, {
				reusePath: 25
			});
			//home.room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_EXTENSION}})[8].transferEnergy(creep);
			//creep.say('Pickup');
			home.transferEnergy(creep);
		}
		else if (creep.carry.energy == 0) {
			creep.moveTo(home, {
				reusePath: 25
			});
			//creep.say('MovingHome');
		}
		else {

			//console.log(creep.name + ' is Active');

			creep.moveTo(targetcreep[0], {
				reusePath: 25,
				heuristicWeight : 500
			});

			creep.transferEnergy(targetcreep[0]);

		}
	}
	else if (creep.carry.energy == 0) {
		var pIdle = new RoomPosition(idle.x, idle.y, creep.room.name);
		var pIdleObject = {
			'pos': pIdle
		};
		creep.moveTo(pIdleObject, {
			reusePath: 25
		});
		//creep.moveTo(Game.spawns.Home);
	}
	else {
		creep.moveTo(targetcreep[0], {
			reusePath: 25
		});

		creep.transferEnergy(targetcreep[0]);
		//creep.say('To Pumper');
	}

}