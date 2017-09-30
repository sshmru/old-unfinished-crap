window.NjuGame = function(gameCfg){
  var assets = gameCfg.assets;
  var popout = document.createElement('div');

  // var renderer = new R.DOMRenderer(null, {width: 330, height: 550});
  var renderer = new R.canvasRenderer(null, {
    width: config.root.width,
    height: config.root.height
  });
  // var rescale= function(){
  //   var w = window.innerWidth;
  //   var h = window.innerHeight;
  //   var scale = config.root.width/config.root.height;
  //   if(w/h > scale){
  //     game.scaleRoot(config.root.width * w/h, h);
  //   }else{
  //     game.scaleRoot(w, config.root.height * w/h);
  //   }
  // };
  // window.addEventListener('resize', rescale);
  // renderer.view.height= window.innerHeight;

  popout.appendChild(renderer.view);
  popout.style = "position: fixed; top:0; bottom:0; right:0; left: 0; background:#00A6CF";

  assets.forEach(function(asset){
    loader.add(asset);
  });
  loader.call(function(){
    var adTimeout = setTimeout(function(){
      game.exit();
    },gameCfg.timeout);
    var clearAdTimeout = function(){
      clearTimeout(adTimeout);
      renderer.view.removeEventListener('mousedown', clearAdTimeout);
    };
    renderer.view.addEventListener('mousedown', clearAdTimeout);
    document.body.appendChild(popout);
    game.onexit = function(){
      // window.removeEventListener('resize', rescale);
      document.body.removeChild(popout);
    };
    game.onopen= function(){
      window.location.href = gameCfg.click;
    };
    game.stages[0](renderer);
  });

};
