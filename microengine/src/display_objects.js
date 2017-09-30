var D = (function(loader){
  // var className = Math.random().toString(36).slice(2, 10) + '_';
  var _id = 0;
  var DisplayObject = function(){
    this._id = _id++;
    this.dirty = true;//should be rerendered ?
    this.parent = null;
    this.renderer = null;//for performance, set renderer to dirty to trigger rerender
    //transforming
    this.x = 0;
    this.y = 0;
    this.visible = true;
    this.alpha = 1;
    this.scaleX = 1;
    this.scaleY = 1;
    this.rotate = 0;
    this.shadow = 0;
    //non-transforming(for interactivity and collision)
    this.width = 1;
    this.height = 0;
    this.rect = [this.x, this.y, this.width, this.height];
    this.interactive = false;
    this.handlers = {};
  };
  DisplayObject.prototype = {
    _renderCanvas: function(ctx, renderer){
      if(!this.renderer)
        this.renderer = renderer;
      this.dirty = false;
      if(!this.visible)
        return true;//stop render

      var interactivesIndex =  renderer.interactives.indexOf(this);
      if(this.interactive && interactivesIndex < 0)
        renderer.interactives.push(this);

      if(!this.interactive && interactivesIndex >= 0)
        renderer.interactives.splice(interactivesIndex, 1);

      ctx.save();
      renderer.prepareContext(this);
      this.rect = [ctx.currentTransform[4], ctx.currentTransform[5],
       this.width , this.height ];
    },
    withinRect: function(x,y){
      var rect = this.rect;
      return (x > rect[0] && x < rect[0] + rect[2] &&
        y > rect[1] && y < rect[1] + rect[3]);
    },
    collidesWith: function(o){
      var that = this;
      //checks corners, if any is within other rect, it means collision
      return this.getCorners().some(function(corner){
        return o.withinRect(corner[0], corner[1]);
      }) || o.getCorners().some(function(corner){
        return that.withinRect(corner[0], corner[1]);
      });
    },
    getCorners: function(){
      var r = this.rect;
      return [[r[0], r[1]], [r[0]+r[2], r[1]], [r[0]+r[2], r[1]+r[3]], [r[0], r[1]+r[3]]];
    },
    _renderDOM: function(node, renderer){
      if(!this.renderer)
        this.renderer = renderer;
      if(this.dirty)
        this.$el.setAttribute('style', getCssText(this));
      if(this.$el.parentNode !== node)
        node.appendChild(this.$el);
      this.dirty = false;
    },
    on: function(evName, fn){
      if(!this.handlers[evName])
        this.handlers[evName] = [fn];
      else
        this.handlers[evName].push(fn);
    },
    off: function(evName, fn){
      if(!this.handlers[evName])
        return;
      this.handlers[evName].splice(this.handlers[evName].indexOf(fn), 1);
    },
    set: function(key, value){
      this.onset && this.onset(key, value);
      if(typeof key === 'object'){
        var that = this;
        Object.keys(key).forEach(function(prop){
          if(that[key] !== key[prop]){
            that[prop] = key[prop];
            that.dirty = true;
          }
        });
        if(!that.dirty)
          return;
      }else{
        if(this[key] === value)
        return;
        this[key] = value;
        this.dirty = true;
      }
      if(this.renderer)
        this.renderer.dirty = true;
    }
  };


  var Container = function(config){
    DisplayObject.call(this);
    this.children = [];
    config && this.set(config);
  };
  Container.prototype = extend(Object.create(DisplayObject.prototype), {
    renderCanvas: function(ctx, renderer){
      if(this._renderCanvas(ctx, renderer))
        return;
      this.children.forEach(function(child){
        child.renderCanvas(ctx, renderer);
      });
      ctx.restore();
    },
    renderDOM: function(node, renderer){
      if(!this.$el){
        this.$el = document.createElement('div');
      }
      var $el = this.$el;
      this.children.forEach(function(child){
        child.renderDOM($el, renderer);
      });
      this._renderDOM(node, renderer);
    },
    addChild: function(el){
      this.dirty = true;
      el.dirty = true;
      el.parent = this;
      this.children.push(el);
      if(this.renderer)
        this.renderer.dirty = true;
    },
    removeChild: function(el){
      el.parent = null;
      this.children.splice(this.children.indexOf(el), 1);
      if(this.$el)
        this.$el.removeChild(el.$el);
      if(this.renderer){
        this.renderer.dirty = true;
        this.renderer.interactives.splice(this.renderer.interactives.indexOf(this), 1);
      }
    },
    removeChildren: function(){
      this.children.forEach(this.removeChild, this);
    }
  });


  var Sprite = function(url, config){
    DisplayObject.call(this);
    this.img = loader.get(url).img;
    this.width = this.img.width;
    this.height = this.img.height;
    this.centered = false;
    config && this.set(config);
  };
  Sprite.prototype = extend(Object.create(DisplayObject.prototype), {
    renderCanvas: function(ctx, renderer){
      if(this._renderCanvas(ctx, renderer))
        return;
      var x = this.centered ? -this.img.width/2 : 0;
      var y = this.centered ? -this.img.height/2 : 0;
      ctx.drawImage(this.img, x, y);
      this.rect[0] += x;
      this.rect[1] += y;
      ctx.restore();
    },
    renderDOM: function(node, renderer){
      if(!this.dirty)
        return;
      this.$el = this.img;

      this._renderDOM(node, renderer);
    },
    onset: function(key, value){
      var img;
      if(typeof key === 'object')
        img = key[img];
      else if(key === 'img')
        img = value;

      if(img){
        this.width = img.width;
        this.height = img.height;
      }
    }
  });


  var Text = function(config){
    DisplayObject.call(this);
    this.font = '24px sans';
    this.text = '';
    this.color = 'black';
    this.centered = true;
    config && this.set(config);
  };
  Text.prototype = extend(Object.create(DisplayObject.prototype), {
    renderCanvas: function(ctx, renderer){
      if(this._renderCanvas(ctx, renderer))
        return;
      ctx.font = this.font;
      ctx.fillStyle = this.color;
      //HACK: M width should be more or less height of the font
      var em = ctx.measureText('M').width;
      var x = this.centered ? -ctx.measureText(this.text).width/2 : 0;
      var y = this.centered ? em/2 : em;
      ctx.fillText(this.text, x,y);
      this.rect[0]-=x;
      this.rect[1]-=y;
      ctx.restore();
    },
    renderDOM: function(node, renderer){
      if(!this.dirty)
        return;
      if(!this.$el)
        this.$el = document.createElement('span');

      this.$el.innerHTML = this.text;
      this._renderDOM(node, renderer);
    }
  });

  //for batching redraws we just set css as style string, instead of attributes one by one
  function getCssText(obj){
    var props = {
      position: 'absolute',
      left: obj.x && obj.x + 'px',
      top: obj.y && obj.y + 'px',
      opacity: obj.alpha === 1 ? null : obj.alpha,
      display: !obj.visible && 'none',
      font: obj.font,
      color: obj.color
    };
    return Object.keys(props).filter(function(x){
      return props[x];
    }).reduce(function(css, name){
      return css + name +':' + props[name] + ';';
    }, '');
  }

  //TODO: move this to separate utils object
  function extend(target, source){
    Object.keys(source).forEach(function(key){
      target[key] = source[key];
    });
    return target;
  }

  return {
    Container: Container,
    Sprite: Sprite,
    Text: Text
  };
})(loader);
