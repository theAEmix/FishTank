/* 
global Game, Memory, FIND_MY_CREEPS, FIND_STRUCTURES, STRUCTURE_ROAD, STRUCTURE_WALL, STRUCTURE_RAMPART, _, WORK,
FIND_HOSTILE_CREEPS,FIND_CONSTRUCTION_SITES,CARRY,MOVE,AE,ERR_NOT_OWNER,ERR_BUSY, ERR_NOT_IN_RANGE,C,FIND_MY_STRUCTURES,STRUCTURE_EXTENSION,
FIND_MY_SPAWNS
*/

module.exports = {
  spawnSay: spawnSay,
  getTarget: getTarget,
  repairTarget: repairTarget,
  buildTarget: buildTarget,
  deliverExt: deliverExt,
  deliverSpawn: deliverSpawn,
  deliverStorage: deliverStorage,
  findEnergy: findEnergy,
  moveToward: moveToward,
  spawnCreep: spawnCreep,
  makeQueue: makeQueue,
  getName: getName,
  getColor: getColor
}

function spawnSay(spawn) {
  if (!Game.spawns[spawn].my) {
    return ERR_NOT_OWNER;
  }
  if (!Game.spawns[spawn].spawning) {
    return ERR_BUSY;
  }

  message = Game.spawns[spawn].spawning;
  intents[this.id] = intents[this.id] || {};
  intents[this.id].say = {
    message: "" + message
  };
  return C.OK;
}

function getTarget(tArray, aCreep, assignLimit) {
  if (!assignLimit) assignLimit = 1;
  for (var i in tArray) {
    if (!tArray[i].creeps) tArray[i].creeps = [];
    var k = 0;
    while (tArray[i].creeps[k] !== undefined) {
      var j = Game.getObjectById(tArray[i].creeps[k]);
      if (j === undefined || j === null) {
        //console.log(tArray[i].creeps[k] + ' deleted');
        _.pull(tArray[i].creeps, tArray[i].creeps[k]);
      }
      else {
        k = k + 1;
      }
    }
    var currentNum = _.filter(tArray[i].creeps, function(o) {
        var creep = Game.getObjectById(o);
        return (creep.memory.job === aCreep.memory.job && o !== aCreep.id);
      })
      //console.log(currentNum);
      //console.log(currentNum.length);
      //console.log(aCreep.memory.target);
    if (currentNum.length < assignLimit) {
      tArray[i].creeps.push(aCreep.id);
      aCreep.memory.target = tArray[i].Id;
      break;
    }
  }
}

function repairTarget(creep) {
  var ctarget = Game.getObjectById(creep.memory.target);
  if (!ctarget) {
    //creep.say('No target');
    return false;
  }
  else {
    if (creep.repair(ctarget) === ERR_NOT_IN_RANGE) {
      creep.moveTo(ctarget, {
        reusePath: 15
      });
    }
    if (ctarget.hits / ctarget.hitsMax >= 1) {
      delete creep.memory.target;
    }
    //creep.say('Busy');
    return true;
  }
}

function buildTarget(creep) {


}

function deliverExt(creep) {
  if (creep.room.energyAvailable < creep.room.energyCapacityAvailable) {
    var cExt = creep.room.findClosestByRange(FIND_MY_STRUCTURES, {
      filter: function(object) {
        if (object.structureType == STRUCTURE_EXTENSION) return object.energy < object.energyCapacity;
      }
    });
    if (cExt) {
      if (creep.transferEnergy(cExt) === ERR_NOT_IN_RANGE) {
        creep.moveTo(cExt, {
          reusePath: 25
        });
      }
      return true;
    }
    else {
      return false;
    }

  }
  else {
    return false;
  }
}

function moveToward(creep, dest) {
  creep.moveTo(dest, {
    reusePath: 35
  })
}

function deliverSpawn(creep) {
  if (creep.room.energyAvailable < creep.room.energyCapacityAvailable) {
    var cSpawn = creep.room.findClosestByRange(FIND_MY_SPAWNS, {
      filter: function(object) {
        return object.energy < object.energyCapacity;
      }
    });
    if (cSpawn) {
      if (creep.transferEnergy(cSpawn) === ERR_NOT_IN_RANGE) {
        creep.moveTo(cSpawn, {
          reusePath: 25
        });
      }
      return true;
    }
    else {
      return false;
    }
  }
  else {
    return false;
  }
}

function deliverCenterlink(creep) {
  if (creep.room.memory.links.centerlink !== undefined || creep.room.memory.links.centerlink !== null) {
    var centerlink = Game.getObjectById(creep.room.memory.links.centerlink);
    if (centerlink.energy < centerlink.energyCapacity) {
      if (creep.transferEnergy(centerlink) === ERR_NOT_IN_RANGE) {
        creep.moveToward(creep, centerlink);
      }
      return true;
    }
    else {
      return false;
    }
  }

  else {
    return false;
  }
}

function deliverStorage(creep) {
  if (creep.room.storage) {
    if (creep.transferEnergy(creep.room.storage) === ERR_NOT_IN_RANGE) {
      creep.moveToward(creep, creep.room.storage);
    }
    return true;
  }
  else {
    return false;
  }
}

function findEnergy(creep, target) {
  //for use when looking for any energy

}

function spawnCreep(creeptype, spawnObj) {
  var temp = spawnObj.room.memory.template.creeptype[creeptype];
  var tempRole;
  if (creeptype === 'bruiser' || creeptype === 'ups' || creeptype === 'buildroam' || creeptype === 'gather') {
    tempRole = 'claimer';
  }
  else {
    tempRole = creeptype;
  }

  spawnObj.createCreep(temp, AE.getName(creeptype, spawnObj.name), {
    'job': creeptype,
    'spawnroom': spawnObj.room.name,
    'homebase': spawnObj.name,
    'role': tempRole
  })
}

function makeQueue(croom) {
  var roleCount = croom.memory.mode.count;
  var roleTotal = croom.memory.mode[croom.memory.currentmode];
  croom.memory.spawnQueue = [];
  for (var i in roleCount) {
    if (roleCount[i] < roleTotal[i]) {
      croom.memory.spawnQueue.push(i);
    }
  }
}

function getColor(creep) {
  if (creep.memory.job === 'gather') {
    var creepcolor = 'white';
    var greylimit = 2;
    var purplelimit = 1;
    var greenlimit = 1;
    var yellowlimit = 2;
    var orangelimit = 1;
    if (creep.room.name === 'W1S4') {
      creepcolor = 'grey';
      if (_.filter(Memory.creeps, {
          'job': 'gather',
          'color': 'grey'
        }).length >= greylimit) {
        creepcolor = 'red';
      }
    }
    if (creep.room.name === 'E5N2') {
      creepcolor = 'red';
    }
    if (creep.room.name === 'W13N2') {
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
    if (creep.room.name === 'E6N13') {
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
  }
  else if (creep.memory.job === 'ups') {
    var whitegoal = 3;
    var purplegoal = 1;
    var bluegoal = 3;
    var cyangoal = 3;
    var greygoal = 5;
    var greengoal = 2;
    var yellowgoal = 4;
    var orangegoal = 2;
    var creepcolor = 'white';
    if (creep.room.name === 'W1S4') {
      creepcolor = 'grey';
      if (_.filter(Memory.creeps, {
          'job': 'ups',
          'color': 'grey'
        }).length >= greygoal) {
        creepcolor = 'red';
      }
    }
    if (creep.room.name === 'E5N2') creepcolor = 'red';
    if (creep.room.name === 'W13N2') {
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
    if (creep.room.name === 'E6N13') {
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
  }
  else if (creep.memory.job === 'buildroam') {
    var creepcolor = 'orange';
  }
  else if (creep.memory.job === 'bruiser') {
    var creepcolor = 'purple';
  }
  return creepcolor;
}

function getName(creeptype, spawn) {
  var base = creeptype;
  var suffixn = 1;
  var title = base.concat(suffixn.toString());
  while (Game.spawns[spawn].canCreateCreep([WORK], title) == -3) {
    suffixn = suffixn + 1;
    title = base.concat(suffixn.toString());
  }
  return title;
}
