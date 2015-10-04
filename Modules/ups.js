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
            if(creep.room.name === 'W2S6')creep.memory.status = 'arrived';
        }
        else {
            var croom = Game.rooms[creep.memory.spawnroom];
            if(croom.memory.links.hlink){
                if(!Game.getObjectById(croom.memory.links.hlink)) delete croom.memory.links.hlink;
                else{
                    if(Game.getObjectById(croom.memory.links.hlink).energy < 500 && creep.pos.getRangeTo(Game.getObjectById(croom.memory.links.hlink))<creep.pos.getRangeTo(croom.storage)){
                        if(creep.transferEnergy(Game.getObjectById(croom.memory.links.hlink)) === ERR_NOT_IN_RANGE){
                            creep.moveTo(Game.getObjectById(croom.memory.links.hlink), {reusePath: 45});
                        }
                    }
                    else if (croom.storage) {
                        creep.moveTo(creep.room.storage, {
                            reusePath: 45
                            });
                        creep.transferEnergy(creep.room.storage);
                    }
                }
            }
            
            else if (croom.storage) {
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


        if (creep.carry.energy < creep.carryCapacity && creep.room.name !== 'E3S4' 
                /*&& _.filter(Memory.creeps, {
                'job': 'gather',
                'color': creep.memory.color
            }).length >= 1*/
            ) {

            if (!creep.memory.target) {

                var eTar = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY, {
                    filter: function(o) {
                        return o.energy > 300
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
                        var newdirection = (d1 + 3) % 8 + 1;
                        creep.say(newdirection);
                        creep.move(newdirection);
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
                    var avoidArray = creep.room.find(FIND_FLAGS);
                    var finalArray = [];
                    for(var i in avoidArray){
                        finalArray.push(avoidArray[i].pos);
                    }
                    creep.moveTo(Game.getObjectById(creep.memory.target), {
                        reusePath: 45, avoid: finalArray
                    });
                    creep.pickup(Game.getObjectById(creep.memory.target));
                }
            }
        }
        else {
            if(creep.room.name !== 'W2S6'){
                creep.moveTo(Game.spawns[creep.memory.homebase], {
                    reusePath: 45
                });
            }
            else{
                var pumps = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {filter: function(c){
                    return (c.getActiveBodyparts(WORK) > 5 && c.carry.energy < c.carryCapacity * .80);
                }})
                //console.log(pumps);
                if(creep.transferEnergy(pumps) === ERR_NOT_IN_RANGE){
                    var avoidArray = creep.room.find(FIND_FLAGS);
                    var finalArray = [];
                    for(var i in avoidArray){
                        finalArray.push(avoidArray[i].pos);
                    }
                    creep.moveTo(pumps, {reusePath: 30, avoid: finalArray});
                }
            }
        }

    }
}