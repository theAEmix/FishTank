module.exports = function(creep, creeplimit, croom, spawn) {
    var home = Game.spawns[spawn];
    var idle = croom.memory.idlespot.creeptype.farmer;
    var clink = Game.getObjectById(croom.memory.links.clink);
    var plink = Game.getObjectById(croom.memory.links.plink);
    var mem = Game.rooms[croom.name].memory;


    //suicide catch all to reset the toggle for each source
    if (!creep.memory.target){
        AE.getTarget(mem.sources, creep, 1);
        creep.memory.farmID = creep.memory.target;
        if(Game.getObjectById(creep.memory.target).pos.findInRange(FIND_STRUCTURES, 2,{filter: {structureType:STRUCTURE_LINK}})[0] !== undefined){
        creep.memory.linkId = (Game.getObjectById(creep.memory.target).pos.findInRange(FIND_STRUCTURES, 2,{filter: {structureType:STRUCTURE_LINK}})[0].id);
        }
    }

    //if it has an assignment, leave it be and let it run
    else {
        var plotId = creep.memory.target;
        var plot = Game.getObjectById(plotId);
        var iLink = Game.getObjectById(creep.memory.linkId);
        if (creep.pos.getRangeTo(plot) > 1) {
            creep.moveTo(plot);
        }
        else {
            creep.harvest(plot);
            if (iLink) {
                if (creep.pos.getRangeTo(iLink) > 1) {
                    creep.moveTo(iLink);
                }
                creep.transferEnergy(iLink);
            }
            //console.log('Moving to plot....');
        }

        if (iLink) {
            if (iLink.energy > iLink.energyCapacity * 4 / 5) {
                    iLink.transferEnergy(clink);
            }
        }
    }

}