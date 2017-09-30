(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.ticker = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}]},{},[1])(1)
});