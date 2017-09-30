var game = (function(){
  var root, topBar;
  var exitGame = function(){
    game.onexit && game.onexit();
    ticker.running = false;//stops all game actions
  };
  //
  // var scaleRoot = function(w, h){
  //   root.set({
  //     scaleX: w/root.width,
  //     scaleY: h/root.height
  //   });
  // };

  var stages = {
    0: function(renderer){
      root = new D.Container(config.root);
      root.set({
        width: renderer.view.width,
        height: renderer.view.height
      });
      var animate = function(delta){
        renderer.render(root);
      };
      ticker.add(animate);
      //exit is global, vailable at all times
      var exit = new D.Container(config.exit);
      var exitBtn = new D.Sprite(config.exit.button.imgUrl, config.exit.button);
      exit.addChild(exitBtn);
      var exitCross = new D.Sprite(config.exit.cross.imgUrl, config.exit.cross);
      exit.addChild(exitCross);
      exitBtn.on('click', exitGame);

      topBar = new D.Container(config.topBar);
      topBar.addChild(exit);

      stages[1](renderer);
    },
    1: function(renderer){
      var stage = new D.Container({
        interactive: true,
        width: root.width,
        height: root.height
      });
      root.addChild(stage);
      root.addChild(topBar);

      var bg = new D.Sprite(config.stage1.bg.imgUrl);
      stage.addChild(bg);
      //need to have it after bg so its not covered

      var lives = new D.Container(config.lives);
      topBar.addChild(lives);
      for(var i = 0; i < config.lives.count; i++){
        var life = new D.Sprite(config.lives.life.imgUrl, config.lives.life);
        life.set({x: i * config.lives.offset});
        lives.addChild(life);
      }
      lives.removeLife = function(){
        lives.removeChild(lives.children[lives.children.length-1]);
        lives.count -=1;
        return lives.count;
      };

      var player = new D.Container(config.player);
      player.set({x: 500});
      var playerImg = new D.Sprite(config.player.image.imgUrl, config.player.image);
      player.addChild(playerImg);
      var playerHitbox = new D.Container(config.player.hitbox);
      player.addChild(playerHitbox);
      stage.addChild(player);

      var countdown = new D.Text(config.countdown);
      stage.addChild(countdown);

      var itemCnt = new D.Container();
      stage.addChild(itemCnt);

      //player walk in
      tween.get(player, player.set).to({x: config.player.x}, 2000);

      tween.get(countdown, countdown.set)
      .call(countdown.set.bind(countdown, 'text', 3))
      .to({alpha: 1}, 200)
      .to({}, 600)
      .to({alpha: 0}, 200)
      .call(countdown.set.bind(countdown, 'text', 2))
      .to({alpha: 1}, 200)
      .to({}, 600)
      .to({alpha: 0}, 200)
      .call(countdown.set.bind(countdown, 'text', 1))
      .to({alpha: 1}, 200)
      .to({}, 600)
      .to({alpha: 0}, 200)
      .call(function(){
        stage.removeChild(countdown);
      })
      .call(unlockGame);

      var items = [];
      for(var i = config.items.count; i--;)
        items.push(config.items.imgUrl);
      items = items.map(function(img, i){
        var idx = (i+1).toString();
        while(idx.length < config.items.digits)
        idx = '0' + idx;
        return img.replace('{n}', idx);
      });

      function unlockGame(){
        //player movement
        stage.on('mousedown', function(ev){
          tween.removeAllTweens(player);
          //if changing direction, flip player img horizontally
          if((player.scaleX > 0 && ev.offsetX > player.x) || (player.scaleX < 0 && ev.offsetX < player.x))
            player.set({scaleX: player.scaleX * -1});
          var distance = Math.abs(player.x-ev.offsetX);
          tween.get(player, player.set).to({x: ev.offsetX}, distance/config.player.movementSpeed*1000);
        });

        //get all items that will be dropping

        dropItems();
      }
      function dropItems(){
        if(!lives.count || player.points >= player.maxPoints)
          return;
        var itemUrl = items.shift();
        items.push(itemUrl);
        console.log(itemUrl);
        var item = new D.Sprite(itemUrl);
        item.set({
          centered: true,
          y: -50,
          x: renderer.view.width * 0.1 + Math.random() * renderer.view.width*0.8//10% padding
        });
        itemCnt.addChild(item);

        //handles losing lives
        tween.get(item, item.set)
          .to({y: renderer.view.height + 50, rotate: 480}, config.items.fallTime)
          .call(function(){
            tween.removeAllTweens(item);
            ticker.remove(collision);
            fallCb(item);
          });
        //handles catching items
        function collision(){
          if(item.collidesWith(playerHitbox)){
            tween.removeAllTweens(item);
            ticker.remove(collision);
            catchCb(item);
          }
        }
        ticker.add(collision);

        dropTimeout = setTimeout(dropItems, (Math.random() * (config.items.fallFreqMax - config.items.fallFreqMin) +
        config.items.fallFreqMin) % config.items.fallFreqMax);
      }

      //when itme falls, remove it and remove life
      function fallCb(item){
        itemCnt.removeChild(item);
        if(!lives.count)
          return;
        var livesLeft = lives.removeLife();
        if(!livesLeft){
          finish();
        }
      }

      //when catching item, animate it towards player, remove it and add point
      function catchCb(item){
        player.points += 1;
        if(player.points >= player.maxPoints)
          finish();
        var aimTime = config.items.catchTime;
        var aimTimeout;
        var aim =  function(){
          aimTime-= 50;
          tween.removeAllTweens(item);
          tween.get(item, item.set).to({x: player.x, y: player.y, scaleX: 0.2, scaleY: 0.2}, aimTime)
          .call(function(){
            clearInterval(aimTimeout);
            itemCnt.removeChild(item);
          });
          if(aimTime > 0)
          aimTimeout = setTimeout(aim, 50);
        };
        aim();
      }

      function finish(){
        clearTimeout(dropTimeout);
        stage.removeChild(lives);
        tween.get(stage, stage.set).to({alpha: 0}, 500).call(function(){
          stage.removeChildren();
          root.removeChild(stage);
        });
        stages[2](renderer);
      }
    },
    2: function(){
      var stage2 = new D.Container({
        interactive: true,
        width: root.width,
        height: root.height,
        alpha: 0
      });

      var bg2 = new D.Sprite(config.stage2.bg.imgUrl, {
      });

      //need to have it after bg so its not covered
      root.removeChild(topBar);
      stage2.addChild(bg2);
      root.addChild(stage2);
      root.addChild(topBar);

      tween.get(stage2, stage2.set).to({alpha: 1}, 500).call(function(){
        console.log(stage2);
      });

      var message = new D.Container(config.message);
      stage2.addChild(message);
      var messageImg = new D.Sprite(config.message.img.imgUrl, config.message.img);
      message.addChild(messageImg);
      var text = new D.Sprite(config.text.imgUrl, config.text);
      message.addChild(text);
      var openButton = new D.Sprite(config.openButton.imgUrl, config.openButton);
      message.addChild(openButton);
      openButton.on('click', function(){
        game.onopen && game.onopen();
      });

    }
  };

  return {
    stages: stages,
    // scaleRoot: scaleRoot,
    exit: exitGame
  };
})();
