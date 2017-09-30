javascript:(function(){var a = decodeURI(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURI('v').replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
window.location.replace('http://www.youtube.com/v/'+a+'?version=3&loop=1&playlist='+a+'&hd=1&autoplay=1');})()
