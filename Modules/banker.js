module.exports = function(creep, creeplimit, croom, spawn) {
    var home = Game.spawns[spawn];
    var idle = croom.memory.idlespot.creeptype.hauler;
    if(creep.carry.energy === 0){
        if(creep.room.storage.transferEnergy(creep) === ERR_NOT_IN_RANGE){
            creep.moveTo(creep.room.storage, {reusePath: 20});
        }
        else{
            creep.room.storage.transferEnergy(creep)
        }
    }
    else{
        //creep.say('hi');
        AE.deliverExt(creep);
    }
    
    
    
    
    
    
    
    
    
}