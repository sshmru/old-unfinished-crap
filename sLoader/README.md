##sLoader(spritesheet-loader)
this guy can download images, jsons, or unpack spritesheets in PIXI format


###methods:
add(url, [cb]) loads stuff, result will be available at sLoader.resources[url], accepts images and jsons, if json.meta given, loads as spritesheet, runs cb on load


get(url) gets smth from resources, if not present, loads it


unpackSprites(json, img) gets spritesheet.json and spritesheet.img and adds each frame to resouces[framename]


call() runs after loading finishes(if not loading, doesnt run !)


##props
.loaded - whats that i wonder?


.resources[{url, loaded, cb, [data], [img], [xhr] }] results of loading, data is present in jsons, xhr comes when json starts loading, img is dom node with image


### pulled out from my microengine repo