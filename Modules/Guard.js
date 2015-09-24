module.exports = function(creep, creeplimit, croom, spawn) {
    var mem = croom.memory;
    var ctarget = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
        filter: function(object) {
            return object.owner.username != 'Source Keeper'
        }
    });
    var idle = croom.memory.idlespot.creeptype.guard;
    //return;
    //console.log(ctarget);
    if (creep.ticksToLive <= 2) {
        for (var i in mem.guardposts)
            if (mem.guardposts[i].tag == creep.memory.post) {
                mem.guardposts[i].status = 0;
                break;
            }
        creep.say('Suicide');
    }
    //if the creep is new, need to assign a farm
    else if (!creep.memory.post) {

        creep.say('Assigning');
        for (var i in mem.guardposts) {
            if (mem.guardposts[i].status === 0) {
                creep.memory.post = mem.guardposts[i].tag;
                mem.guardposts[i].status = 1;
                creep.say('Post ' + (i + 1));
                break;
            }
        }

    }
    else {
        var currentpost = Game.getObjectById(creep.memory.post);
        //console.log(creep.pos.x !== currentpost.pos.x || creep.pos.y !== currentpost.pos.y);
        if (creep.pos.x !== currentpost.pos.x || creep.pos.y !== currentpost.pos.y) {
            creep.moveTo(currentpost.pos.x, currentpost.pos.y, {
                reusePath: 15
            });
            //creep.say('Enroute');

        }
        if (creep.pos.getRangeTo(ctarget) <= 5 && ctarget) {
            creep.attack(ctarget);
            creep.rangedAttack(ctarget);
            creep.say('Attack!');
        }
        else {
            //creep.say('On Guard');
        }

    }

}