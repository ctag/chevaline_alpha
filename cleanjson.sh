#!/bin/bash

LINE=$(tr -d ' \n\t\r\f' <$1)

echo ${LINE} >$1
