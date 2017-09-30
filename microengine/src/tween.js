//depends on ticker
var tween = (function(ticker){

  tweenObjs = [];

  var Tween = function(target, setter){
    this.target = target;
    this.setter = setter;
    this._callbacks = [];
    this.running = false;
  };
  Tween.prototype = {
    //works only on numbers
    to: function(finalState, time, easing){
      if(!this.running){
        this.running = true;
        animate(this, this.target, finalState, time, easing);
      } else{
        this._callbacks.push(animate.bind(null, this, this.target, finalState, time, easing));
      }
      return this;
    },
    call: function(fn){
      if(!this.running){
        this.running = true;
        fn();
        nextCb(this);
      } else {
        var that = this;
        this._callbacks.push(function(){
          fn();
          nextCb(that);
        });
      }
      return this;
    },
    stop: function(){
      ticker.remove(this.stepFn);
    }
  };

  var tween = {
    get: function(obj, setter){
      var tween = new Tween(obj, setter);
      tweenObjs.push(tween);
      return tween;
    },
    easing: {
      LINEAR: function(x){
        return x;
      }
    },
    removeAllTweens: function(obj){
      tweenObjs = tweenObjs.filter(function(tween){
        if(tween.target === obj)
          tween.stop();
        else
          return tween;
      });
    }
  };

  function animate(obj, state, finalState, time, easing){
    easing = easing || tween.easing.LINEAR;
    var props = Object.keys(finalState);
    var elapsed = 0;
    var diff = {};
    var startState = {};
    props.forEach(function(key){
      startState[key] = state[key];
      diff[key] = (typeof finalState[key] === 'number') ? finalState[key] - startState[key] : 0;
    });
    var step = function(delta){
      elapsed += ticker.elapsedMS;
      // var nextState = {};
      if(elapsed < time){
        var value = easing(elapsed/time);
        props.forEach(function(key){
          if(!diff[key])
            return;
          if(!obj.setter)
            state[key] = startState[key] + diff[key] * value;
          else
            obj.setter.call(state, key, startState[key] + diff[key] * value);
          //   nextState[key] = startState[key] + diff[key] * value;
        });
        // if(obj.setter)
        //   obj.setter.call(state, nextState);
      }else{
        ticker.remove(step);
        props.forEach(function(key){
          if(!obj.setter)
            state[key] = finalState[key];
          else
            obj.setter.call(state, key, finalState[key]);
          //   nextState[key] = finalState[key];
        });
        // if(obj.setter)
        //   obj.setter.call(state, nextState);
        nextCb(obj);
      }
    };
    obj.stepFn = step;
    ticker.add(step);
  }

  function nextCb(obj){
    if(!obj._callbacks.length)
      obj.running = false;
    else
      obj._callbacks.shift()();
  }

  return tween;
})(ticker);
