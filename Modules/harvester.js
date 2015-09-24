
//Harvester script, if spawn has space, get energy
module.exports = function(creep, creeplimit, croom, spawn) {
	//console.log(creep + ' is running harvester');
	if (Game.spawns[spawn].energy == Game.spawns[spawn].energyCapacity && croom.storage) {
		var home = croom.storage;
		var storage = croom.storage.store.energy;
		var capacity = croom.storage.storeCapacity;
	}
	else {
		var home = Game.spawns[spawn];
		var storage = Game.spawns[spawn].energy;
		var capacity = home.energyCapacity;
	}
	var count = 0;
	if (!creep.memory.sourceId) {
		if (_.endsWith(creep.name, '1') || _.endsWith(creep.name, '3') || _.endsWith(creep.name, '5') || _.endsWith(creep.name, '7') || _.endsWith(creep.name, '9')) {
			creep.memory.sourceId = croom.memory.sources.psource.Id;
		}
		else if (_.endsWith(creep.name, '2') || _.endsWith(creep.name, '4') || _.endsWith(creep.name, '6') || _.endsWith(creep.name, '8') || _.endsWith(creep.name, '0')) {
			creep.memory.sourceId = croom.memory.sources.ssource.Id;
		}
		else {
			console.log('Something Went Wrong');
			creep.memory.sourceId = croom.memory.sources.psource.Id;

		}
	}
	var sources = Game.getObjectById(creep.memory.sourceId);
	var idle = croom.memory.idlespot.creeptype.harvester;
	var roomExtensions = home.room.find(FIND_MY_STRUCTURES, {
		filter: function(object) {
			if (object.structureType == STRUCTURE_EXTENSION) return object.energy < object.energyCapacity;
		}
	});
	var closestExt = creep.pos.findClosestByRange(roomExtensions);
	//console.log(creep);
	//
	// creep checks to see if it is full. if not. fill up!
	if ((creep.carry.energy < creep.carryCapacity && creep.pos.getRangeTo(sources) <= 2) || creep.carry.energy == 0) {
		creep.moveTo(sources, {
			reusePath: 10
		});
		creep.harvest(sources);
		//console.log("Harvesting");
	}
	//if full, head off to first extension

	else {
		//console.log("Enter Else")
		if (closestExt) {
			creep.moveTo(closestExt, {
				reusePath: 10
			});
			creep.transferEnergy(closestExt);
		}
		//console.log(count)
		//if everything is full, go to staging point
		else if (creep.carry.energy == creep.carryCapacity && storage == capacity && !closestExt) {
			creep.moveTo(idle.x, idle.y, {
				reusePath: 10
			});
		}
		//if there are no extensions to fill, fill spawn
		else {
			//console.log("Moving to....");
			//console.log(home);
			creep.moveTo(home, {
				reusePath: 10
			});
			creep.transferEnergy(home);
		}

		//console.log("Exit Loop")   
	}

	if (creep.room.find(FIND_CONSTRUCTION_SITES).length > 15 && croom.memory.currentmode != 'building' && croom.memory.currentmode != 'buildonly') {
		croom.memory.currentmode = 'building';
		console.log('Changing to Building Mode in room ' + croom.name);
	}

}
