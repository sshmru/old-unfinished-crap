//for now handles only images
module.exports = (function(){
  var queueLength = 0;
  var resources = {};
  var callbacks = [];
  var loader = {
    add: function(url, cb){
      if(resources[url])
        return loader;
      loader.loaded = false;
      queueLength += 1;
      resources[url] = {
        loaded: false,
        url: url,
        cb: cb
      };
      if(/\.json$/.test(url))
        loadJSON(resources[url], url);
      else
        loadImage(resources[url], url);

      return loader;
    },
    call: function(fn){
      callbacks.push(fn);
      return loader;
    },
    get: function(url){
      if(!resources.url)
        loader.add(url);
      return resources[url];
    },
    loaded: true,
		//gets spritesheet.json and spritesheet.image and adds each frame to resouces[framename]
		unpackSprites: (function(){
			var cnv = document.createElement('canvas');
			var ctx = cnv.getContext('2d');
			return function (json, img){
				Object.keys(json.frames).forEach(function(imgName){
					var frame = json.frames[imgName];
					cnv.width = frame.sourceSize.w;
					cnv.height = frame.sourceSize.h;
					ctx.clearRect(0,0, cnv.width, cnv.height);
					ctx.drawImage(img, -frame.frame.x, -frame.frame.y);
					resources[imgName] = {
						img: new Image()
					};
					img.setAttribute('crossOrigin', 'anonymous');
					resources[imgName].img.src = cnv.toDataURL();
				});
				return loader;
			};
		})(),
		resources: resources
  };

  function loadImage(res, url){
    res.img = new Image();
    res._onLoaded = function(){
      res.img.removeEventListener('load', res._onLoaded);
      onLoaded(res);
    };
    res.img.src = url;
    res.img.addEventListener('load', res._onLoaded);
  }
	
  function loadJSON(res, url){
		var xhr = res.xhr = new XMLHttpRequest();
		res._onLoaded = function(){
			if(xhr.status !== 200)
				return;
			xhr.removeEventListener('load', res._onLoaded);
			res.data = JSON.parse(xhr.responseText);
			if(res.data.meta && res.data.frames)
				loadSpriteSheet(res, url);
			else{
	      onLoaded(res);
			}
		};
		xhr.addEventListener('load',res._onLoaded);
		xhr.open('GET', url);
		xhr.send();
	}

  function loadSpriteSheet(res, url){
    // var imgUrl = url.replace(/\/\w+\.json$/, '/' + res.data.meta.image);
    var imgUrl = url.replace(/\w+\.json$/, res.data.meta.image);
    loader.add(imgUrl, function(spriteSheet){
      loader.unpackSprites(res.data, spriteSheet.img);
      spriteSheet.images = {};
      Object.keys(res.data.frames).forEach(function(key){
        spriteSheet.images[key] = resources[key];
      });
      onLoaded(res);
    });
    res.img = resources[imgUrl];
  }

  function onLoaded(res){
    res.cb && res.cb(res);
    //TODO: it might be not needed for load event
    res.loaded = true;
    queueLength -= 1;
    if(queueLength < 1){
      callbacks.forEach(function(cb){
        cb();
      });
      callbacks.length = 0;
      loader.loaded = true;
    }
  }



  return loader;
})();
