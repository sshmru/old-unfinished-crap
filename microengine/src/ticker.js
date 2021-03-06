var ticker = (function(){
  //RequestAnimationFrame and performance might not be supported
  var dateFn = (performance && performance.now) ? performance.now.bind(performance) : Date.now.bind(Date);
  var RAF = requestAnimationFrame || function(fn){
    setTimeout(fn, 1000/(ticker.targetFPS)-ticker.elapsedMS);
  };
  var lastDate = dateFn();
  var ticker = {
    callbacks: [],
    add: function(fn, ctx){
      ticker.callbacks.push({
        fn: fn,
        ctx: ctx
      });
      ticker.tryStart();
      return ticker;
    },
    remove: function(fn, ctx){
      ticker.callbacks = ticker.callbacks.filter(function(cb){
        //remove if both equal
        return cb.fn !== fn || cb.ctx !== ctx;
      });
      ticker.tryStop();
      return ticker;
    },
    tryStart: function(){
      if(ticker.running || !ticker.callbacks.length)
        return;
      ticker.running = true;
      lastDate = dateFn();
      tick();
    },
    tryStop: function(){
      if(!ticker.callbacks.length)
        ticker.running = false;
    },
    running: false,
    targetFPS: 60,
    FPS: 60,
    elapsedMS: 0
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
    //TODO: ensure first tick elapsedMS etc are ok
    var currDate = dateFn();
    var elapsedMS = ticker.elapsedMS = currDate - lastDate;
    ticker.FPS = 1000/elapsedMS;
    var delta = elapsedMS / (1000/ticker.targetFPS);
    //console.log(delta, elapsedMS, ticker.FPS)
    runCallbacks(delta);
    lastDate = currDate;
    RAF(tick);
  }

  return ticker;
})();
