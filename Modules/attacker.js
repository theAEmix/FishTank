module.exports = function(creep, creeplimit, croom, spawn) {
    var mem = croom.memory;
    var atarget = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
        filter: function(object) {
            return object.owner.username !== 'Vertigan' 
            && object.owner.username !== 'DXWarlock' 
            && object.owner.username !== 'Sylirant' 
            && object.owner.username != 'Source Keeper'
            && object.owner.username !== 'Waveofbabies'
            && object.owner.username !== 'Vision'
            && (object.getActiveBodyparts(ATTACK) > 0 || object.getActiveBodyparts(RANGED_ATTACK) > 0)
        }
    });
    var ctarget = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
        filter: function(object) {
            return object.owner.username !== 'Vertigan' 
            && object.owner.username !== 'DXWarlock' 
            && object.owner.username !== 'Sylirant' 
            && object.owner.username != 'Source Keeper'
            && object.owner.username !== 'Waveofbabies'
            && object.owner.username !== 'Vision'
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
    if (atarget) {
        if (creep.pos.getRangeTo(atarget) > 1) {
            creep.moveTo(atarget, {reusePath: 10});
            creep.heal(creep)
        }
        else{
        creep.attack(atarget);
        }
        creep.rangedAttack(atarget);
        creep.say('Fight!')
    }
    else if (spawn.length) {
        creep.moveTo(starget[0], {reusePath: 25});
        creep.attack(starget[0]);
        creep.rangedAttack(starget[0]);
        console.log(starget[0]);
        creep.say('Spawn!');
    }
    else if (starget.length) {
        creep.moveTo(starget[0], {reusePath: 25});
        creep.attack(starget[0]);
        creep.rangedAttack(starget[0]);
        console.log(starget[0]);
        creep.say('Destroy');
    }
    else if (ctarget) {
        creep.moveTo(ctarget, {reusePath: 35});
        creep.attack(ctarget);
        creep.rangedAttack(ctarget);
        creep.say('Pillage')
    }

    else if (rtarget.length) {
        creep.moveTo(rtarget[0], {reusePath: 35});
        creep.attack(rtarget[0]);
        creep.rangedAttack(rtarget[0]);
        //console.log(rtarget[0]);
        creep.say('Destroy R');
    }
    else {
        creep.moveTo(28, 31, {reusePath: 35});
        if(creep.hits < creep.hitsMax){
            //creep.say('Self');
            creep.heal(creep);
        }
        else{
            //creep.say('Others');
            creep.heal(creep.pos.findInRange(FIND_MY_CREEPS,1,{filter: function(o){ return o.hits<o.hitsMax;}})[0])
        }
        //creep.say('CLEAR!');
    }


    //Game.creeps['Soldier1'].moveTo(4,36);
}