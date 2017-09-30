var R = (function(){

  var DOMRenderer = function(view, options){
    options = options || {};
    this.view = view || document.createElement('div');

    this.interactives = [];
    var that = this;
    var events = ['mousedown', 'click', 'touchstart'];
    var addHandler = function(evName){
      that.view.addEventListener(evName, function(ev){
        that.interactives.forEach(function(obj){
          if(obj.withinRect(ev.offsetX, ev.offsetY) && obj.handlers[evName]){
            obj.handlers[evName].forEach(function(fn){fn(ev);});
          }
        });
      });
    };
    events.forEach(addHandler);

    this.dirty = true;

    this.view.width = options.width || 400;
    this.view.height = options.height || 400;
  };
  DOMRenderer.prototype = {
    //TODO: try reducing redraws by using dirtycheck & better css batching(how abotu global style element with dynamic selectors)
    render: function(stage){
      if(!this.view.getAttribute('style')){
        this.view.setAttribute('style', 'position: relative; overflow: hidden; width:' +
          this.view.width +'px;height:' + this.view.height+'px');
      }
      if(!this.dirty)
        return;
      this.dirty = false;

      stage.renderDOM(this.view, this);
    }
  };

  var canvasRenderer = function(view, options){
    options = options || {};
    this.view = view || document.createElement('canvas');
    this.context = this.view.getContext("2d");

    //HACK: to alow children inheritign parent transform, we should somehow have it stored so they can midofy it
    //for now i monkeypath the transformation methods to save their state
    //more elegant idea would be saving context state on renderer itself and have renderer bound transformation method
    var ctx = this.context;
    ctx.currentRotate = 0;
    ctx.currentTransform = [1,0,0,1,0,0];

    var save = ctx.save;
    ctx.savedTransforms = [];
    ctx.savedRotates = [];
    ctx.save = function(){
      ctx.savedTransforms.push(ctx.currentTransform);
      ctx.savedRotates.push(ctx.currentRotate);
      save.call(ctx);
    };
    var restore = ctx.restore;
    ctx.restore = function(){
      restore.call(ctx);
      ctx.currentTransform = ctx.savedTransforms.pop();
      ctx.currentRotate = ctx.savedRotates.pop();
    };

    this.interactives = [];
    var that = this;
    var events = ['mousedown', 'click', 'touchstart'];
    var addHandler = function(evName){
      that.view.addEventListener(evName, function(ev){
        that.interactives.forEach(function(obj){
          if(obj.withinRect(ev.offsetX, ev.offsetY) && obj.handlers[evName]){
            obj.handlers[evName].forEach(function(fn){fn(ev);});
          }
        });
      });
    };
    events.forEach(addHandler);

    this.dirty = true;

    this.view.width = options.width || 400;
    this.view.height = options.height || 400;
  };
  canvasRenderer.prototype = {
    render: function(stage){
      if(!this.dirty)
        return;
      this.dirty = false;
      this.context.clearRect(0, 0, this.view.width, this.view.height);
      this.context.save();
      stage.renderCanvas(this.context, this);
      this.context.restore();
    },
    prepareContext: function(state){
      var ctx = this.context;
      ctx.currentTransform = [ctx.currentTransform[0] * state.scaleX, 0, 0,
        ctx.currentTransform[3] * state.scaleY,
        ctx.currentTransform[4] + state.x, ctx.currentTransform[5] + state.y];

      ctx.setTransform.apply(ctx, ctx.currentTransform);

      ctx.currentRotate = ctx.currentRotate + state.rotate * Math.PI / 180;
      ctx.rotate(ctx.currentRotate);

      ctx.globalAlpha = ctx.globalAlpha * state.alpha;
      ctx.shadowColor = "black";
      ctx.shadowBlur = state.shadow;
    }
  };

  return {
    canvasRenderer: canvasRenderer,
    DOMRenderer: DOMRenderer
  };
})();
