#!/bin/sh
DRAFTDIR=./_drafts/
FILE=$DRAFTDIR$(date +%F)-$(echo $1 | tr [A-Z] [a-z] | sed 's/ \|\./-/g').markdown
#echo $1
#echo $FILE
touch $FILE
echo "---\nlayout: post\ntitle: $1\n\n---\n" > $FILE
gvim $FILE
