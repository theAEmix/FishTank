module.exports = function(croom, idlex, idley) {
    var mem = Memory.rooms[croom.name];
    mem.setpoints = {
        'wallhealth': 500,
        'ramparthealth': 5000,
        'maxhealth': 0
    };
    var modetemp = {
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
        'builder': 0,
        'repairer': 0,
        'pumper': 0,
        'emt': 0,
        'attacker': 0,
        'guard': 0,
        'spawnguard': 0,
        'ranger': 0,
        'bruiser': 0,
        'cleric': 0,
        'claimer': 0,
        'buildroam': 0,
        'totalCreeps': 0
    };
    mem.mode = {
        'general': modetemp,
        'building': modetemp,
        'collecting': modetemp,
        'defense': modetemp,
        'rampart': modetemp,
        'squad': modetemp,
        'upgrading': modetemp,
        'buildonly': modetemp,
        'idle': modetemp,
        'shutdown': modetemp,
        'scriptohio': modetemp,
        'rebuilding': modetemp
    }
    mem.template = {
        'creeptype': {
            'harvester': [WORK, CARRY, MOVE, MOVE],
            'farmer': [WORK, CARRY, MOVE, MOVE],
            'gather': [WORK, CARRY, MOVE, MOVE],
            'courier': [CARRY, MOVE],
            'hauler': [CARRY, CARRY, MOVE, MOVE],
            'tanker': [CARRY, CARRY, MOVE, MOVE],
            'helper': [CARRY, CARRY, MOVE, MOVE],
            'ups': [CARRY, CARRY, MOVE, MOVE],
            'banker': [CARRY, CARRY, MOVE, MOVE],
            'runner': [WORK, CARRY, MOVE, MOVE],
            'builder': [WORK, CARRY, MOVE, MOVE],
            'repairer': [WORK, CARRY, MOVE, MOVE],
            'pumper': [WORK, CARRY, MOVE, MOVE],
            'emt': [WORK, CARRY, MOVE, MOVE],
            'attacker': [TOUGH, ATTACK, MOVE, MOVE],
            'guard': [TOUGH, ATTACK, MOVE, MOVE],
            'spawnguard': [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, RANGED_ATTACK],
            'ranger': [RANGED_ATTACK, MOVE],
            'bruiser': [TOUGH, TOUGH, ATTACK, MOVE, MOVE, MOVE],
            'cleric': [MOVE],
            'claimer': [MOVE],
            'buildroam': [WORK, CARRY, MOVE, MOVE]
        }
    }
    mem.idlespot = {
        'creeptype': {
            'harvester': {},
            'farmer': {},
            'gather': {},
            'courier': {},
            'hauler': {},
            'tanker': {},
            'helper': {},
            'ups': {},
            'banker': {},
            'runner': {},
            'builder': {},
            'repairer': {},
            'pumper': {},
            'emt': {},
            'attacker': {},
            'guard': {},
            'spawnguard': {},
            'ranger': {},
            'bruiser': {},
            'cleric': {},
            'claimer': {},
            'buildroam': {}
        }
    }
    for (var i in mem.idlespot.creeptype) {
        mem.idlespot.creeptype[i].x = idlex;
        mem.idlespot.creeptype[i].y = idley;
        mem.idlespot.creeptype[i].roomName = croom.name;
    }
    mem.spawnname = {
        'name1': croom.find(FIND_MY_SPAWNS)[0].name
    };
    var roomsources = croom.find(FIND_SOURCES);
    mem.sources = {
        'psource': {
            'Id': roomsources[0].id,
            'linkId': ''
        }
    }
    if (roomsources[1]) {
        mem.sources.ssource = {
            'Id': roomsources[1].id,
            'linkId': ''
        }
    }
    else {
        mem.sources.ssource = {
            'Id': roomsources[0].id,
            'linkId': ''
        }
    }
    mem.update = 1;
    mem.currentmode = 'general';
    mem.rLevel = 1;
    mem.updateStructures = 45;
    mem.updateCreeps = 1;
    mem.updateRepair = 1;
    mem.roomStage = 1;
    mem.upgradestage = 0;
    mem.guardposts = [];
    mem.spawnBit = 0;
    mem.links = {
        'clink': '',
        'centerlink': '',
        'hlink': '',
        'blink': '',
        'plink': '',
        'slink': ''
    }
    mem.mSites = [];

    mem.mode.general = {
        'harvester': 6,
        'farmer': 0,
        'gather': 0,
        'courier': 0,
        'hauler': 0,
        'tanker': 0,
        'helper': 0,
        'ups': 0,
        'banker': 0,
        'runner': 3,
        'builder': 1,
        'repairer': 0,
        'pumper': 0,
        'emt': 0,
        'attacker': 0,
        'guard': 0,
        'spawnguard': 0,
        'ranger': 0,
        'bruiser': 0,
        'cleric': 0,
        'claimer': 0,
        'buildroam': 0,
        'totalCreeps': 10
    }
    mem.mode.building = {
        'harvester': 6,
        'farmer': 0,
        'gather': 0,
        'courier': 0,
        'hauler': 0,
        'tanker': 0,
        'helper': 0,
        'ups': 0,
        'banker': 0,
        'runner': 2,
        'builder': 3,
        'repairer': 0,
        'pumper': 0,
        'emt': 0,
        'attacker': 0,
        'guard': 0,
        'spawnguard': 0,
        'ranger': 0,
        'bruiser': 0,
        'cleric': 0,
        'claimer': 0,
        'buildroam': 0,
        'totalCreeps': 11
    }
    console.log('A new room has been initialized and spawn is built : ' + croom.name);

}