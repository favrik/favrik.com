#!/bin/sh
DRAFTDIR=./blog/_drafts/
FILE=$DRAFTDIR$(date +%F)-$(echo $1 | tr [A-Z] [a-z] | sed 's/ \|\./-/g').markdown
#echo $1
#echo $FILE
touch $FILE
echo "---\nlayout: post\ntitle: $1\nmeta_description: \nmeta_keywords: \n---\n" > $FILE
gvim $FILE
