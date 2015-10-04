/* 
global Game, Memory, FIND_MY_CREEPS, FIND_STRUCTURES, STRUCTURE_ROAD, STRUCTURE_WALL, STRUCTURE_RAMPART, _, WORK,ATTACK,
FIND_HOSTILE_CREEPS,FIND_CONSTRUCTION_SITES,CARRY,MOVE,AE,ERR_NOT_OWNER,ERR_BUSY, ERR_NOT_IN_RANGE,C,FIND_MY_STRUCTURES,STRUCTURE_EXTENSION,
FIND_MY_SPAWNS,RANGED_ATTACK, FIND_DROPPED_ENERGY
*/


module.exports = function(creep) {
    var hospital = Game.flags['hospital'];
    var health = creep.hits / creep.hitsMax;
    if(!creep.memory.state){
        creep.memory.state = 'active';
    }
    if(health < 0.5 || creep.memory.state === 'recover'){
        creep.moveTo(hospital,{reusePath: 15});
        creep.memory.state = 'recover';
    }
    else if(health === 1 && creep.memory.state === 'recover'){
        creep.memory.state = 'active'
    }
    else if(creep.memory.state === 'active'){
        var patient = creep.pos.findClosestByRange(FIND_MY_CREEPS, {filter: function(c){
          return c.hits < c.hitsMax;  
        }});
        if(patient){
            if(creep.heal(patient) === ERR_NOT_IN_RANGE){
                creep.moveTo(patient, {reusePath: 15});
                creep.rangedHeal(patient);
            }
            else{
                creep.heal(patient)
            }
        }
        else{
            creep.moveTo(hospital);
            creep.moveTo(creep.pos.findClosestByRange(FIND_MY_CREEPS, {filter: function(c){
            return c.getActiveBodyparts(RANGED_ATTACK) > 1 || c.getActiveBodyparts(ATTACK) > 1;
            }}), {reusePath:15});
        }
    
    }
    if(Game.flags['target'] && creep.room !== Game.flags['target'].room){
        creep.moveTo(Game.flags['target']);
    }

}