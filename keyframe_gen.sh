#!/bin/bash
#
# Usage: sh keyframe_gen.sh <animation folder name>
# ***IMPORTANT***
# You must be in the root zeichen directory when running this script
#
# Different animation sets are in the animations/ directory, so when we look for
# an animation by name, we're looking for animations/<animation name>.
# If you called this script like: 
#
# $ sh keyframe_gen.sh slideUpDown
#
# the webkit scss file in animations/slideUpDown will be used as the source for generating
# the moz and nopre files. The generated files are then copied to the root zeichen directory
# and the sass recompiled

echo "animations/$1"
WEBKITDIR="animations/$1/zeichen_keyframes_webkit.scss"

cat $WEBKITDIR > zeichen_keyframes_webkit.scss
sed s/-webkit-/-moz-/g < $WEBKITDIR > zeichen_keyframes_moz.scss
sed s/-webkit-//g < $WEBKITDIR > zeichen_keyframes_nopre.scss
sass zeichen.scss zeichen.css
