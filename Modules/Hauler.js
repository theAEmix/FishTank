module.exports = function(creep, creeplimit, croom, spawn) {
    var home = Game.spawns[spawn];
    var idle = croom.memory.idlespot.creeptype.hauler;
    var roomExtensions = home.room.find(FIND_MY_STRUCTURES, {
        filter: function(object) {
            if (object.structureType == STRUCTURE_EXTENSION) return object.energy < object.energyCapacity;
        }
    });
    var closestExt = creep.pos.findClosestByRange(roomExtensions);
    var tlink;
    var clink = Game.getObjectById(croom.memory.links.clink);
    var centerlink = Game.getObjectById(croom.memory.links.centerlink);
    if (!creep.memory.target) {
        AE.getTarget(croom.memory.sources, creep, 2);
        if (!creep.memory.sourceId) creep.memory.sourceId = creep.memory.target;
    }
    if (creep.tickToLive < 15 && croom.storage) {
        creep.moveTo(croom.storage);
        creep.transferEnergy(croom.storage);
        creep.say('Dying');
    }
    else {
        tlink = creep.room.find(FIND_MY_CREEPS, {
            filter: function(object) {
                return object.memory.target == creep.memory.sourceId && object.memory.role === 'farmer'
            }
        })[0];
        if (!tlink) {
            tlink = croom.storage;
        }

        if (creep.carry.energy === 0) {
            if (creep.pos.getRangeTo(tlink) <= 1) {
                var closestlink = creep.pos.findInRange(FIND_MY_STRUCTURES, 2, {
                    filter: {
                        structureType: STRUCTURE_LINK
                    }
                })[0];
                if (closestlink !== undefined) {
                    if (closestlink.pos.getRangeTo(creep) < 2) {
                        closestlink.transferEnergy(creep);
                    }
                    else {
                        creep.moveTo(closestlink);
                    }

                }
                tlink.transferEnergy(creep);
                creep.pickup(creep.pos.findInRange(FIND_DROPPED_ENERGY, 1)[0]);
                //creep.say('Linking');

            }
            else {
                creep.moveTo(tlink);
                //creep.say('Moving');
            }
        }

        else if (creep.carry.energy <= creep.carryCapacity) {
            if (creep.pos.getRangeTo(tlink) <= 1 && creep.carry.energy !== creep.carryCapacity) {
                var closestlink = creep.pos.findInRange(FIND_MY_STRUCTURES, 3, {
                    filter: {
                        structureType: STRUCTURE_LINK
                    }
                })[0];
                if (closestlink !== undefined) {
                    if (closestlink.pos.getRangeTo(creep) < 2) {
                        closestlink.transferEnergy(creep);
                    }
                    else {
                        creep.moveTo(closestlink);
                    }

                }
                tlink.transferEnergy(creep);
                creep.pickup(creep.pos.findInRange(FIND_DROPPED_ENERGY, 1)[0]);
                //creep.say('Linking');
            }
            else if (closestExt) {
                creep.moveTo(closestExt);
                creep.transferEnergy(closestExt);
                creep.say('Delivery');
            }

            else if (home.energyCapacity !== home.energy) {
                creep.moveTo(home);
                creep.transferEnergy(home);
                creep.say('Spawn');

            }
            else if (home.energyCapacity === home.energy && centerlink) {
                if (centerlink.energy !== centerlink.energyCapacity) {
                    creep.moveTo(centerlink);
                    creep.transferEnergy(centerlink);
                    creep.say('centlink');
                }
                else if (croom.storage) {
                    creep.moveTo(croom.storage);
                    creep.transferEnergy(croom.storage);
                    creep.say('Store1');
                }
                else {
                    creep.moveTo(idle.x, idle.y);
                    creep.say('idle1');
                }

            }
            else if (croom.storage) {
                creep.moveTo(croom.storage);
                creep.transferEnergy(croom.storage);
                creep.say('store2');
            }
            else {
                creep.moveTo(idle.x, idle.y);
                creep.say('idle2');
            }



        }


    }

}