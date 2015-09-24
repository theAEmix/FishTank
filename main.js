//return;
global.AE = require('AEfunctions');
var cpuMain = [];
cpuMain.push(['Initial', Game.getUsedCpu()]);
//Memory.startCPU.push(Game.getUsedCpu());
/*
var stage = require('stage3w1s4');
stage();
*/

//Load all Modules at beginning
//Required Modules for this Code
var f = {};
//creeps that gather energy
f.harvester = require('harvester');
f.farmer = require('Farmer');
f.gather = require('gatherer');

//creeps that move energy
f.courier = require('Courier');
f.hauler = require('Hauler');
f.tanker = require('tanker');
//f.helper = require('helper');
f.ups = require('ups');
//f.banker = require('banker');

//creeps that use energy
f.builder = require('builder');
f.runner = require('runner');
f.repairer = require('Repairer');
f.pumper = require('Pumper');
//f.emt = require('emt');

//creeps that attack and defend
f.attacker = require('attacker');
f.guard = require('Guard');
//f.spawnguard = require('spawnguard');
//f.ranger = require('ranger');
//f.bruiser = require('bruiser');
//f.cleric = require('cleric');

//Utility creeps
f.claimer = require('claimer');
f.buildroam = require('BuildRoam');

//other utility script needed

f.flagpath = require('!flagpathing');
f.Roomcode = require('Roomcode');
f.followpath = require('!followpath');

cpuMain.push(['Module Def', Game.getUsedCpu()]);

//Game Memory Objects used by all roomcodes, check for exist and initialize

if (!Memory.flagCount) {
    Memory.flagCount;
}
if (!Memory.waypoints) {
    Memory.waypoints = {
        'white': {},
        'grey': {},
        'red': {},
        'purple': {},
        'blue': {},
        'cyan': {},
        'green': {},
        'yellow': {},
        'orange': {},
        'brown': {}
    };
}

if (!Memory.cpuLog) Memory.cpuLog = [];

if (Memory.cpuLog.length > 50) {
    Memory.cpuLog = _.drop(Memory.cpuLog, 3);
}

if (!Memory.cpuMain) Memory.cpuMain = [];

if (Memory.cpuMain.length > 25) {
    Memory.cpuMain = _.drop(Memory.cpuMain, 10);
}
if (!Memory.constants) Memory.constants = {
    'ramparthealth': [0, 0, 300000, 1000000, 3000000, 10000000, 30000000, 100000000, 300000000]
};
if (!Memory.roomCPUhistory) Memory.roomCPUhistory = [];

cpuMain.push(['Memory Check', Game.getUsedCpu()]);


//None really important. But the check is there now.

//invasion variable, not sure what it is here for.

//var invade = Game.flags['invade'];

//Memory creep check, if spawns are not spawning, clear memory on creeps, now loops spawns checking for spawning
var spawnIdle = 1;
for (var spawn in Game.spawns) {
    if (Game.spawns[spawn].spawning) {
        spawnIdle = 0;
    }
}
cpuMain.push(['Spawn Check', Game.getUsedCpu()]);
//console.log(spawnIdle===1);
//If no spawns are active, will return 1, and clear memory of creep clutter
if (spawnIdle === 1 || spawnIdle === 0) {
    for (var name in Memory.creeps) {
        //console.log(Memory.creeps[name]);
        if (!Game.creeps[name]) {
            Memory.rooms[Memory.creeps[name].spawnroom].updateCreeps = 1;
            delete Memory.creeps[name];
            console.log('Creep ' + name + ' memory deleted');
        }
    }
}
cpuMain.push(['Memory Cleanup', Game.getUsedCpu()]);

//Running Claimer Creeps, very CPU efficient, no pulls of creeps.
for (var rName in Game.rooms) {
    var croom = Game.rooms[rName];
    //console.log(croom.controller.my);
    if (croom.controller) {
        if (croom.controller.my) {
            if (croom.memory.mode) {
                croom.memory.mode.count = {
                    'harvester': 0,
                    'farmer': 0,
                    'gather': 0,
                    'courier': 0,
                    'hauler': 0,
                    'tanker': 0,
                    'helper': 0,
                    'ups': 0,
                    'banker': 0,
                    'runner': 0,
                    'repairer': 0,
                    'builder': 0,
                    'pumper': 0,
                    'emt': 0,
                    'attacker': 0,
                    'guard': 0,
                    'spawnguard': 0,
                    'ranger': 0,
                    'bruiser': 0,
                    'cleric': 0,
                    'claimer': 0,
                    'buildroam': 0
                };
            }
        }
    }
    cpuMain.push(['Count Reset : ' + rName, Game.getUsedCpu()]);
}

for (var i in Game.creeps) {
    var creep = Game.creeps[i];


    if (!creep) {
        croom.memory.updateCreeps = 1;
        //console.log('Creeps need update');
        continue;
    }
    if (creep.spawning === true) continue;

    var cRole = creep.memory.role;
    var croom = Game.rooms[creep.memory.spawnroom];
    var homebase = creep.memory.homebase;
    var spawnroom = creep.memory.spawnroom
    var creepgoal = Memory.rooms[spawnroom].mode[Memory.rooms[spawnroom].currentmode].totalCreeps;

    if (!cRole) {
        console.log('Unassigned Creep!');
        //this next step adds a pull request to the end of the scripting, this way, CPU isn't used early in the run for this
        mem.updateCreeps = 1;
    }
    else if (cRole && croom && homebase) {
        var tNRG = creep.pos.findInRange(FIND_DROPPED_ENERGY, 1);
        if (tNRG[0]) {
            creep.pickup(tNRG[0]);
        }
        if (!creep.memory.job) creep.memory.job = creep.memory.role;
        f[cRole](creep, creepgoal, croom, homebase);
        if (cRole === 'claimer') {
            cRole = creep.memory.job;
        }
        if (!croom.memory.mode.count[cRole]) {
            croom.memory.mode.count[cRole] = 0;
        }
        if (((creep.memory.color === 'red' && creep.memory.job === 'gather') || (creep.memory.color === 'green' && creep.memory.job === 'ups')) && creep.ticksToLive < 100) {}
        else {
            croom.memory.mode.count[cRole] = croom.memory.mode.count[cRole] + 1;
        }

    }
    cpuMain.push([creep.name, Game.getUsedCpu()]);
}

cpuMain.push(['Main ran creeps', Game.getUsedCpu()]);

//Running room Based Scripts
var cpuRoom = [];
//Room Loop for running major code
for (var rName in Game.rooms) {
    var croom = Game.rooms[rName];
    //console.log(croom.controller.my);
    if (croom.controller) {
        if (croom.controller.my) {
            f.Roomcode(croom, croom.memory.currentmode);
        }
    }
    cpuRoom.push([rName, Game.getUsedCpu()]);
    cpuMain.push(['Roomcode : ' + rName, Game.getUsedCpu()]);
}
cpuMain.push(['Roomcode Total', Game.getUsedCpu()]);


//Run Flag Path Module to check for new paths or flags
f.flagpath();
cpuMain.push(['Flagpath', Game.getUsedCpu()]);

//This is a tail end function that refreshes object arrays for the rooms based on how much CPU was used in the previous cycle. 
// Guy on the forum gave me the idea of managing CPU intensive tasks by queueing them at the end of the main when needed.
// Additionally, it manages room memory, and deletes any rooms i no longer have the object for
for (var name in Memory.rooms) {

    var mroom = Memory.rooms[name];
    // console.log(mroom.updateCreeps);
    var croom = Game.rooms[name];
    if (croom) {
        var updateTimer = 50;
        var setpoints = croom.memory.setpoints;

        if (mroom.updateCreeps === undefined || mroom.updateCreeps === null) mroom.updateCreeps = 1;
        if (mroom.updateStructures === undefined || mroom.updateStructures === null) mroom.updateStructures = 1;
        if (mroom.updateRepair === undefined || mroom.updateRepair == null) mroom.updateRepair = 1;
        if (mroom.updateCreeps === 1 || mroom.updateStructures > updateTimer) {
            mroom.mCreeps = Game.rooms[name].find(FIND_MY_CREEPS, {
                filter: function(c) {
                    return (c.memory.job !== 'ups' && c.memory.job !== 'gather' && c.memory.role !== 'claimer' && c.memory.role !== 'buildroam')
                }
            });
            mroom.updateCreeps = 0;
            //console.log('Creeps updated in room ' + croom.name);
        }
        if (mroom.updateStructures > updateTimer && Game.getUsedCpu() <= Game.cpuLimit - 5) {
            mroom.mStructures = croom.find(FIND_STRUCTURES);
            mroom.updateStructures = 0;
            console.log('Structures updated in room ' + croom.name);
            mroom.updateRepair = 1;
        }
        if (mroom.updateRepair === 1 && Game.getUsedCpu() <= Game.cpuLimit - 5) {
            var i = 0.9;
            mroom.mRepair = _.filter(mroom.mStructures,
                function(o) {
                    return (
                        (o.structureType == STRUCTURE_RAMPART && o.hits / setpoints.ramparthealth < i) || (o.structureType == STRUCTURE_WALL && o.hits / setpoints.wallhealth < i && o.hitsMax !== 1) || (o.structureType == STRUCTURE_ROAD && o.hits / o.hitsMax < i) || (o.structureType == STRUCTURE_SPAWN && o.hits / o.hitsMax < 1)
                    );
                });
            mroom.updateRepair = 0;
            mroom.mSites = _.sortBy(croom.find(FIND_CONSTRUCTION_SITES), 'progressTotal');
            //console.log('Repair updated in room ' + croom.name);
        }
    }
    else {
        delete Memory.rooms[name];
        //console.log('Room ' + name + ' deleted');
    }
}
cpuMain.push(['Array Updates', Game.getUsedCpu()]);
Memory.cpuMain.push(cpuMain);

Memory.cpuLog.push(_.last(cpuMain, 1)[1]);
//console.log(cpuMain);
