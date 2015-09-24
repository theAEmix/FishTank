/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('upgrade'); // -> 'a thing'
 */
 module.exports = function (croom,cLevel){
     var mem = Memory.rooms[croom.name];
     console.log(cLevel);
    if(cLevel === 1){
        mem.roomStage = 2;
        console.log('Stage 1 Finished, Upgrading to 2');
        mem.mode.building = {'builder':2,'harvester':8,'fighter':0,'runner':6,'repairer':0,'courier':0,'farmer':0,'pumper':0,'tanker':0,'hauler':0,'guard':0,'attacker':0,'totalCreeps':16};
        mem.mode.general = {'builder':0,'harvester':8,'fighter':0,'runner':6,'repairer':0,'courier':0,'farmer':0,'pumper':0,'tanker':0,'hauler':0,'guard':0,'attacker':0,'totalCreeps':14};
        mem.mode.idle = {'builder':0,'harvester':2,'fighter':0,'runner':0,'repairer':0,'courier':0,'farmer':0,'pumper':0,'tanker':0,'hauler':0,'guard':0,'attacker':0,'totalCreeps':2};
        mem.mode.shutdown = {'builder':0,'harvester':0,'fighter':0,'runner':0,'repairer':0,'courier':0,'farmer':0,'pumper':0,'tanker':0,'hauler':0,'guard':0,'attacker':0,'totalCreeps':0};
        mem.mode.buildonly = {'builder':6,'harvester':8,'fighter':0,'runner':0,'repairer':0,'courier':0,'farmer':0,'pumper':0,'tanker':0,'hauler':0,'guard':0,'attacker':0,'totalCreeps':14};
        console.log('Modes set to new values');
        mem.template.creeptype.courier = [CARRY,MOVE];
        mem.template.creeptype.builder = [WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE];
        mem.template.creeptype.harvester = [WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE];
        mem.template.creeptype.fighter = [TOUGH,TOUGH,ATTACK,ATTACK,MOVE,MOVE,MOVE,MOVE];
        mem.template.creeptype.runner = [WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE];
        mem.template.creeptype.repairer = [WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE];
        mem.template.creeptype.farmer = [WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE];
        mem.template.creeptype.pumper = [WORK,WORK,WORK,WORK,CARRY,MOVE];
        mem.template.creeptype.hauler = [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE];
        mem.template.creeptype.tanker = [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE];
        mem.template.creeptype.guard = [TOUGH,TOUGH,ATTACK,ATTACK,MOVE,MOVE,MOVE,MOVE];
        mem.template.creeptype.ups = [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE];
        mem.template.creeptype.attacker = [TOUGH,TOUGH,ATTACK,ATTACK,MOVE,MOVE,MOVE,MOVE];
        console.log('Creep Templates Reconfigured');
        mem.upgradestage = 0;
        console.log('Bit reset to ' + mem.upgradestage);
        console.log('Reticulating Splines');
        console.log('Viola!');
    } 
    else if(cLevel === 2){
        roads = Memory.stage3w1s4.roads;
        extensions = Memory.stage3w1s4.extensions;
        walls = Memory.stage3w1s4.walls;
        mem.roomStage = 3;
        mem.upgradestage = 0;
        console.log('Stage 2 Finished, Upgrading to 3');
        console.log('Modes Unchanged');
        console.log('Bit Reset');
        console.log('Attempting to place Sites .... ');
        for(var i in roads){
            croom.createConstructionSite(roads[i].x,roads[i].y,STRUCTURE_ROAD);
            console.log('Site created at ' + roads[i].x + ',' + roads[i].y + ' Road');
        }
        for(var i in walls){
            croom.createConstructionSite(walls[i].x,walls[i].y,STRUCTURE_WALL);
            console.log('Site created at ' + walls[i].x + ',' + walls[i].y + ' Wall');
        }
        for(var i in extensions){
            croom.createConstructionSite(extensions[i].x,extensions[i].y,STRUCTURE_EXTENSION);
            console.log('Site created at ' + extensions[i].x + ',' + extensions[i].y + ' Extension');
        }
        mem.currentmode = 'buildonly';
        console.log('Construction Placed, closing upgrader');
        console.log('Success!');
        console.log('No splines this time')
        Game.notify('Upgraded to stage ' + mem.roomStage);
    }
    else if(cLevel === 3){
        
        console.log('Stage 3 Finished, Upgrading to 4');
        mem.mode.building = {'builder':2,'harvester':0,'fighter':0,'runner':0,'repairer':1,'courier':1,'farmer':2,'pumper':3,'tanker':5,'hauler':4,'guard':0,'attacker':0,'totalCreeps':18};
        mem.mode.general = {'builder':0,'harvester':0,'fighter':0,'runner':0,'repairer':1,'courier':1,'farmer':2,'pumper':4,'tanker':6,'hauler':4,'guard':0,'attacker':0,'totalCreeps':18};
        mem.mode.idle = {'builder':0,'harvester':2,'fighter':0,'runner':0,'repairer':0,'courier':0,'farmer':0,'pumper':0,'tanker':0,'hauler':0,'guard':0,'attacker':0,'totalCreeps':3};
        mem.mode.shutdown = {'builder':0,'harvester':0,'fighter':0,'runner':0,'repairer':0,'courier':0,'farmer':0,'pumper':0,'tanker':0,'hauler':0,'guard':0,'attacker':0,'totalCreeps':0};
        mem.mode.buildonly = {'builder':6,'harvester':0,'fighter':0,'runner':0,'repairer':1,'courier':0,'farmer':2,'pumper':0,'tanker':0,'hauler':4,'guard':0,'attacker':0,'totalCreeps':13};
        console.log('Modes set to new values');
        mem.template.creeptype.courier = [CARRY,MOVE];
        mem.template.creeptype.builder = [WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE];
        mem.template.creeptype.harvester = [WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE];
        mem.template.creeptype.fighter = [TOUGH,TOUGH,ATTACK,ATTACK,MOVE,MOVE,MOVE,MOVE];
        mem.template.creeptype.runner = [WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE];
        mem.template.creeptype.repairer = [WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE];
        mem.template.creeptype.farmer = [WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE];
        mem.template.creeptype.pumper = [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE];
        mem.template.creeptype.hauler = [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE];
        mem.template.creeptype.tanker = [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];
        mem.template.creeptype.guard = [TOUGH,TOUGH,ATTACK,ATTACK,RANGED_ATTACK,RANGED_ATTACK,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];
        mem.template.creeptype.ups = [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE];
        mem.template.creeptype.attacker = [TOUGH,TOUGH,ATTACK,ATTACK,MOVE,MOVE,MOVE,MOVE];
        console.log('Creep Templates Reconfigured');
        mem.roomStage = 4;
        mem.upgradestage = 0;
        console.log('Bit reset to ' + mem.upgradestage);
        console.log('Reticulating Splines');
        console.log('Viola!');
        Game.notify('Upgraded to stage ' + mem.roomStage);
    }
    /*
    else if(cLevel === 4){
        mem.roomStage = 5;
        mem.mode.building = {'builder':2,'harvester':8,'fighter':0,'runner':6,'repairer':0,'courier':0,'farmer':0,'pumper':0,'tanker':0,'hauler':0,'guard':0,'attacker':0,'totalCreeps':17};
        mem.mode.general = {'builder':0,'harvester':8,'fighter':0,'runner':6,'repairer':0,'courier':0,'farmer':0,'pumper':0,'tanker':0,'hauler':0,'guard':0,'attacker':0,'totalCreeps':15};
        mem.mode.idle = {'builder':0,'harvester':2,'fighter':0,'runner':0,'repairer':0,'courier':0,'farmer':0,'pumper':0,'tanker':0,'hauler':0,'guard':0,'attacker':0,'totalCreeps':3};
        mem.mode.shutdown = {'builder':0,'harvester':0,'fighter':0,'runner':0,'repairer':0,'courier':0,'farmer':0,'pumper':0,'tanker':0,'hauler':0,'guard':0,'attacker':0,'totalCreeps':0};
        mem.mode.buildonly = {'builder':6,'harvester':8,'fighter':0,'runner':0,'repairer':0,'courier':0,'farmer':0,'pumper':0,'tanker':0,'hauler':0,'guard':0,'attacker':0,'totalCreeps':16};
        mem.template.creeptype.courier = [CARRY,MOVE];
        mem.template.creeptype.builder = [WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE];
        mem.template.creeptype.harvester = [WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE];
        mem.template.creeptype.fighter = [TOUGH,TOUGH,ATTACK,ATTACK,MOVE,MOVE,MOVE,MOVE];
        mem.template.creeptype.runner = [WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE];
        mem.template.creeptype.repairer = [WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE];
        mem.template.creeptype.farmer = [WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE];
        mem.template.creeptype.pumper = [WORK,WORK,WORK,WORK,CARRY,MOVE];
        mem.template.creeptype.hauler = [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE];
        mem.template.creeptype.tanker = [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE];
        mem.template.creeptype.guard = [TOUGH,TOUGH,ATTACK,ATTACK,MOVE,MOVE,MOVE,MOVE];
        mem.template.creeptype.ups = [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE];
        mem.template.creeptype.attacker = [TOUGH,TOUGH,ATTACK,ATTACK,MOVE,MOVE,MOVE,MOVE];
        mem.upgradestage = 0;
    }
    */
    
    else if(cLevel === 5){
        mem.roomStage = 6;
        console.log('Stage 5 Finished, Upgrading to 6');
        console.log(Memory.rooms.W1S4.roomStage + ' : ');
        mem.mode.building = {'builder':2,'harvester':0,'fighter':0,'runner':0,'repairer':2,'courier':1,'farmer':2,'pumper':1,'tanker':3,'hauler':4,'guard':1,'attacker':0,'totalCreeps':16};
        mem.mode.general = {'builder':0,'harvester':0,'fighter':0,'runner':0,'repairer':2,'courier':1,'farmer':2,'pumper':2,'tanker':5,'hauler':4,'guard':2,'attacker':0,'totalCreeps':18};
        mem.mode.idle = {'builder':0,'harvester':2,'fighter':0,'runner':0,'repairer':1,'courier':0,'farmer':0,'pumper':0,'tanker':0,'hauler':0,'guard':0,'attacker':0,'totalCreeps':3};
        mem.mode.shutdown = {'builder':0,'harvester':0,'fighter':0,'runner':0,'repairer':2,'courier':0,'farmer':2,'pumper':0,'tanker':4,'hauler':4,'guard':2,'attacker':8,'totalCreeps':15};
        mem.mode.buildonly = {'builder':4,'harvester':0,'fighter':0,'runner':0,'repairer':2,'courier':1,'farmer':2,'pumper':0,'tanker':0,'hauler':4,'guard':1,'attacker':0,'totalCreeps':14};
        console.log('Modes set to new values');
        mem.template.creeptype.courier = [CARRY,MOVE];
        mem.template.creeptype.builder = [WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE];
        mem.template.creeptype.harvester = [WORK,WORK,CARRY,CARRY,MOVE,MOVE];
        mem.template.creeptype.fighter = [TOUGH,TOUGH,ATTACK,ATTACK,MOVE,MOVE,MOVE,MOVE];
        mem.template.creeptype.runner = [WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE];
        mem.template.creeptype.repairer = [WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];
        mem.template.creeptype.farmer = [WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE];
        mem.template.creeptype.pumper = [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE];
        mem.template.creeptype.hauler = [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE];
        mem.template.creeptype.tanker = [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE];
        mem.template.creeptype.guard = [TOUGH,TOUGH,ATTACK,MOVE,ATTACK,MOVE,RANGED_ATTACK,MOVE,RANGED_ATTACK];
        mem.template.creeptype.ups = [CARRY,CARRY,CARRY,MOVE,MOVE,MOVE];
        mem.template.creeptype.attacker = [TOUGH,TOUGH,MOVE,MOVE,ATTACK,MOVE];
        console.log('Creep Templates Reconfigured');
        mem.upgradestage = 0;
        console.log('Bit reset to ' + mem.upgradestage);
        console.log('Reticulating Splines');
        console.log('Viola!');
        Game.notify('Upgraded to stage ' + mem.roomStage);
    }
    
    else if(cLevel === 6){
        mem.roomStage = 7;
        links = Memory.stage6w1s4.links;
        roads = Memory.stage6w1s4.roads;
        extensions = Memory.stage6w1s4.extensions;
        console.log('Stage 6 Finished, Upgrading to 7');
        console.log('Modes Unchanged');
        
        console.log('Attempting to place Sites .... ');
        for(var i in roads){
            croom.createConstructionSite(roads[i].x,roads[i].y,STRUCTURE_ROAD);
            console.log('Site created at ' + roads[i].x + ',' + roads[i].y + ' Road');
        }
        for(var i in links){
            croom.createConstructionSite(links[i].x,links[i].y,STRUCTURE_LINK);
            console.log('Site created at ' + links[i].x + ',' + links[i].y + ' Link');
        }
        for(var i in extensions){
            croom.createConstructionSite(extensions[i].x,extensions[i].y,STRUCTURE_EXTENSION);
            console.log('Site created at ' + extensions[i].x + ',' + extensions[i].y + ' Extension');
        }
        mem.currentmode = 'buildonly';
        console.log('Construction Placed, closing upgrader');
        console.log('Success!');
        console.log('No splines this time')
        console.log('Bit Reset');
        mem.upgradestage = 0;
        Game.notify('Upgraded to stage ' + mem.roomStage);
    }
    else if(cLevel === 7){
        mem.roomStage = 8;
        console.log('Stage 7 Finished, Upgrading to 8');
        mem.mode.building = {'builder':2,'harvester':0,'fighter':0,'runner':0,'repairer':2,'courier':1,'farmer':2,'pumper':1,'tanker':0,'hauler':4,'guard':2,'attacker':0,'totalCreeps':14};
        mem.mode.running = {'builder':0,'harvester':0,'fighter':0,'runner':0,'repairer':2,'courier':1,'farmer':2,'pumper':2,'tanker':0,'hauler':4,'guard':2,'attacker':0,'totalCreeps':13};
        mem.mode.idle = {'builder':0,'harvester':2,'fighter':0,'runner':0,'repairer':1,'courier':0,'farmer':0,'pumper':0,'tanker':0,'hauler':0,'guard':0,'attacker':0,'totalCreeps':3};
        mem.mode.shutdown = {'builder':0,'harvester':0,'fighter':0,'runner':0,'repairer':3,'courier':0,'farmer':2,'pumper':0,'tanker':0,'hauler':4,'guard':2,'attacker':11,'totalCreeps':15};
        mem.mode.buildonly = {'builder':4,'harvester':0,'fighter':0,'runner':0,'repairer':2,'courier':1,'farmer':2,'pumper':0,'tanker':0,'hauler':4,'guard':1,'attacker':0,'totalCreeps':14};
        console.log('Modes set to new values');
        mem.clink = croom.controller.pos.findInRange(FIND_MY_STRUCTURES,2, {filter: {structureType: STRUCTURE_LINK}})[0].id;
        mem.centerlink = Game.spawns.Home.pos.findInRange(FIND_MY_STRUCTURES,5, {filter: {structureType: STRUCTURE_LINK}})[0].id;
        mem.template.creeptype.courier = [CARRY,CARRY,MOVE];
        mem.template.creeptype.builder = [WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE];
        mem.template.creeptype.harvester = [WORK,WORK,CARRY,CARRY,MOVE,MOVE];
        mem.template.creeptype.fighter = [TOUGH,TOUGH,ATTACK,ATTACK,MOVE,MOVE,MOVE,MOVE];
        mem.template.creeptype.runner = [WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE];
        mem.template.creeptype.repairer = [WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];
        mem.template.creeptype.farmer = [WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE];
        mem.template.creeptype.pumper = [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE];
        mem.template.creeptype.hauler = [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE];
        mem.template.creeptype.tanker = [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE];
        mem.template.creeptype.guard = [TOUGH,TOUGH,ATTACK,ATTACK,RANGED_ATTACK,RANGED_ATTACK,MOVE,MOVE,MOVE];
        mem.template.creeptype.ups = [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE];
        mem.template.creeptype.attacker = [TOUGH,TOUGH,ATTACK,ATTACK,MOVE,MOVE,MOVE,MOVE];
        console.log('Creep Templates Reconfigured');
        mem.upgradestage = 0;
        console.log('Bit reset to ' + mem.upgradestage);
        console.log('Reticulating Splines');
        console.log('Viola!');
        Game.notify('Upgraded to stage ' + mem.roomStage);
    }
    
    else{
        console.log('failed upgrade');
    }
     
     
     
     
     
     
     
     
 }