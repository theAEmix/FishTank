/* 
global Game, Memory, FIND_MY_CREEPS, FIND_STRUCTURES, STRUCTURE_ROAD, STRUCTURE_WALL, STRUCTURE_RAMPART, _, WORK,ATTACK,
FIND_HOSTILE_CREEPS,FIND_CONSTRUCTION_SITES,CARRY,MOVE,AE,ERR_NOT_OWNER,ERR_BUSY, ERR_NOT_IN_RANGE,C,FIND_MY_STRUCTURES,STRUCTURE_EXTENSION,
FIND_MY_SPAWNS,RANGED_ATTACK
*/

module.exports = function(croom, cmodeString, invade) {
    var memorysetup = require('zRoomMemTemp');

    if (croom.memory.currentmode) {
        //initialize the CPU tracking function
        var cpuTracking = [];
        cpuTracking.push(['Start', Game.getUsedCpu()]);
        //Room check for ownership, in case for some strange reason, the main doesn't catch it.
        if (croom.controller) {
            if (croom.controller.my) {
                if (!Game.spawns[croom.memory.spawnname.name1]) {
                    console.log('There is no spawn, room deleting');
                    delete Memory.rooms[croom.name];
                }
                //console.log(croom.name + ' is my room');
            }
            else {
                console.log(croom.name + ' is not my room');
                return;
            }
        }
        else {
            console.log(croom.name + ' is no ones.');
            return;
        }

        // defining all modules called in this one
        var f = {};
        f.consolestatus = require('status');
        cpuTracking.push(['Status Def', Game.getUsedCpu()]);
        f.upgrade = require('upgrade');
        cpuTracking.push(['Upgrade Def', Game.getUsedCpu()]);
        //AE.spawnSay(croom.memory.spawnname.name1);


        //local variables for use later in script
        var mem = Game.rooms[croom.name].memory;
        var rmode = mem.mode[cmodeString];
        var statuscount = Game.rooms[croom.name].memory.update;
        var updatelimit = 100;
        cpuTracking.push(['Var Define', Game.getUsedCpu()]);


        //Total number of each template to keep, later to be roped into a for loop for each type
        var Bgoal = rmode.builder;
        var Hgoal = rmode.harvester;
        var Fgoal = rmode.fighter;
        var Rgoal = rmode.runner;
        var Pgoal = rmode.repairer;
        var Cgoal = rmode.courier;
        var FarmGoal = rmode.farmer;
        var PumpGoal = rmode.pumper;
        var tankgoal = rmode.tanker;
        var haulgoal = rmode.hauler;
        var guardgoal = rmode.guard;
        var attgoal = rmode.attacker;
        //Total Creeps to keep alive, later for loop
        var creepgoal = rmode.totalCreeps;
        cpuTracking.push(['Limit Define', Game.getUsedCpu()]);
        var hCreeps = croom.find(FIND_HOSTILE_CREEPS, {
            filter: function(o) {
                return (o.owner.username !== 'DXWarlock' && o.owner.username !== 'Sylirant' && o.owner.username !== 'DewJunkie' && o.owner.username !== 'Vertigan' && o.owner.username !== 'Waveofbabies' && o.owner.username !== 'Vision')
            }
        })[0];
        if (hCreeps && croom.memory.currentmode !== 'defense') {
            croom.memory.currentmode = 'defense';
            Game.notify('Enemy creep detected: [' + hCreeps.owner.username + '] , changing to defense mode, FYI, in room ' + croom.name);
            console.log('Changing to DEFENSE mode due to enemy creeps in ' + croom.name);
        }
        if (croom.memory.currentmode === 'defense' && !croom.find(FIND_HOSTILE_CREEPS, {
                filter: function(o) {
                    return (o.owner.username !== 'DXWarlock' && o.owner.username !== 'AzuraStar' && o.owner.username !== 'Sylirant' && o.owner.username !== 'DewJunkie')
                }
            })[0]) {
            croom.memory.currentmode = 'general';
            console.log('Changing to General mode due to no more enemies in ' + croom.name);
        }
        if (croom.find(FIND_CONSTRUCTION_SITES).length > 15 && croom.memory.currentmode != 'building' && croom.memory.currentmode !== 'defense') {
            croom.memory.currentmode = 'building';
            console.log('Changing to Building Mode in room ' + croom.name);
        }
        if (!mem.roomStage) {
            mem.roomStage = 1;
            console.log('Stage 1!');
            mem.upgradestage = 0;
        }
        if (!mem.spawnname.name1) {
            for (var i in Game.spawns) {
                if (Game.spawns[i].pos.roomName === croom.name) {
                    mem.spawnname.name1 = i;
                    console.log('Spawn Name Established');
                }
            }
        }
        cpuTracking.push(['Mode manage', Game.getUsedCpu()]);
        //variable for spawn name, will need expanded later when 2nd spawns are common.
        var spawn = mem.spawnname.name1;

        //Verifying Level Memory Object for future updates
        if (!croom.memory.rLevel) {
            croom.memory.rLevel = 0
        }
        var rLevel = croom.memory.rLevel;
        if (rLevel !== croom.controller.level) {
            croom.memory.rLevel = croom.controller.level;
            rLevel = croom.memory.rLevel;
            croom.memory.setpoints.maxhealth = Memory.constants.ramparthealth[rLevel];
        }
        if(!croom.memory.remoteMines){
            croom.memory.remoteMines = {};
        }

        //find all creeps in this room that aren't from here. 
        var foreigncreep = croom.find(FIND_MY_CREEPS, {
            filter: function(object) {
                return object.memory.homeroom != croom.name;
            }
        });

        cpuTracking.push(['Foreign', Game.getUsedCpu()]);

        //console.log(foreigncreep);
        //reassigns the homeroom of any creeps that came from another room
        if (foreigncreep[0]) {
            mem.updateCreeps = 1;
            //console.log('Foreign Creep Detected');
            for (var creep in foreigncreep) {
                foreigncreep[creep].memory.homeroom = croom.name;
                //console.log('Creep Reassigned to Room ' + croom.name);

            }
        }

        //New way to pull creep data for the room

        var cCreeps = croom.memory.mCreeps;

        if (!cCreeps) {
            croom.memory.mCreeps = [];
        }
        if (cCreeps.length === 0) {
            Game.spawns[spawn].createCreep([WORK, CARRY, MOVE], null, {
                role: 'harvester',
                'job': 'harvester',
                'homebase': spawn,
                'spawnroom': Game.spawns[spawn].room.name
            });
            console.log('EMERGENCY, EMERGENCY, WE NEED A CRASH CART, STAT!!!! in room ' + croom.name);
            Game.notify('EMT creep created due to script hang');
            croom.memory.updateCreeps = 1;
        }
        else {
            cpuTracking.push(['Spawn Start', Game.getUsedCpu()]);
            AE.makeQueue(croom);
            //New spawning Mechanic
            if (croom.memory.spawnQueue.length > 0) {
                //console.log("yy Entering New Spawn Cycle for room : " + croom.name);
                for (var i in croom.memory.spawnname) {
                    var tempSpawn = Game.spawns[croom.memory.spawnname[i]];
                    if (!tempSpawn) {
                        delete croom.memory.spawnname[i];
                    }
                    else {
                        if (!tempSpawn.spawning && croom.memory.spawnQueue[0]) {
                            if (AE.spawnCreep(croom.memory.spawnQueue[0], tempSpawn) === true) {
                                console.log(croom.memory.spawnQueue[0] + ' was successfully spawned.')
                                croom.memory.spawnQueue = _.drop(croom.memory.spawnQueue, 1);
                                console.log('1 queue slot dropped in ' + croom.name + ' next in queue is ' + croom.memory.spawnQueue[0] + ' with ' + croom.memory.spawnQueue.length + ' left in queue.');
                            }
                            else {
                                //console.log('Cannot Spawn at ' + tempSpawn.name);
                            }
                        }
                        else {
                            //console.log(tempSpawn.name + ' is currently spawning, queue has ' + croom.memory.spawnQueue.length + ' left in queue');
                        }
                    }
                }
            }
            else {
                //console.log('xx No queue for spawning in ' + croom.name);
            }

            cpuTracking.push(['Spawn End', Game.getUsedCpu()]);
            //Timer script
            mem.updateStructures = mem.updateStructures + 1;

            //console.log(croom.memory.spawnBit + ' is the spawnbit for ' + croom.name);
            cpuTracking.push(['Status Start', Game.getUsedCpu()]);
            //console.log(cCreeps);
            //Game.creeps['Builder2'].moveTo(7,11)
            if (statuscount <= updatelimit) {
                statuscount = statuscount + 1;
                Game.rooms[croom.name].memory.update = statuscount;
            }
            else {
                statuscount = 1;
                Game.rooms[croom.name].memory.update = statuscount;
                if (croom && rmode && spawn) {
                    //console.log(creepgoal + croom + rmode + spawn);
                    //console.log('Status initializing in ' + croom);
                    f.consolestatus(creepgoal, croom, rmode, spawn);
                    for (var i in croom.memory.mode) {
                        var j = croom.memory.mode[i];
                        var total = _.sum(j) - _.get(j, 'totalCreeps');
                        j.totalCreeps = total;
                        //console.log('Memory Verified');
                    }
                }
                else {
                    console.log('No spawn in ' + croom);
                }
            }
            cpuTracking.push(['Status End, M End', Game.getUsedCpu()]);
            Memory.roomCPUhistory.push(cpuTracking);
            if (Memory.roomCPUhistory.length > 25) {
                Memory.roomCPUhistory = _.drop(Memory.roomCPUhistory, 10);
            }

            //console.log(cpuTracking);
        }
    }
    else {
        if (croom.energyCapacityAvailable >= 300) {
            console.log('Setting up memory for ' + croom.name);
            memorysetup(croom, 23,27);
        }
    }
}