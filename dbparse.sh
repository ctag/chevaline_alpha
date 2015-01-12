#!/bin/bash

while read line
do

#echo "line: $line"
#echo "len:  ${#line}"

lineLen=`echo ${#line}`

if [[ "${#line}" -lt "5" ]]
then
addition=$line
else
echo ${addition} " , " ${line} # >> DatabaseNew
fi

done <Database >Database.tmp1

tr -d ' \t\r\f' <Database.tmp1 >Database.tmp2

#sed 's/,,/,R,/g' Database.tmp2 >Database.tmp3

#sed 's/,/","/g' Database.tmp3 >Database.tmp4

#sed 's/^/"/g' Database.tmp4 >Database.tmp5
#sed 's/$/"/g' Database.tmp5 >Database.tmp6

#sed "s/'/\\\'/g" Database.tmp6 >Database.tmp7

#echo '"college","section_type","crn","course_num","course_sec","course_title","credit_hours","max_enrollment","cur_enrollment","seats_available","waitlist_num","days","time_start","time_end","building","room","instructor"' >DatabaseDone

cat Database.tmp7 >>DatabaseDone
