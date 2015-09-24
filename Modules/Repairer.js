/* 
global Game, Memory, FIND_MY_CREEPS, FIND_STRUCTURES, STRUCTURE_ROAD, STRUCTURE_WALL, STRUCTURE_RAMPART, _, WORK
*/

module.exports = function(creep, creeplimit, croom, spawn, pairnum) {
    var mem = croom.memory;
    var creepTotal = creeplimit - 1;
    if (mem.currentmode === 'shutdown') {
        creepTotal = 0;
    }
    var builder = require('builder');
    if (croom.storage) {
        var home = croom.storage;
        var storage = croom.storage.store.energy;
        creeplimit = 0;
    }
    else {
        var home = Game.spawns[spawn];
        var storage = Game.spawns[spawn].energy;
    }
    var setpoint = 9 / 10;
    var maxsetpoint = 100 / 100;
    var closest = 15;
    var target = mem.mRepair;
    var ramparthealth = mem.setpoints.ramparthealth;
    var wallhealth = mem.setpoints.wallhealth;
    var idle = mem.idlespot.creeptype.repairer;
    var toRepair = [];


    if (!creep.memory.target && mem.updateRepair !== 1) {

        if (_.filter(target, 'structureType', STRUCTURE_SPAWN)[0]) {
            target = _.filter(target, 'structureType', STRUCTURE_SPAWN)[0];
            //console.log(target);
            creep.memory.target = target.id;
            console.log(creep.name + "'s target is " + target.structureType + ' ' + target.hits + ' / ' + target.hitsMax +
                ' in room ' + creep.memory.homeroom + ' at ' + target.pos.x + ',' + target.pos.y);
            mem.updateRepair = 1;
            mem.updateStructures = 1;
        }

        else {

            target = _.sortByOrder(target, ['hits', 'structureType'], ['asc', 'desc']);
            mem.mRepair = target;
            if (target[0]) {
                creep.memory.target = target[0].id;
                mem.mRepair = _.drop(mem.mRepair, 1);
                //console.log(target[0].id);
                //console.log(creep.name + "'s target is " + target[0].structureType + ' ' + target[0].hits + ' / ' + target[0].hitsMax +
                //    ' in room ' + creep.memory.homeroom + ' at ' + target[0].pos.x + ',' + target[0].pos.y + ' : ' + target.length + ' Jobs to go.');
            }
        }
    }


    if ((creep.carry.energy == 0 && croom.memory.spawnBit === 0 && storage >= creep.carryCapacity) || (creep.carry.energy == 0 && croom.storage)) {
        if(home.transferEnergy(creep) === ERR_NOT_IN_RANGE){
            creep.moveTo(home, {
                reusePath: 45
            });
        }
        else{
            delete creep.memory.target;
            mem.updateRepair = 1;
        }

    }
    else if (creep.carry.energy == 0) {
        creep.moveTo(idle.x, idle.y, {
            reusePath: 45
        });
    }
    else {
        var ctarget = Game.getObjectById(creep.memory.target);
        if (AE.repairTarget(creep));
        else {
            var count = creep.memory.idleCount + 1
            creep.memory.idleCount = count;
            delete creep.memory.target;
            creep.say('Idle');
            builder(creep, creeplimit, croom, spawn);

        }
    }
}
