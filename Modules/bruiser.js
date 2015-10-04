module.exports = function(creep, creeplimit, croom, spawn) {
    var mem = croom.memory;
    var atarget = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
        filter: function(object) {
            return object.owner.username !== 'Vertigan' && object.owner.username !== 'DXWarlock' && object.owner.username !== 'Sylirant' && object.owner.username != 'Source Keeper' && object.owner.username !== 'Waveofbabies' && object.owner.username !== 'Vision' && object.owner.username !== 'Anima' && (object.getActiveBodyparts(ATTACK) > 0 || object.getActiveBodyparts(RANGED_ATTACK) > 0)
        }
    });
    var ctarget = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
        filter: function(object) {
            return object.owner.username !== 'Vertigan' && object.owner.username !== 'DXWarlock' && object.owner.username !== 'Sylirant' && object.owner.username != 'Source Keeper' && object.owner.username !== 'Waveofbabies' && object.owner.username !== 'Vision' && object.owner.username !== 'Anima'
        }
    });
    var spawn = creep.room.find(FIND_HOSTILE_STRUCTURES, {
        filter: function(object) {
            return object.structureType === STRUCTURE_SPAWN
        }
    });
    var starget = creep.room.find(FIND_HOSTILE_STRUCTURES, {
        filter: function(object) {
            return object.structureType !== STRUCTURE_CONTROLLER && object.structureType !== STRUCTURE_RAMPART && object.structureType !== STRUCTURE_KEEPER_LAIR
        }
    });
    var rtarget = creep.room.find(FIND_HOSTILE_STRUCTURES, {
        filter: function(object) {
            return object.structureType !== STRUCTURE_CONTROLLER
        }
    });
    var flagTarget = Game.flags['target'];
    if(Game.flags['rampart']){
    var rampartTarget = _.filter(Game.flags['rampart'].pos.lookFor('structure'),function(s){
        return s.structureType === STRUCTURE_RAMPART;
    })
    }
    if(creep.hits < creep.hitsMax/2){
        creep.moveTo(Game.flags['Flag77'], {
            reusePath: 35
        });
        if(atarget){
        creep.rangedAttack(atarget);
        }
        creep.heal(creep);
    }
    
    else if(rampartTarget && rampartTarget[0]){
        creep.memory.target = rampartTarget[0].id;
        if (creep.pos.getRangeTo(rampartTarget[0]) > 3) {
            creep.moveTo(rampartTarget[0], {
                reusePath: 10
            });
            creep.heal(creep)
        }
        else {
            creep.heal(creep);
        }
        creep.rangedAttack(rampartTarget[0]);
        creep.say('Seige!')
    }
    else if(Game.getObjectById(creep.memory.target)){
        if (creep.pos.getRangeTo(Game.getObjectById(creep.memory.target)) > 3) {
            creep.moveTo(Game.getObjectById(creep.memory.target), {
                reusePath: 10
            });
            creep.heal(creep)
        }
        else {
            creep.heal(creep);
        }
        creep.rangedAttack(Game.getObjectById(creep.memory.target));
        creep.say('Seige!!')
    }
    else if (atarget) {
        if (creep.pos.getRangeTo(atarget) > 3) {
            creep.moveTo(atarget, {
                reusePath: 10
            });
            creep.heal(creep)
            creep.rangedAttack(Game.getObjectById(creep.memory.target));
        }
        else {
            creep.heal(creep);
        }
        creep.rangedAttack(atarget);
        creep.say('Fight!')
    }
    
    else if (spawn.length) {
        creep.moveTo(starget[0], {
            reusePath: 5
        });
        creep.heal(creep);
        creep.rangedMassAttack(starget[0]);
        //console.log(starget[0]);
        creep.say('Spawn!');
    }
    else if (starget.length) {
        creep.moveTo(starget[0], {
            reusePath: 25
        });
        creep.heal(creep);
        creep.rangedAttack(starget[0]);
        //console.log(starget[0]);
        creep.say('Destroy');
    }
    else if (ctarget) {
        creep.moveTo(ctarget, {
            reusePath: 35
        });
        creep.heal(creep);
        creep.rangedAttack(ctarget);
        creep.say('Pillage')
    }

    else if (rtarget.length) {
        creep.moveTo(rtarget[0], {
            reusePath: 35
        });
        creep.heal(creep);
        creep.rangedAttack(rtarget[0]);
        //console.log(rtarget[0]);
        creep.say('Destroy R');
    }
    else {
        creep.moveTo(26, 14, {
            reusePath: 35
        });
        if (creep.hits < creep.hitsMax) {
            //creep.say('Self');
            creep.heal(creep);
        }
        else {
            //creep.say('Others');
            creep.heal(creep.pos.findInRange(FIND_MY_CREEPS, 1, {
                filter: function(o) {
                    return o.hits < o.hitsMax;
                }
            })[0])
        }
        //creep.say('CLEAR!');
    }
    if(flagTarget && creep.room !== flagTarget.room){
        creep.say('flag');
        delete creep.memory.target;
        creep.moveTo(flagTarget, {reusePath: 25});
    }


    //Game.creeps['Soldier1'].moveTo(4,36);
}