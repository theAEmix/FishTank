module.exports = {
  spawnSay: spawnSay,
  getTarget: getTarget,
  repairTarget: repairTarget,
  buildTarget: buildTarget,
  deliverExt: deliverExt,
  deliverSpawn: deliverSpawn,
  deliverStorage: deliverStorage,
  moveToward: moveToward
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