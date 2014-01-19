zeichen.js
=======

(Growl/Toast/whatever you want to call fixed position browser notices really)-like plugin for browser message popups. Supports fun things like action callbacks on messages, fun css3 animations, customization of everything from the html templates used to the css prefixes for each element. Dead simple to use, perhaps a little bit ridiculous in the sense of config options.

I used Toastr: http://codeseven.github.io/toastr/ as inspiration, but I wanted to mess around a ton with it. I have no idea if what I created is any better, but it's fun to mess with. I also wanted something that would allow anything as an icon and not rely on background images.

Included is the default css file and its scss source files, a small shell script for generating the other keyframe rule sheets for moz and unprefixed browsers. It's bad, but it works for what I need. The script uses the webkit keyframes scss file as the source of the shell script.

All that is needed for usage is including jquery, zeichen.js, and zeichen.css on the page. You can then fire off a message with zeichen.info('hi there'); A better readme is coming when I have time. For now theres a demo html page.

This should work on Chrome and FF at least. Haven't had a chance to test Safari or IE, and I dont care about Opera or IE < 11. Sorry if thats a bummer.