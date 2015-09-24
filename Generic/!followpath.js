module.exports = function(creep, color) {
    var pathColor = color;
    var startFlagName = Object.keys(Memory.waypoints[pathColor])[0];
    var startFlag = Game.flags[startFlagName];
    var startFlagMem = Memory.waypoints[pathColor][startFlagName];
    //var pathFind = require('pathFind');
    //console.log('Follow Initiated');
    if (!creep.memory.path && creep.memory.status !== 'arrived' && !creep.memory.end) {
        //console.log('Start');
        creep.moveTo(startFlag);
        //console.log(startFlag)
        if (creep.pos.getRangeTo(startFlag) < 1) {
            //console.log('Assigning Path from Start Flag');
            creep.memory.start = startFlagName;
            creep.memory.end = startFlagMem.destination;
            creep.memory.path = startFlagMem.path;
        }
    }
    else if (!creep.memory.path && creep.memory.status !== 'arrived') {
        creep.memory.path = creep.pos.findPathTo(Game.flags[creep.memory.end]);
        //console.log('Finding new path to ' + creep.memory.end);
        //console.log('In Initial Approach');
    }
    else if (creep.memory.path) {
        if (creep.pos.getRangeTo(Game.flags[creep.memory.end]) < 1) {
            var cFlagName = creep.memory.end;
            var cFlagMem = Memory.waypoints[pathColor][cFlagName];
            //console.log('In Approach');
            if (!cFlagMem.path && !cFlagMem.destination) {
                delete creep.memory.start;
                delete creep.memory.path;
                //console.log('Arrived!');
                creep.memory.status = 'arrived';
            }
            else if (!cFlagMem.path && cFlagMem.destination) {
                //console.log('Flag has no Path, calculating now');
                creep.memory.start = creep.memory.end;
                creep.memory.end = cFlagMem.destination;
                cFlagMem.path = Game.flags[cFlagName].pos.findPathTo(Game.flags[cFlagMem.destination]);
                creep.memory.path = cFlagMem.path;
            }
            else {
                //console.log('Setting Next Destination')
                creep.memory.start = creep.memory.end
                creep.memory.path = cFlagMem.path;
                creep.memory.end = cFlagMem.destination;
            }
        }
        else {
            //console.log('Pathing');
            if (creep.memory.homeroom !== creep.room.name) {
                //console.log('Creep assigned to Room ' + creep.room.name);
                creep.memory.homeroom = creep.room.name;
                creep.moveTo(Game.flags[creep.memory.end]);
                delete creep.memory.path;
            }
            else {
                //creep.say(creep.memory.end);
                //console.log('Move by Path to ' + creep.memory.end);
                //console.log(creep.moveByPath(creep.memory.path) == 0)

                if (creep.memory.job === 'gather' && creep.pos.findInRange(FIND_HOSTILE_CREEPS, 1)[0]) {
                    creep.attack(creep.pos.findInRange(FIND_HOSTILE_CREEPS, 1)[0]);
                }
                if (creep.moveByPath(creep.memory.path) == 0) {
                    creep.moveByPath(creep.memory.path) == 0;
                }

                else {
                    creep.moveTo(Game.flags[creep.memory.end]);
                    creep.say('Moving');
                }
            }
        }
    }
    else if (creep.memory.status === 'arrived') {
        //creep.say('Arrived!');
    }



    else {
        creep.say('>_<');
    }

}