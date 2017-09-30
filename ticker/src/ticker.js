module.exports = (function(){
  //RequestAnimationFrame and performance might not be supported
  var dateFn = (performance && performance.now) ? performance.now.bind(performance) : Date.now.bind(Date);
  var RAF = requestAnimationFrame || function(fn){
    setTimeout(fn, 1000/(ticker.targetFPS)-ticker.elapsedMS);
  };
  var ticker = {
    callbacks: [],
    add: function(fn, ctx){
      ticker.callbacks.push({
        fn: fn,
        ctx: ctx
      });
      ticker.start();
      return ticker;
    },
    remove: function(fn, ctx){
      ticker.callbacks = ticker.callbacks.filter(function(cb){
        //remove if both equal
        return cb.fn !== fn || cb.ctx !== ctx;
      });
      if(!ticker.callbacks.length)
	      ticker.stop();
      return ticker;
    },
    start: function(){
      if(ticker.running || !ticker.callbacks.length)
        return;
      ticker.running = true;
			ticker.elapsedMS = 1000/ticker.targetFPS;
      ticker.lastDate = dateFn()- ticker.elapsedMS;
      tick();
    },
    stop: function(){
      ticker.running = false;
    },
    running: false,
    targetFPS: 60,
    FPS: 60,
    elapsedMS: 0,
    lastDate: 0
  };

  function runCallbacks(delta){
    ticker.callbacks.forEach(function(cb){
      cb.fn.call(cb.ctx, delta);
    });
  }

  function tick(){
    //loop if running and has callbacks
    if(!ticker.callbacks.length || !ticker.running)
      return;
    var currDate = dateFn();
    var elapsedMS = ticker.elapsedMS = currDate - ticker.lastDate;
    ticker.FPS = 1000/elapsedMS;
    runCallbacks(elapsedMS / (1000/ticker.targetFPS));
    ticker.lastDate = currDate;
    RAF(tick);
  }

  return ticker;
})();
