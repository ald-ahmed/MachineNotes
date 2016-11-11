#!/usr/bin/env bash
cd "$(dirname "$0")"

count=1
for i in *; do
    mv "${i}" ${count}.`echo "${i}" | awk -F. '{print $2}'`
    ((++count))
done
