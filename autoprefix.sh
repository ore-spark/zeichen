#!/bin/bash
#
# ::USAGE::
# sh autoprefix.sh filename
# This is a poor mans auto prefixer. Workflow is as follows:
# 1. Code up working css rules for webkit
# 2. Run this script
#  - The script will use 'sed' to replace any instance of -webkit-
#    with -moz- or no prefix, and output the compiled file. This
#    will overwrite any previous compiled files.

echo "compiling $1"

webkitSource=$(cat $1)

filetype=$(echo "$1" | grep -o "\.css\|\.scss")

if [ -z "$filetype" ]; then
    echo -e '\E[31m'"\033[1mSorry, you can only run this on .css and .scss files\033[0m" 
    exit;
fi
echo "$filetype"

mozSource=$(echo "$webkitSource" | sed 's/-webkit-/-moz-/g')
echo "compiling moz from webkit file"
nopreSource=$(echo "$webkitSource" | sed 's/-webkit-//g')
echo "compiling unprefixed from webkit file"

echo "$webkitSource" > "compiled$filetype"
echo "$mozSource" >> "compiled$filetype"
echo "$nopreSource" >> "compiled$filetype"

echo "compiled file created."

if [ "$filetype" = ".scss" ]; then
    echo "I see that you used an scss file. I can compile that for you :)"
    sass compiled.scss compiled.css
    echo "compiled.css created"
fi

