/* 
global Game, Memory, FIND_MY_CREEPS, FIND_STRUCTURES, STRUCTURE_ROAD, STRUCTURE_WALL, STRUCTURE_RAMPART, _, WORK,FIND_HOSTILE_CREEPS,FIND_CONSTRUCTION_SITES,CARRY,MOVE,AE
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
        if (croom.find(FIND_CONSTRUCTION_SITES).length > 15 && croom.memory.currentmode != 'building') {
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
            AE.makeQueue(croom);
            cpuTracking.push(['Spawn Start', Game.getUsedCpu()]);
            //Initial Memory reset for Spawning
            //Rebuild script to rebuild any creeps that died, need to deal with the issue of names still, won't build W1 when any other Ws exist
            if (Game.spawns[spawn] && croom.memory.updateCreeps === 0 && !Game.spawns[spawn].spawning) {
                if (cCreeps.length < creepgoal) {
                    croom.memory.spawnBit = 1;
                    var roleCount = croom.memory.mode.count;
                    //console.log(roleCount['builder']);
                    //console.log("Not Enough Creeps");
                    if (roleCount['harvester'] < Hgoal) {
                        //console.log("Building Worker");
                        var base = 'Worker';
                        var suffixn = 1;
                        var title = base.concat(suffixn.toString());
                        while (Game.spawns[spawn].canCreateCreep([WORK], title) == -3) {
                            suffixn = suffixn + 1;
                            title = base.concat(suffixn.toString());
                        }
                        Game.spawns[spawn].createCreep(mem.template.creeptype.harvester, title, {
                            role: 'harvester',
                            'homebase': spawn,
                            'spawnroom': Game.spawns[spawn].room.name
                        });
                        //console.log("Building Worker");
                        //console.log(croom.name);
                        //console.log(title);
                    }
                    else if (roleCount['farmer'] < FarmGoal) {
                        //console.log("Building Farmer");
                        var base = 'Farmer';
                        var suffixn = 1;
                        var title = base.concat(suffixn.toString());
                        while (Game.spawns[spawn].canCreateCreep([WORK], title) == -3) {
                            suffixn = suffixn + 1;
                            title = base.concat(suffixn.toString());
                        }
                        Game.spawns[spawn].createCreep(mem.template.creeptype.farmer, title, {
                            role: 'farmer',
                            'homebase': spawn,
                            'spawnroom': Game.spawns[spawn].room.name
                        });
                        //console.log("Building Farmer");
                        //console.log(title)
                    }
                    else if (roleCount['hauler'] < haulgoal) {
                        //console.log("Building Hauler");
                        var base = 'Hauler';
                        var suffixn = 1;
                        var title = base.concat(suffixn.toString());
                        while (Game.spawns[spawn].canCreateCreep([WORK], title) == -3) {
                            suffixn = suffixn + 1;
                            title = base.concat(suffixn.toString());
                        }
                        Game.spawns[spawn].createCreep(mem.template.creeptype.hauler, title, {
                            role: 'hauler',
                            'homebase': spawn,
                            'spawnroom': Game.spawns[spawn].room.name
                        });
                        //console.log("Building Hauler");
                        //console.log(roleCount['hauler']);
                    }
                    else if (roleCount['guard'] < guardgoal) {
                        //console.log("Building Guard");
                        var base = 'Guard';
                        var suffixn = 1;
                        var title = base.concat(suffixn.toString());
                        while (Game.spawns[spawn].canCreateCreep([WORK], title) == -3) {
                            suffixn = suffixn + 1;
                            title = base.concat(suffixn.toString());
                        }
                        Game.spawns[spawn].createCreep(mem.template.creeptype.guard, title, {
                            role: 'guard',
                            'homebase': spawn,
                            'spawnroom': Game.spawns[spawn].room.name
                        });
                        //console.log("Building Guard");
                        //console.log(title)
                    }
                    else if (roleCount['builder'] < Bgoal) {
                        //console.log("Building Builder");
                        var base = 'Builder';
                        var suffixn = 1;
                        var title = base.concat(suffixn.toString());
                        while (Game.spawns[spawn].canCreateCreep([WORK], title) == -3) {
                            suffixn = suffixn + 1;
                            title = base.concat(suffixn.toString());
                        }
                        Game.spawns[spawn].createCreep(mem.template.creeptype.builder, title, {
                            role: 'builder',
                            'homebase': spawn,
                            'spawnroom': Game.spawns[spawn].room.name
                        });
                        //console.log("Building Builder");
                    }
                    else if (roleCount['fighter'] < Fgoal) {
                        var base = 'Fighter';
                        var suffixn = 1;
                        var title = base.concat(suffixn.toString());
                        while (Game.spawns[spawn].canCreateCreep([WORK], title) == -3) {
                            suffixn = suffixn + 1;
                            title = base.concat(suffixn.toString());
                        }
                        Game.spawns[spawn].createCreep(mem.template.creeptype.fighter, title, {
                            role: 'fighter',
                            'homebase': spawn,
                            'spawnroom': Game.spawns[spawn].room.name
                        });
                        //console.log("Building Fighter");
                    }
                    else if (roleCount['runner'] < Rgoal) {
                        var base = 'Runner';
                        var suffixn = 1;
                        var title = base.concat(suffixn.toString());
                        while (Game.spawns[spawn].canCreateCreep([WORK], title) == -3) {
                            suffixn = suffixn + 1;
                            title = base.concat(suffixn.toString());
                        }
                        Game.spawns[spawn].createCreep(mem.template.creeptype.runner, title, {
                            role: 'runner',
                            'homebase': spawn,
                            'spawnroom': Game.spawns[spawn].room.name
                        });
                        //console.log("Building Runner");
                        //console.log(title)
                    }
                    else if (roleCount['repairer'] < Pgoal) {
                        var base = 'Repairer';
                        var suffixn = 1;
                        var title = base.concat(suffixn.toString());
                        while (Game.spawns[spawn].canCreateCreep([WORK], title) == -3) {
                            suffixn = suffixn + 1;
                            title = base.concat(suffixn.toString());
                        }
                        Game.spawns[spawn].createCreep(mem.template.creeptype.repairer, title, {
                            role: 'repairer',
                            'homebase': spawn,
                            'spawnroom': Game.spawns[spawn].room.name
                        });
                        //console.log("Building Repairer");
                        //console.log(title)
                    }
                    else if (roleCount['courier'] < Cgoal) {
                        var base = 'Courier';
                        var suffixn = 1;
                        var title = base.concat(suffixn.toString());
                        while (Game.spawns[spawn].canCreateCreep([WORK], title) == -3) {
                            suffixn = suffixn + 1;
                            title = base.concat(suffixn.toString());
                        }
                        Game.spawns[spawn].createCreep(mem.template.creeptype.courier, title, {
                            role: 'courier',
                            'homebase': spawn,
                            'spawnroom': Game.spawns[spawn].room.name
                        });
                        //console.log("Building Courier");
                        //console.log(title)
                    }

                    else if (roleCount['pumper'] < PumpGoal) {
                        var base = 'Pumper';
                        var suffixn = 1;
                        var title = base.concat(suffixn.toString());
                        while (Game.spawns[spawn].canCreateCreep([WORK], title) == -3) {
                            suffixn = suffixn + 1;
                            title = base.concat(suffixn.toString());
                        }
                        Game.spawns[spawn].createCreep(mem.template.creeptype.pumper, title, {
                            role: 'pumper',
                            'homebase': spawn,
                            'spawnroom': Game.spawns[spawn].room.name
                        });
                        //console.log("Building Pumper");
                        //console.log(title)
                    }
                    else if (roleCount['tanker'] < tankgoal) {
                        var base = 'Tanker';
                        var suffixn = 1;
                        var title = base.concat(suffixn.toString());
                        while (Game.spawns[spawn].canCreateCreep([WORK], title) == -3) {
                            suffixn = suffixn + 1;
                            title = base.concat(suffixn.toString());
                        }
                        Game.spawns[spawn].createCreep(mem.template.creeptype.tanker, title, {
                            role: 'tanker',
                            'homebase': spawn,
                            'spawnroom': Game.spawns[spawn].room.name
                        });
                        //console.log("Building Tanker");
                        //console.log(title)
                    }
                    else if (roleCount['attacker'] < attgoal) {
                        var base = 'Soldier';
                        var suffixn = 1;
                        var title = base.concat(suffixn.toString());
                        while (Game.spawns[spawn].canCreateCreep([WORK], title) == -3) {
                            suffixn = suffixn + 1;
                            title = base.concat(suffixn.toString());
                        }
                        Game.spawns[spawn].createCreep(mem.template.creeptype.attacker, title, {
                            role: 'attacker',
                            'homebase': spawn,
                            'spawnroom': Game.spawns[spawn].room.name
                        });
                        //console.log("Building Soldier");
                        //console.log(title)
                    }
                    else if (roleCount['gather'] < rmode.gather) {
                        var base = 'Gather';
                        var suffixn = 1;
                        var title = base.concat(suffixn.toString());
                        var creepcolor = 'white';
                        var greylimit = 2;
                        var purplelimit = 1;
                        var greenlimit = 1;
                        var yellowlimit = 2;
                        var orangelimit = 1;
                        if (croom.name === 'W1S4') {
                            creepcolor = 'grey';
                            if (_.filter(Memory.creeps, {
                                    'job': 'gather',
                                    'color': 'grey'
                                }).length >= greylimit) {
                                creepcolor = 'red';
                            }
                        }
                        if (croom.name === 'E5N2') {
                            creepcolor = 'red';
                        }
                        if (croom.name === 'W13N2') {
                            creepcolor = 'purple';
                            if (_.filter(Memory.creeps, {
                                    'job': 'gather',
                                    'color': 'purple'
                                }).length >= purplelimit) {
                                creepcolor = 'blue';
                                if (_.filter(Memory.creeps, {
                                        'job': 'gather',
                                        'color': 'blue'
                                    }).length >= 1) creepcolor = 'cyan';
                            }
                        }
                        if (croom.name === 'E6N13') {
                            creepcolor = 'green';
                            var greenfilter = _.filter(Memory.creeps, {
                                'job': 'gather',
                                'color': 'green'
                            }).length;
                            if (greenfilter >= greenlimit) {
                                creepcolor = 'yellow';
                            }
                            var yellowfilter = _.filter(Memory.creeps, {
                                'job': 'gather',
                                'color': 'yellow'
                            }).length;
                            if (yellowfilter >= yellowlimit && greenfilter >= greenlimit) {
                                creepcolor = 'orange';
                            }
                            var orangefilter = _.filter(Memory.creeps, {
                                'job': 'gather',
                                'color': 'orange'
                            }).length;
                            if (orangefilter >= orangelimit && greenfilter >= greenlimit && yellowfilter >= yellowlimit) {
                                creepcolor = 'brown';
                            }
                        }
                        while (Game.spawns[spawn].canCreateCreep([WORK], title) == -3) {
                            suffixn = suffixn + 1;
                            title = base.concat(suffixn.toString());
                        }
                        Game.spawns[spawn].createCreep(mem.template.creeptype.gather, title, {
                            role: 'claimer',
                            'color': creepcolor,
                            'job': 'gather',
                            'homebase': spawn,
                            'spawnroom': Game.spawns[spawn].room.name
                        });
                        console.log("Building Gather");
                        console.log(creepcolor);
                        //console.log(title)
                    }
                    else if (roleCount['ups'] < rmode.ups) {
                        //console.log("Building UPS");
                        var whitegoal = 3;
                        var purplegoal = 1;
                        var bluegoal = 3;
                        var cyangoal = 3;
                        var greygoal = 5;
                        var greengoal = 2;
                        var yellowgoal = 4;
                        var orangegoal = 2;

                        var base = 'UPS';
                        var suffixn = 1;
                        var title = base.concat(suffixn.toString());
                        var creepcolor = 'white';
                        if (croom.name === 'W1S4') {
                            creepcolor = 'grey';
                            if (_.filter(Memory.creeps, {
                                    'job': 'ups',
                                    'color': 'grey'
                                }).length >= greygoal) {
                                creepcolor = 'red';
                            }
                        }
                        if (croom.name === 'E5N2') creepcolor = 'red';
                        if (croom.name === 'W13N2') {
                            creepcolor = 'purple';
                            if (_.filter(Memory.creeps, {
                                    'job': 'ups',
                                    'color': 'purple'
                                }).length >= purplegoal) {
                                creepcolor = 'blue';
                                if (_.filter(Memory.creeps, {
                                        'job': 'ups',
                                        'color': 'blue'
                                    }).length >= bluegoal) creepcolor = 'cyan';
                            }
                        }
                        if (croom.name === 'E6N13') {
                            creepcolor = 'green';
                            var greencount = _.filter(Memory.creeps, {
                                'job': 'ups',
                                'color': 'green'
                            }).length;
                            if (greencount >= greengoal) {
                                creepcolor = 'yellow';
                            }
                            var yellowcount = _.filter(Memory.creeps, {
                                'job': 'ups',
                                'color': 'yellow'
                            }).length;
                            if (yellowcount >= yellowgoal && greencount >= greengoal) {
                                creepcolor = 'orange';
                            }
                            var orangecount = _.filter(Memory.creeps, {
                                'job': 'ups',
                                'color': 'orange'
                            }).length;
                            if (orangecount >= orangegoal && yellowcount >= yellowgoal && greencount >= greengoal) {
                                creepcolor = 'brown';
                            }
                        }


                        while (Game.spawns[spawn].canCreateCreep([WORK], title) == -3) {
                            suffixn = suffixn + 1;
                            title = base.concat(suffixn.toString());
                        }
                        Game.spawns[spawn].createCreep(mem.template.creeptype.ups, title, {
                            role: 'claimer',
                            'color': creepcolor,
                            'job': 'ups',
                            'homebase': spawn,
                            'spawnroom': Game.spawns[spawn].room.name
                        });
                        console.log("Building UPS in " + croom.name);
                        console.log(creepcolor);

                    }
                    else if (_.filter(Memory.creeps, {
                            'job': 'buildroam'
                        }).length < rmode.buildroam) {
                        //console.log("Building BuildRoam")
                        var base = 'BuildRoam';
                        var suffixn = 1;
                        var title = base.concat(suffixn.toString());
                        var creepcolor = 'orange';
                        while (Game.spawns[spawn].canCreateCreep([WORK], title) == -3) {
                            suffixn = suffixn + 1;
                            title = base.concat(suffixn.toString());
                        }
                        Game.spawns[spawn].createCreep(mem.template.creeptype.buildroam, title, {
                            role: 'claimer',
                            'color': creepcolor,
                            'job': 'buildroam',
                            'homebase': spawn,
                            'spawnroom': Game.spawns[spawn].room.name
                        });
                        //console.log("Building BuildRoam");
                        //console.log(title)
                    }
                    else if (_.filter(Memory.creeps, {
                            'job': 'bruiser'
                        }).length < rmode.bruiser) {
                        //console.log("Building BuildRoam")
                        var base = 'Bruiser';
                        var suffixn = 1;
                        var title = base.concat(suffixn.toString());
                        var creepcolor = 'purple';
                        while (Game.spawns[spawn].canCreateCreep([WORK], title) == -3) {
                            suffixn = suffixn + 1;
                            title = base.concat(suffixn.toString());
                        }
                        Game.spawns[spawn].createCreep(mem.template.creeptype.bruiser, title, {
                            'role': 'claimer',
                            'color': creepcolor,
                            'job': 'bruiser',
                            'homebase': spawn,
                            'spawnroom': Game.spawns[spawn].room.name
                        });
                        console.log("Building Bruiser");
                        //console.log(title)
                    }
                    else {
                        croom.memory.spawnBit = 0;
                    }
                }
                else {
                    croom.memory.spawnBit = 0;
                }

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
            //console.log('Setting up memory for ' + croom.name);
            //memorysetup(croom, 20, 37);
        }
    }
}