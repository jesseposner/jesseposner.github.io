/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var Resources = __webpack_require__(1),
	    State = __webpack_require__(2),
	    Sprite = __webpack_require__(3),
	    Starfield = __webpack_require__(4),
	    Key = __webpack_require__(5),
	    enemySpeed = 100,
	    playerSpeed = 200,
	    playerBulletSpeed = 500,
	    enemyBulletSpeed = 100;
	
	function sound(src, loop) {
	  loop = (typeof loop !== 'undefined' ? loop : false);
	
	  this.sound = document.createElement("audio");
	  this.sound.src = src;
	  this.sound.setAttribute("preload", "auto");
	  this.sound.setAttribute("controls", "none");
	  this.sound.style.display = "none";
	  if (loop) {
	    document.body.appendChild(this.sound);
	  } else {
	    document.getElementById("sounds").appendChild(this.sound);
	  }
	  this.play = function(){
	    this.sound.play();
	  };
	  this.stop = function(){
	    this.sound.pause();
	  };
	}
	
	$(document).ready(function () {
	  var canvas = document.createElement("canvas"),
	      ctx = canvas.getContext("2d"),
	      myMusic = new sound("audio/music.mp3", true);
	
	  myMusic.sound.setAttribute("loop", "loop");
	  myMusic.play();
	  canvas.width = 512;
	  canvas.height = 600;
	  document.body.appendChild(canvas);
	
	  $(document).keypress(function(event) {
	    event.preventDefault();
	  });
	
	  $( "#mute" ).click(function() {
	    if (State.muted) {
	      myMusic.play();
	      $('#mute img').attr('src', 'img/unmuted.png');
	      State.muted = false;
	    } else {
	      myMusic.stop();
	      $('#mute img').attr('src', 'img/muted.png');
	      State.muted = true;
	    }
	  });
	
	  Resources.load([
	    'img/ufos.png',
	    'img/fighter.png',
	    'img/fighter-bullet.png',
	    'img/explosion.png',
	    'img/enemy-bullet.png'
	  ]);
	
	  Resources.onReady(init.bind(null, ctx, canvas));
	});
	
	function requestAnimFrame(callback) {
	  return window.requestAnimationFrame(callback)        ||
	         window.webkitRequestAnimationFrame(callback)  ||
	         window.mozRequestAnimationFrame(callback)     ||
	         window.oRequestAnimationFrame(callback)       ||
	         window.msRequestAnimationFrame(callback)      ||
	         window.setTimeout(callback, 1000 / 60);
	}
	
	function init(ctx, canvas) {
	  var lastTime = Date.now(),
	      starField = new Starfield();
	
	  document.getElementById('play-again')
	          .addEventListener('click', function() {
	            reset(canvas);
	  });
	
	  reset(canvas);
	
	  main(ctx, canvas, lastTime, starField);
	}
	
	function main(ctx, canvas, lastTime, starField) {
	  var now = Date.now(),
	      dt = (now - lastTime) / 1000.0;
	
	  if (State.enemies.length === 0) {
	    State.enemyCount += 2;
	    for (var i = 0; i < State.enemyCount; i++) {
	      State.enemies.push({
	        pos: [Math.random() * canvas.width,
	              Math.random() * (canvas.height - 300)],
	        sprite: new Sprite(
	          'img/ufos.png',
	          [0, 0],
	          [64, 64],
	          20,
	          [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
	        )
	      });
	    }
	  }
	
	  State.enemies.forEach(function (enemy, index) {
	    if (Math.random() < 0.004) {
	      State.enemyBullets.push(
	        { pos: [enemy.pos[0], enemy.pos[1] + enemy.sprite.size[1] / 2],
	          sprite: new Sprite(
	            'img/enemy-bullet.png',
	            [0, 0],
	            [50, 50],
	            30,
	            [
	             1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 13,
	             12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1
	            ]
	         )
	      });
	    }
	  });
	
	  update(dt, canvas, starField);
	  render(ctx, canvas, starField);
	
	  lastTime = now;
	  requestAnimFrame(main.bind(null, ctx, canvas, lastTime, starField));
	}
	
	function render(ctx, canvas, starField) {
	  ctx.fillStyle = '#000000';
	  ctx.fillRect(0, 0, canvas.width, canvas.height);
	
	  ctx.fillStyle = '#ffffff';
	  starField.stars.forEach(function (star) {
	    ctx.fillRect(star.x, star.y, star.size, star.size);
	  });
	
	  renderEntity(State.player, ctx);
	
	  State.playerBullets.forEach(function (bullet) {
	    renderEntity(bullet, ctx);
	  });
	
	  State.enemies.forEach(function (enemy) {
	    renderEntity(enemy, ctx);
	  });
	
	  State.enemyBullets.forEach(function (bullet) {
	    renderEntity(bullet, ctx);
	  });
	
	  State.explosions.forEach(function (explosion) {
	    renderEntity(explosion, ctx);
	  });
	}
	
	function renderEntity(entity, ctx) {
	  ctx.save();
	  ctx.translate(entity.pos[0], entity.pos[1]);
	  entity.sprite.render(ctx);
	  ctx.restore();
	}
	
	function update(dt, canvas, starField) {
	  State.gameTime += dt;
	
	  handleInput(dt, canvas);
	  updateEntities(dt, canvas);
	  updateStarfield(dt, starField);
	  checkCollisions();
	}
	
	function updateEntities(dt, canvas) {
	  State.player.sprite.update(dt);
	
	  State.explosions.forEach(function (explosion, index) {
	    explosion.sprite.update(dt);
	
	    if (explosion.sprite.done) {
	      State.explosions.splice(index, 1);
	    }
	  });
	
	  State.playerBullets.forEach(function (bullet, index) {
	    bullet.pos[1] -= playerBulletSpeed * dt;
	
	    if (bullet.pos[1] < 0 - bullet.sprite.size[1]) {
	      State.playerBullets.splice(index, 1);
	    }
	
	    bullet.sprite.update(dt);
	  });
	
	  State.enemyBullets.forEach(function (bullet, index) {
	    bullet.pos[1] += enemyBulletSpeed * dt;
	
	    if (bullet.pos[1] > canvas.height) {
	      State.enemyBullets.splice(index, 1);
	    }
	
	    bullet.sprite.update(dt);
	  });
	
	  State.enemies.forEach(function (enemy) {
	    if (enemy.pos[0] <= 0) {
	      enemy.sprite.orientation = 'right';
	    } else if (
	        enemy.pos[0] >= canvas.width - enemy.sprite.size[0] &&
	        enemy.sprite.orientation === 'right'
	        ) {
	      enemy.sprite.orientation = 'left';
	    }
	
	    if (enemy.sprite.orientation === 'left') {
	      enemy.pos[0] -= enemySpeed * dt;
	    } else {
	      enemy.pos[0] += enemySpeed * dt;
	    }
	
	    enemy.sprite.update(dt);
	  });
	}
	
	function updateStarfield(dt, starField) {
	  starField.stars.forEach(function (star) {
	    star.y += dt * star.velocity;
	
	    if (star.y > starField.height) {
	      star.x = Math.random() * starField.width;
	      star.y = 0;
	      star.size = (Math.random() * 3) + 1;
	      star.velocity = (Math.random() *
	        (starField.maxVelocity - starField.minVelocity)) +
	          starField.minVelocity;
	     }
	  });
	}
	
	function collides(x, y, r, b, x2, y2, r2, b2) {
	  return !(r <= x2 || x > r2 ||
	           b <= y2 || y > b2);
	}
	
	function boxCollides(pos, size, pos2, size2) {
	  return collides(pos[0], pos[1],
	                  pos[0] + size[0], pos[1] + size[1],
	                  pos2[0], pos2[1],
	                  pos2[0] + size2[0], pos2[1] + size2[1]);
	}
	
	function checkCollisions() {
	  State.enemyBullets.forEach(function (bullet, bulletIndex) {
	    var playerPos = State.player.pos,
	        playerSize = [State.player.sprite.size[0] - 20,
	                      State.player.sprite.size[1] - 20],
	        bulletPos = bullet.pos,
	        bulletSize = [bullet.sprite.size[0] - 20, bullet.sprite.size[1] - 20];
	
	    if (boxCollides(playerPos, playerSize, bulletPos, bulletSize)) {
	      if (!State.muted) new sound("audio/player_death.mp3").play();
	      State.explosions.push({
	        pos: playerPos,
	        sprite: new Sprite('img/explosion.png',
	                           [0, 0],
	                           [50, 105],
	                           17,
	                           [
	                             0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
	                             13, 14, 15, 16, 17
	                           ],
	                           null,
	                           true)
	      });
	      State.enemyBullets.splice(bulletIndex, 1);
	      gameOver();
	    }
	  });
	
	  State.enemies.forEach(function (enemy, enemyIndex) {
	      var enemyPos = enemy.pos,
	          enemySize = enemy.sprite.size;
	
	      State.playerBullets.forEach(function (bullet, bulletIndex) {
	        var bulletPos = bullet.pos,
	            bulletSize = bullet.sprite.size;
	
	        if (boxCollides(enemyPos, enemySize, bulletPos, bulletSize)) {
	          if (!State.muted) new sound("audio/enemy_death.mp3").play();
	          State.explosions.push({
	            pos: enemyPos,
	            sprite: new Sprite('img/explosion.png',
	                               [0, 0],
	                               [50, 105],
	                               17,
	                               [
	                                 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
	                                 13, 14, 15, 16, 17
	                               ],
	                               null,
	                               true)
	          });
	          State.enemies.splice(enemyIndex, 1);
	          State.playerBullets.splice(bulletIndex, 1);
	          State.score += 100;
	          document.getElementById('weapon-status-text').innerText = State.score;
	        }
	      });
	  });
	}
	
	function handleInput(dt, canvas) {
	  if (
	      Key.isPressed('space') && Date.now() - State.lastFire > 500
	    ) {
	    var x = State.player.pos[0],
	        y = State.player.pos[1] - State.player.sprite.size[1] / 2,
	        playerShot = new sound("audio/player_shot.mp3");
	
	    State.playerBullets.push({ pos: [x, y], sprite: new Sprite(
	                           'img/fighter-bullet.png',
	                           [0, 0],
	                           [50, 120],
	                           15,
	                           [
	                             0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
	                             9, 8, 7, 6, 5, 4, 3, 2, 1
	                           ]
	                         )
	                      });
	
	    State.lastFire = Date.now();
	    if (!State.muted) playerShot.play();
	  }
	
	  if (Key.isPressed('left') && State.player.pos[0] >= 0) {
	    State.player.pos[0] -= playerSpeed * dt;
	
	    if (State.playerDirection === 'center') {
	      State.playerDirection = 'incomplete';
	
	      State.player.sprite = new Sprite(
	        'img/fighter.png',
	        [0, 0],
	        [50, 135],
	        15,
	        [4, 3, 2, 1, 0],
	        null,
	        null,
	        function () {
	          State.playerDirection = 'left';
	        }
	      );
	    } else if (State.playerDirection === 'right') {
	      State.playerDirection = 'incomplete';
	
	      State.player.sprite = new Sprite(
	        'img/fighter.png',
	        [0, 0],
	        [50, 135],
	        15,
	        [9, 8, 7, 6, 5],
	        null,
	        null,
	        function () {
	          State.playerDirection = 'center';
	        }
	      );
	    }
	  } else if (
	      Key.isPressed('right') &&
	      State.player.pos[0] <= canvas.width - State.player.sprite.size[0]
	    ) {
	    State.player.pos[0] += playerSpeed * dt;
	
	    if (State.playerDirection === 'center') {
	      State.playerDirection = 'incomplete';
	
	      State.player.sprite = new Sprite(
	        'img/fighter.png',
	        [0, 0],
	        [50, 135],
	        15,
	        [6, 7, 8, 9, 10],
	        null,
	        null,
	        function () {
	          State.playerDirection = 'right';
	        }
	      );
	    } else if (State.playerDirection === 'left') {
	      State.playerDirection = 'incomplete';
	
	      State.player.sprite = new Sprite(
	        'img/fighter.png',
	        [0, 0],
	        [50, 135],
	        15,
	        [1, 2, 3, 4, 5],
	        null,
	        null,
	        function () {
	          State.playerDirection = 'center';
	        }
	      );
	    }
	  } else if (Key.getPressedKeyCodes().length === 0) {
	    if (State.playerDirection === 'left') {
	      State.playerDirection = 'incomplete';
	
	      State.player.sprite = new Sprite(
	        'img/fighter.png',
	        [0, 0],
	        [50, 135],
	        15,
	        [1, 2, 3, 4, 5],
	        null,
	        null,
	        function () {
	          State.playerDirection = 'center';
	        }
	      );
	    } else if (State.playerDirection === 'right') {
	      State.playerDirection = 'incomplete';
	
	      State.player.sprite = new Sprite(
	        'img/fighter.png',
	        [0, 0],
	        [50, 135],
	        15,
	        [9, 8, 7, 6, 5],
	        null,
	        null,
	        function () {
	          State.playerDirection = 'center';
	        }
	      );
	    }
	  }
	}
	
	function gameOver() {
	  document.getElementById('game-over').style.display = 'block';
	  document.getElementById('game-over-overlay').style.display = 'block';
	  State.player.pos = [1000, 1000];
	}
	
	function reset(canvas) {
	  document.getElementById('game-over').style.display = 'none';
	  document.getElementById('game-over-overlay').style.display = 'none';
	  document.getElementById('weapon-status-text').innerText = '';
	  document.getElementById('weapon-status-text').style.color = 'green';
	
	  var sounds = document.getElementById("sounds");
	  while (sounds.firstChild) {
	    sounds.removeChild(sounds.firstChild);
	  }
	
	  State.gameTime = 0;
	  State.score = 0;
	
	  State.enemies = [];
	  State.bullets = [];
	  State.enemyBullets = [];
	  State.enemyCount = 3;
	
	  State.player.pos = [256, 450];
	
	  for (var i = 0; i < State.enemyCount; i++) {
	    State.enemies.push({
	      pos: [Math.random() * canvas.width,
	            Math.random() * (canvas.height - 300)],
	      sprite: new Sprite(
	        'img/ufos.png',
	        [0, 0],
	        [64, 64],
	        20,
	        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
	      )
	    });
	  }
	}


/***/ },
/* 1 */
/***/ function(module, exports) {

	var resourceCache = {};
	var loading = [];
	var readyCallbacks = [];
	
	function _load(url) {
	  if (resourceCache[url]) {
	   return resourceCache[url];
	  } else {
	   var img = new Image();
	   img.onload = function() {
	     resourceCache[url] = img;
	
	     if(Resources.isReady()) {
	       readyCallbacks.forEach(function(func) { func(); });
	     }
	   };
	   resourceCache[url] = false;
	   img.src = url;
	  }
	}
	
	var Resources = {
	  load: function(urlOrArr) {
	    if (urlOrArr instanceof Array) {
	      urlOrArr.forEach(function(url) {
	        _load(url);
	      });
	    } else {
	      _load(urlOrArr);
	    }
	  },
	
	  get: function(url) {
	    return resourceCache[url];
	  },
	
	  isReady: function() {
	    var ready = true;
	    for (var k in resourceCache) {
	      if(resourceCache.hasOwnProperty(k) &&
	         !resourceCache[k]) {
	          ready = false;
	      }
	    }
	    return ready;
	  },
	
	  onReady: function(func) {
	    readyCallbacks.push(func);
	  }
	};
	
	module.exports = Resources;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Sprite = __webpack_require__(3);
	
	var State = {
	  player: {
	    pos: [0, 450],
	    sprite: new Sprite(
	      'img/fighter.png', [0, 0], [50, 135], 1, [5]
	    )
	  },
	
	  playerBullets: [],
	
	  enemyBullets: [],
	
	  enemyCount: 3,
	
	  enemies: [],
	
	  explosions: [],
	
	  lastFire: 0,
	
	  gameTime: 0,
	
	  score: 0,
	
	  playerDirection: 'center',
	
	  muted: false
	};
	
	module.exports = State;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var Resources = __webpack_require__(1);
	
	var Sprite = function(url, pos, size, speed, frames, dir, once, stickyOnce) {
	  this.url = url;
	  this.pos = pos;
	  this.size = size;
	  this.speed = typeof speed === 'number' ? speed : 0;
	  this.frames = frames;
	  this.dir = dir || 'horizontal';
	  this.once = once;
	  this.stickyOnce = stickyOnce;
	
	  this._index = 0;
	  this.orientation = 'left';
	};
	
	Sprite.prototype = {
	  update: function(dt) {
	    this._index += this.speed * dt;
	  },
	
	  render: function(ctx) {
	    var max = this.frames.length,
	        idx = Math.floor(this._index),
	        frame;
	
	    if (this.stickyOnce && idx >= max) {
	      this.stickyOnce();
	      frame = this.frames[this.frames.length - 1];
	    } else if (this.speed > 0) {
	      frame = this.frames[idx % max];
	
	      if (this.once && idx >= max) {
	       this.done = true;
	       return;
	      }
	    } else {
	      frame = 0;
	    }
	
	    var x = this.pos[0];
	    var y = this.pos[1];
	
	    if (this.dir === 'vertical') {
	      y += frame * this.size[1];
	    }
	    else {
	      x += frame * this.size[0];
	    }
	
	    ctx.drawImage(
	      Resources.get(this.url),
	      x, y,
	      this.size[0], this.size[1],
	      0, 0,
	      this.size[0], this.size[1]
	    );
	  }
	};
	
	module.exports = Sprite;


/***/ },
/* 4 */
/***/ function(module, exports) {

	var Starfield = function functionName() {
	  this.width = 512;
	  this.height = 600;
	  this.minVelocity = 15;
	  this.maxVelocity = 30;
	  this.starCount = 100;
	  this.stars = [];
	  this.Star = function (x, y, size, velocity) {
	    this.x = x;
	    this.y = y;
	    this.size = size;
	    this.velocity = velocity;
	  };
	
	  for (var i = 0; i < this.starCount; i++) {
	    this.stars.push(
	      new this.Star(
	        Math.random() * this.width,
	        Math.random() * this.height,
	       (Math.random() * 3) + 1,
	       (Math.random() * (this.maxVelocity - this.minVelocity)) +
	          this.minVelocity
	      )
	    );
	  }
	};
	
	module.exports = Starfield;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	(function(global){var k,_handlers={},_mods={16:false,18:false,17:false,91:false},_scope="all",_MODIFIERS={"⇧":16,shift:16,"⌥":18,alt:18,option:18,"⌃":17,ctrl:17,control:17,"⌘":91,command:91},_MAP={backspace:8,tab:9,clear:12,enter:13,"return":13,esc:27,escape:27,space:32,left:37,up:38,right:39,down:40,del:46,"delete":46,home:36,end:35,pageup:33,pagedown:34,",":188,".":190,"/":191,"`":192,"-":189,"=":187,";":186,"'":222,"[":219,"]":221,"\\":220},code=function(x){return _MAP[x]||x.toUpperCase().charCodeAt(0)},_downKeys=[];for(k=1;k<20;k++)_MAP["f"+k]=111+k;function index(array,item){var i=array.length;while(i--)if(array[i]===item)return i;return-1}function compareArray(a1,a2){if(a1.length!=a2.length)return false;for(var i=0;i<a1.length;i++){if(a1[i]!==a2[i])return false}return true}var modifierMap={16:"shiftKey",18:"altKey",17:"ctrlKey",91:"metaKey"};function updateModifierKey(event){for(k in _mods)_mods[k]=event[modifierMap[k]]}function dispatch(event){var key,handler,k,i,modifiersMatch,scope;key=event.keyCode;if(index(_downKeys,key)==-1){_downKeys.push(key)}if(key==93||key==224)key=91;if(key in _mods){_mods[key]=true;for(k in _MODIFIERS)if(_MODIFIERS[k]==key)assignKey[k]=true;return}updateModifierKey(event);if(!assignKey.filter.call(this,event))return;if(!(key in _handlers))return;scope=getScope();for(i=0;i<_handlers[key].length;i++){handler=_handlers[key][i];if(handler.scope==scope||handler.scope=="all"){modifiersMatch=handler.mods.length>0;for(k in _mods)if(!_mods[k]&&index(handler.mods,+k)>-1||_mods[k]&&index(handler.mods,+k)==-1)modifiersMatch=false;if(handler.mods.length==0&&!_mods[16]&&!_mods[18]&&!_mods[17]&&!_mods[91]||modifiersMatch){if(handler.method(event,handler)===false){if(event.preventDefault)event.preventDefault();else event.returnValue=false;if(event.stopPropagation)event.stopPropagation();if(event.cancelBubble)event.cancelBubble=true}}}}}function clearModifier(event){var key=event.keyCode,k,i=index(_downKeys,key);if(i>=0){_downKeys.splice(i,1)}if(key==93||key==224)key=91;if(key in _mods){_mods[key]=false;for(k in _MODIFIERS)if(_MODIFIERS[k]==key)assignKey[k]=false}}function resetModifiers(){for(k in _mods)_mods[k]=false;for(k in _MODIFIERS)assignKey[k]=false}function assignKey(key,scope,method){var keys,mods;keys=getKeys(key);if(method===undefined){method=scope;scope="all"}for(var i=0;i<keys.length;i++){mods=[];key=keys[i].split("+");if(key.length>1){mods=getMods(key);key=[key[key.length-1]]}key=key[0];key=code(key);if(!(key in _handlers))_handlers[key]=[];_handlers[key].push({shortcut:keys[i],scope:scope,method:method,key:keys[i],mods:mods})}}function unbindKey(key,scope){var multipleKeys,keys,mods=[],i,j,obj;multipleKeys=getKeys(key);for(j=0;j<multipleKeys.length;j++){keys=multipleKeys[j].split("+");if(keys.length>1){mods=getMods(keys)}key=keys[keys.length-1];key=code(key);if(scope===undefined){scope=getScope()}if(!_handlers[key]){return}for(i=0;i<_handlers[key].length;i++){obj=_handlers[key][i];if(obj.scope===scope&&compareArray(obj.mods,mods)){_handlers[key][i]={}}}}}function isPressed(keyCode){if(typeof keyCode=="string"){keyCode=code(keyCode)}return index(_downKeys,keyCode)!=-1}function getPressedKeyCodes(){return _downKeys.slice(0)}function filter(event){var tagName=(event.target||event.srcElement).tagName;return!(tagName=="INPUT"||tagName=="SELECT"||tagName=="TEXTAREA")}for(k in _MODIFIERS)assignKey[k]=false;function setScope(scope){_scope=scope||"all"}function getScope(){return _scope||"all"}function deleteScope(scope){var key,handlers,i;for(key in _handlers){handlers=_handlers[key];for(i=0;i<handlers.length;){if(handlers[i].scope===scope)handlers.splice(i,1);else i++}}}function getKeys(key){var keys;key=key.replace(/\s/g,"");keys=key.split(",");if(keys[keys.length-1]==""){keys[keys.length-2]+=","}return keys}function getMods(key){var mods=key.slice(0,key.length-1);for(var mi=0;mi<mods.length;mi++)mods[mi]=_MODIFIERS[mods[mi]];return mods}function addEvent(object,event,method){if(object.addEventListener)object.addEventListener(event,method,false);else if(object.attachEvent)object.attachEvent("on"+event,function(){method(window.event)})}addEvent(document,"keydown",function(event){dispatch(event)});addEvent(document,"keyup",clearModifier);addEvent(window,"focus",resetModifiers);var previousKey=global.key;function noConflict(){var k=global.key;global.key=previousKey;return k}global.key=assignKey;global.key.setScope=setScope;global.key.getScope=getScope;global.key.deleteScope=deleteScope;global.key.filter=filter;global.key.isPressed=isPressed;global.key.getPressedKeyCodes=getPressedKeyCodes;global.key.noConflict=noConflict;global.key.unbind=unbindKey;if(true)module.exports=assignKey})(this);

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map