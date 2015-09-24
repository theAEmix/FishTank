 module.exports = function() {
  var pathMemory = Memory.waypoints;
  var allFlags = Object.keys(Game.flags);

  //iterate for all present colors
  if (allFlags.length && allFlags.length !== Memory.flagCount) {
   for (var flagcolor in pathMemory) {
    var pathHue = pathMemory[flagcolor];
    //start with the cleanup script
    for (var i in pathHue) {
     if (!Game.getObjectById(pathHue[i].Id)) {
      console.log('Flag ' + i + ' removed');
      delete pathHue[i];
      var count = Memory.flagCount - 1;
      Memory.flagCount = count;
      var pathcount = 0;
      var previousflag;
      console.log('Recalculating Paths...');
      for (var i in pathHue) {
       pathcount++;
       delete pathHue[i].path;
       delete pathHue[i].destination;
       if (pathcount == 1) {
        pathHue[i].path = Game.flags[i].pos;
        console.log('Saving Start');
       }
       else {
        if (Game.flags[previousflag].room) {
         pathHue[previousflag].path = Game.flags[previousflag].pos.findPathTo(Game.flags[i].pos);
         console.log('Calculating Path from ' + previousflag + ' to ' + i);
        }
        pathHue[previousflag].destination = i;
        console.log('Destination is ' + i);
       }
       previousflag = i;
      }
     }
    }
   }
  }
  //any flags that don't exist should be removed now

  //next step, check for new flag
  //console.log('Does ' + allFlags.length + ' = ' + Memory.flagCount + '??');
  if (allFlags.length && allFlags.length !== Memory.flagCount) {
   console.log('New Flag!');
   var length = allFlags.length;
   var newFlagName = allFlags[length - 1];
   console.log('newFlag Variable = ' + newFlagName);
   //Memory.test = newFlagName;
   var newFlag = Game.flags[newFlagName];
   var flagColor = newFlag.color;
   //Memory.test2 = flagColor;
   console.log('flagColor variable = ' + flagColor);
   pathMemory[flagColor][newFlagName] = {
    'Id': newFlag.id
   };
   //correcting count
   var count = Memory.flagCount + 1;
   Memory.flagCount = count;

   //now to add the pathing for it.....
   var pathcount = 0;
   var previousflag;
   console.log('New Flag Pathing...');
   for (var i in pathMemory[flagColor]) {
    pathcount++;

    if (pathcount == 1) {
     pathMemory[flagColor][i].path = Game.flags[i].pos;
     console.log('Saving Start');
    }
    else {
     if (Game.flags[previousflag].room) {
      pathMemory[flagColor][previousflag].path = Game.flags[previousflag].pos.findPathTo(Game.flags[i].pos);
      console.log('Calculating Path from ' + previousflag + ' to ' + i)
     }
     pathMemory[flagColor][previousflag].destination = i;
     console.log('Destination is ' + i);

    }

    previousflag = i;
   }

  }










 }