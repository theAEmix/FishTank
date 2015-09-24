module.exports = {
    spawnSay:spawnSay,
    getTarget : getTarget,
    repairTarget : repairTarget,
    buildTarget : buildTarget
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
    intents[this.id].say = {message: "" + message};
    return C.OK;
  }
  
  function getTarget (tArray,aCreep,assignLimit){
      if(!assignLimit) assignLimit = 1;
      for(var i in tArray){
          if(!tArray[i].creeps)tArray[i].creeps = [];
          var k = 0;
          while(tArray[i].creeps[k] !== undefined){
              var j = Game.getObjectById(tArray[i].creeps[k]);
              if(j === undefined || j === null){
                  //console.log(tArray[i].creeps[k] + ' deleted');
                  _.pull(tArray[i].creeps,tArray[i].creeps[k]);
              }
              else{
                  k = k+1;
              }
          }
          var currentNum = _.filter(tArray[i].creeps,function(o){ 
              var creep = Game.getObjectById(o);
              return (creep.memory.job === aCreep.memory.job && o !== aCreep.id);
          })
          //console.log(currentNum);
          //console.log(currentNum.length);
          //console.log(aCreep.memory.target);
          if(currentNum.length < assignLimit){
              tArray[i].creeps.push(aCreep.id);
              aCreep.memory.target = tArray[i].Id;
              break;
          }
      }
  }
  function repairTarget(creep){
      var ctarget = Game.getObjectById(creep.memory.target);
      if(!ctarget){
          //creep.say('No target');
          return false;
      }
      else{
          if(creep.repair(ctarget) === ERR_NOT_IN_RANGE){
              creep.moveTo(ctarget, {reusePath: 15});
          }
          if (ctarget.hits / ctarget.hitsMax >= 1) {
                delete creep.memory.target;
            }
          //creep.say('Busy');
          return true;
      }
  }
  function buildTarget(creep){
      
      
  }
  

  
  
  