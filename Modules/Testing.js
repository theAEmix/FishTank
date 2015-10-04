/* 
global Game, Memory, FIND_MY_CREEPS, FIND_STRUCTURES, STRUCTURE_ROAD, STRUCTURE_WALL, STRUCTURE_RAMPART, _, WORK,ATTACK,
FIND_HOSTILE_CREEPS,FIND_CONSTRUCTION_SITES,CARRY,MOVE,AE,ERR_NOT_OWNER,ERR_BUSY, ERR_NOT_IN_RANGE,C,FIND_MY_STRUCTURES,STRUCTURE_EXTENSION,
FIND_MY_SPAWNS,RANGED_ATTACK, FIND_DROPPED_ENERGY
*/


module.exports = function(creep) {
    if (!creep.memory.target) {
        AE.getTarget(Memory.rooms[creep.memory.spawnroom].remoteMines, creep);
    }
    if (creep.carry.energy === creep.carryCapacity) {
        var passTo = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
            filter: function(c) {
                return c.ticksToLive > creep.ticksToLive && c.memory.job === creep.memory.job && c.carry.energy !== c.carryCapacity;
            }
        });
        if (!passTo) {
            var croom = Game.rooms[creep.memory.spawnroom];
            creep.say('Goal');
            if (croom.memory.links.hlink) {
                if (!Game.getObjectById(croom.memory.links.hlink)) delete croom.memory.links.hlink;
                else {
                    if (Game.getObjectById(croom.memory.links.hlink).energy < 500 && creep.pos.getRangeTo(Game.getObjectById(croom.memory.links.hlink)) < creep.pos.getRangeTo(croom.storage)) {
                        if (creep.transferEnergy(Game.getObjectById(croom.memory.links.hlink)) === ERR_NOT_IN_RANGE) {
                            creep.moveTo(Game.getObjectById(croom.memory.links.hlink), {
                                reusePath: 45
                            });
                        }
                    }
                    else if (croom.storage) {
                        creep.moveTo(croom.storage, {
                            reusePath: 45
                        });
                        creep.transferEnergy(croom.storage);
                    }
                }
            }

            else if (croom.storage) {
                creep.moveTo(croom.storage, {
                    reusePath: 45
                });
                creep.transferEnergy(croom.storage);
            }
            else {
                creep.moveTo(Game.spawns[creep.memory.homebase], {
                    reusePath: 45
                })
                if (creep.pos.getRangeTo(Game.spawns[creep.memory.homebase]) === 1) {
                    creep.dropEnergy();
                }
            }

        }
        else {
            creep.say('Pass');
            if (creep.transferEnergy(passTo) === ERR_NOT_IN_RANGE) {
                creep.moveTo(passTo, {reusePath: 15});
            }
            else {
                creep.move((creep.pos.getDirectionTo(passTo)+4) % 8);
            }
        }
    }
    else if (creep.carry.energy !== creep.carryCapacity) {
        var getFrom = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
            filter: function(c) {
                return c.ticksToLive < creep.ticksToLive && c.memory.job === creep.memory.job && c.carry.energy > 0;
            }
        });
        if (!getFrom) {
            var gatherFrom = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY, {
                filter: function(e) {
                    return e.energy > 300;
                }
            });
            if (!gatherFrom) {
                creep.moveTo(Game.getObjectById(creep.memory.target), {
                    reusePath: 45
                });
                creep.say('No NRG');
            }
            else {
                if (creep.pos.getRangeTo(gatherFrom) > 1) {
                    creep.moveTo(gatherFrom, {reusePath: 15});
                }
                else {
                    creep.say('NRG!');
                }
            }
        }
        else{
            if (creep.pos.getRangeTo(getFrom) > 1) {
                    creep.moveTo(getFrom, {reusePath: 15});
                }
                else {
                    creep.say('NRG!!');
                    creep.move((creep.pos.getDirectionTo(getFrom)+4) % 8);
                }
        }

    }
    else {
        creep.say('UhOh');
    }

}