/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('Testing'); // -> 'a thing'
 */

"use strict";
module.exports = function(creep) {
	let store = Game.getObjectById(creep.memory.store);
	let spawn = Game.spawns.Spawn1;
	let miner = creep.memory.miner;
	console.log(creep.name + ' : ' + Memory.transporters + ' : ' + miner);


	if (miner == undefined) {
	console.log('RESET : ' + creep.name);
		if (!Memory.transporters || Memory.transporters >= Memory.bots.miner.length){
			Memory.transporters = 0;
			console.log('Memory.transporters was reset : ' + creep.name);
		}
		let modulo = Memory.transporters;
		miner = Memory.bots.miner[modulo];
		creep.memory.miner = miner;
		miner = Game.creeps[miner];
		console.log(creep.name + ' : Before : ' + Memory.transporters);
		Memory.transporters++;
		console.log(creep.name + ' : After : ' + Memory.transporters);
		console.log('Creep Assigned : ' + creep.memory.miner);
	}
}

Spawn.prototype.say = function(msg) {
  if (!this.my) {
    return ERR_NOT_OWNER;
  }
  if (!this.spawning) {
    return ERR_BUSY;
  }
  if(!msg){
  	msg = this.spawning;
  }

  message = msg;
  intents[this.id] = intents[this.id] || {};
  intents[this.id].say = {
    message: "" + message
  };
  return C.OK;
}