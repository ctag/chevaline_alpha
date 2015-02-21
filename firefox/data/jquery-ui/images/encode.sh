#!/bin/bash

for file in *.png
do

uuencode -m ${file} ${file} > ${file}.base64

done

