module.exports = function(creep) {
    //return;    
    //var pathFind = require('pathFind');    


    if (creep.room.controller.my) {
        if (creep.carry.energy === 0) {
            creep.memory.role = 'claimer';
            delete creep.memory.target;
            delete creep.memory.path;
            delete creep.memory.start;
            delete creep.memory.end;
            delete creep.memory.status;
            creep.say('reseting');
        }
        else {
            var croom = Game.rooms[creep.memory.spawnroom];
            if (croom.storage) {
                creep.moveTo(creep.room.storage, {
                    reusePath: 45
                });
                creep.transferEnergy(creep.room.storage);
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
    }
    else {


        if (creep.carry.energy < creep.carryCapacity && creep.room.name !== 'E3S4' && _.filter(Memory.creeps, {
                'job': 'gather',
                'color': creep.memory.color
            }).length >= 1) {

            if (!creep.memory.target) {

                var eTar = creep.pos.findClosest(FIND_DROPPED_ENERGY, {
                    filter: function(o) {
                        return o.energy > 250
                    }
                });
                if (eTar) {
                    creep.memory.target = eTar.id;
                    //creep.move(BOTTOM);
                    //creep.say('Found Energy');
                }
                else {
                    creep.say('No NRG');
                    var gatherers = creep.pos.findInRange(FIND_MY_CREEPS, 4, {
                        filter: function(o) {
                            return o.memory.job === 'gather'
                        }
                    });
                    creep.say(gatherers[0]);
                    if (gatherers[0] !== undefined) {
                        var d1 = creep.pos.getDirectionTo(gatherers[0]);
                        creep.say(d1);
                        var newdirection = (d1 + 2) % 8;
                        creep.say(newdirection);
                        creep.move(newdirection);
                    }
                    else if (creep.memory.color === 'green') {
                        creep.move(5);
                    }
                }
                //creep.say('Search');
            }
            else {
                //creep.say('pickup');
                if (!Game.getObjectById(creep.memory.target)) {
                    delete creep.memory.target;
                }
                else {
                    creep.moveTo(Game.getObjectById(creep.memory.target), {
                        reusePath: 45
                    });
                    creep.pickup(Game.getObjectById(creep.memory.target));
                }
            }
        }
        else {
            //creep.say('Full');
            if (creep.memory.color === 'green') {
                var target = new RoomPosition(30, 20, 'E3S4');
                if (creep.pos.getRangeTo(target) !== 0) {
                    creep.moveTo(target, {
                        reusePath: 45
                    });
                }
                else {
                    if (!creep.pos.findInRange(FIND_DROPPED_ENERGY, 0)[0]) {
                        creep.dropEnergy();
                        creep.memory.role = 'claimer';
                        delete creep.memory.target;
                        delete creep.memory.path;
                        delete creep.memory.start;
                        delete creep.memory.end;
                        delete creep.memory.status;
                    }


                }
            }
            else {
                creep.moveTo(Game.spawns[creep.memory.homebase], {
                    reusePath: 45
                });
            }
        }

    }
}