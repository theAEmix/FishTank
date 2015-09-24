module.exports = function(creep, creeplimit, croom, spawn) {
	if (croom.storage) {
		var home = croom.storage;
		var storage = home.store.energy;
		var spawningBit = 0;
		if (storage >= creep.carryCapacity) {
			creeplimit = 0;
		}
	}
	else {
		var home = Game.spawns[spawn];
		var storage = home.energy;
		var spawningBit = croom.memory.spawnBit;
		creeplimit = 0;
	}
	var creepTotal = home.room.find(FIND_MY_CREEPS).length;
	var idle = croom.memory.idlespot.creeptype.builder;
	var targete;
	if (creep.carry.energy == 0 && spawningBit === 0 && storage >= creep.carryCapacity) {
		creep.moveTo(home, {
			reusePath: 45
		});
		home.transferEnergy(creep);
	}
	else if (creep.carry.energy == 0) {
		creep.moveTo(idle.x, idle.y, {
			reusePath: 45
		});
	}
	else {

		if (creep.pos.findInRange(FIND_MY_STRUCTURES, 2, {
				filter: function(o) {
					return (o.hits < 10000 && o.structureType === STRUCTURE_RAMPART)
				}
			})[0]) {
			var rampart = creep.pos.findInRange(FIND_MY_STRUCTURES, 2, {
				filter: function(o) {
					return (o.hits < 10000 && o.structureType === STRUCTURE_RAMPART)
				}
			})[0];
			creep.moveTo(rampart, {
				reusePath: 15
			});
			creep.repair(rampart);
			creep.say('EMT');
		}
		else {
			var targetr = creep.room.find(FIND_CONSTRUCTION_SITES, {
				filter: {
					structureType: STRUCTURE_ROAD
				}
			});
			var targete = creep.room.find(FIND_CONSTRUCTION_SITES);
			if (targetr.length) {
				if (creep.pos.getRangeTo(targetr[0]) > 1) {
					creep.moveTo(targetr[0], {
						reusePath: 15
					});
					creep.say('To road');
				}
				else {
					creep.build(targetr[0]);
				}
			}
			else if (targete[0]) {
				if (creep.pos.getRangeTo(targete[0]) > 1) {
					creep.moveTo(targete[0], {
						reusePath: 15
					});
				}
				else {
					if (targete[0].structureType === STRUCTURE_RAMPART) {
						croom.memory.updateRepair = 1;
						croom.memory.updateStructure = 1;
						console.log('Repair Reset');
					}
					creep.build(targete[0]);
					creep.say('Building');
				}
			}
			//console.log(!targete[0]);
			if (!targete[0] && creep.memory.role !== 'repairer') {
				croom.memory.currentmode = 'general';
				if (creep.room.memory.roomStage <= 2) {
					creep.memory.role = 'repairer';
				}
				else {
					creep.memory.role = 'repairer';
				}
				console.log('Changing to General Mode in room ' + croom.name);
			}
			else if (!targete[0] && croom.memory.currentmode === 'general' && croom.memory.mode.general.repairer !== 0 && croom.memory.updateRepair === 0 && croom.memory.updateStructures === 0) {
				if (croom.memory.setpoints.wallhealth + 5000 < 300000000) {
					croom.memory.setpoints.wallhealth = croom.memory.setpoints.wallhealth + 5000;
					croom.memory.updateRepair = 1;
					croom.memory.updateStructures = 1;
					console.log('--------------Raising Walls to ' + croom.memory.setpoints.wallhealth + ' in ' + croom.name + ' ------------------------');
				}
				if (croom.memory.setpoints.ramparthealth + 5000 < croom.memory.setpoints.maxhealth) {
					croom.memory.setpoints.ramparthealth = croom.memory.setpoints.ramparthealth + 5000;
					croom.memory.updateRepair = 1;
					croom.memory.updateStructures = 1;
					console.log('--------------Raising Ramparts to ' + croom.memory.setpoints.ramparthealth + ' in ' + croom.name + ' -----------------------')
				}

			}
		}
	}



}