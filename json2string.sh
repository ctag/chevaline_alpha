#!/bin/bash

sed "s/'/\\\'/g" $1 >tmp.txt

LINE=$(tr -d ' \n\t\r\f' <tmp.txt)

echo "var courses = "${LINE} >$2
