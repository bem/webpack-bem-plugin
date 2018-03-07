#!/bin/bash

# see https://seesparkbox.com/foundry/semantic_commit_messages

AWK_PROG='!/^(feat|docs|chore|fix|refactor|style|test|localize): / {
  print "Commit message does not comply with Semantic Commit Messages."
  print "Message > " $0

  exit 1
}'

git show -s --format=%s $TRAVIS_COMMIT_RANGE | while read msg
do
    echo $msg | awk "$AWK_PROG" || exit 1
done
