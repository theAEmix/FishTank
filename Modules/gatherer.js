module.exports = function(creep) {
    //var pathFind = require('pathFind');
    var gatherers = _.filter(Game.creeps, 'memory.job', 'gather');
    //console.log(creep);
    if (!creep.memory.farm) {
        var source = creep.pos.findClosestByRange(FIND_SOURCES, {
            filter: function(o) {
                return !_.filter(gatherers, 'memory.farm', o.id)[0]
            }
        });
        if (!source) {
            creep.suicide();
            return;
        }
        else {
            creep.memory.farm = source.id;
        }
    }
    var farm = Game.getObjectById(creep.memory.farm);
    if (creep.pos.getRangeTo(farm) > 1) creep.moveTo(farm, {
        reusePath: 35
    });
    else {
        creep.harvest(farm);
    }
}