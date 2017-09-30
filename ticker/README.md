##just a RAF based ticking queue, no RAF fallbacks to timeout, no performance fallbacks to Date


###props:
.targetFPS, .FPS (current), .elapsedMS(between two latest ticks), .running, .lastDate(date of lat tick), .callbacks(queue of [{fn, ctx}, {fn,ctx}, ...])


###methods:
add(fn, [context]) to subscribe function, starts ticker if not running


remove(fn, [context]) to unsubscribe function, stops ticker if empty queue


stop() will pause withotu removing queue


start() will unpause stuff in the queue


### pulled out from my microengine repo


