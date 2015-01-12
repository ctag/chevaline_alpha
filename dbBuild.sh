#!/bin/bash

#
# Database creator
# Useful for any program that takes in
# delimited data
#
# Written by: Christopher Bero, Jean-Luc Burhop
#

#
# Global Variables
#
WEBSITE="http://www.uah.edu/cgi-bin/schedule.pl?file="
SEMESTER="sprg" # sprg, fall, smr?
YEAR="2015"
EXTENSION=".html"
URL=${WEBSITE}${SEMESTER}${YEAR}${EXTENSION}
TMPDIR="UAHsites"
SITEFILE="webcrawl"
COURSE_ITEMS=("section_type" "crn" "course_num" "course_sec" "course_title" "credit_hours" "max_enrollment" "cur_enrollment" "seats_available" "waitlist_num" "days" "time_start" "time_end" "building" "room" "instructor")

#
# grab() function
#
# Downloads URLs needed to get class information from UAH website
# Then appends uah.edu to start of every URL
# Finally downloads each text file from the website
# Cleans up when done
#
grab()
{
	wget $URL -O tmp
	cat tmp | grep 'href' | grep 'segment' | cut -d "\"" -f 2 | sed -e 's/^/uah.edu/g' > $SITEFILE
	mkdir classes
	exec <webcrawl
	cd classes
	while read line
	do
		echo "Link: $line"
		COURSE="`echo $line | cut -d "=" -f 3`"
		wget $line -O $COURSE
	done
	cd -
	#rm $SITEFILE
}

#
# clean() function
#
# Strips the files of useless info to make cutting each section easier
# Cleans up when done
#
clean()
{
	cd classes
	for f in `ls`;
	do
		if [ $f == "schedule.pl" ]; then
			rm $f
		else
		NAME=`echo $f`
		SIZE=`sed -e 's/<[^>]*>//g' -e '1,11d' $f | wc -l`
		let LINE=$SIZE-22
		`sed -e 's/<[^>]*>//g' -e '1,11d' $f | head --lines=$LINE > tmp`
		`cat tmp > $NAME`
		`rm tmp`
		fi
	done
	cd -
}

#
# build() function
#
# Cuts each section from the websites, except for course type
# Pastes each file into a tempDB with @ as a delimiter
# Strips database of useless information
# Moves tmp database to final one
# Cleans up when done
#
build()
{
	#cd UAHsites
	cd classes
	
	FLAG_F=0
	
	for f in `ls`;
	do
		if [ $FLAG_F -eq 0 ]
		then
			echo "[[" >> tmpDB
			FLAG_F=1
		fi
		
		if [ $FLAG_F -eq 1 ]
		then
			FLAG_F=2
		else
			echo "],[" >> tmpDB
		fi
		
		echo '"'${f}'",' >> tmpDB # Dept.

		#echo "[" >> tmpDB
		
		FLAG_LINE=0
		
		IFS= #this is bullshit
		while read line
		do
			#echo "line: "${line}
			data[0]=$(echo $line | cut -c 1-4) # Section Type
			data[1]=$(echo $line | cut -c 6-11) # CRN
			data[2]=$(echo $line | cut -c 13-15) # Course Number
			data[3]=$(echo $line | cut -c 17-18) # Course Section
			data[4]=$(echo $line | cut -c 24-53) # Course Title
			data[5]=$(echo $line | cut -c 55-60) # Credit Hours
			data[6]=$(echo $line | cut -c 62-65) # Maximum Enrollment
			data[7]=$(echo $line | cut -c 67-70) # Currently Enrolled
			data[8]=$(echo $line | cut -c 72-79) # Seats Available
			data[9]=$(echo $line | cut -c 81-84) # Num Wait Listed
			data[10]=$(echo $line | cut -c 86-92) # Days Taught
			data[11]=$(echo $line | cut -c 94-100) # Start Time
			data[12]=$(echo $line | cut -c 102-108) # End Time
			data[13]=$(echo $line | cut -c 110-113) # Building
			data[14]=$(echo $line | cut -c 116-125) # Room
			data[15]=$(echo $line | cut -c 127-146) # Instructor
			
			#echo ${data[*]}
			
			string="{"
			
			for step in {0..15}
			do
				string=${string}'"'${COURSE_ITEMS[step]}'":"'${data[step]}'"'
				if [ $step -ne 15 ]
				then
					string=${string}','
				fi
			done
			
			string=${string}"}"
			
			if [ $FLAG_LINE -ne 0 ]
			then
				string=','${string}
			else
				FLAG_LINE=1
			fi
			
			echo ${string} >> tmpDB
			
			#echo "$(paste -d "," [a-p])" >> tmpDB
			#echo '{"'${a}'","'${b}'","'${c}'","'${d}'","'${e}'","'${f}'","'${g}'","'${h}'","'${i}'","'${j}'","'${k}'","'${l}'","'${m}'","'${n}'","'${o}'","'${p}'"}';
			#$(rm [a-p])
			#`rm $f`
		done <$f
		
	done
	
	echo "]" >> tmpDB
	
	echo "]" >> tmpDB
	
	`egrep -v "HOSP|COMM|A&M|PINP" tmpDB > tmp`
	#tr -d ' \t\r\f' <tmp >../../Database
	`cat tmp >> ../../Database`
	cd -
}

#
# reformat() function
#
# Reformats the time from 12 hour to 24 hour.
# Removes the : and AM/PM and turns time into integer value
#
reformat(){
	for i in {01..07};
	do
	`sed -i "s/$i:\(..\)PM/$(($i+12))\1/g" Database`
	done
	
	for i in 8 9;
	do
	`sed -i "s/0$i:\(..\)PM/$(($i+12))\1/g" Database`
	done
	
	for i in 10 11;
	do
	`sed -i "s/$i:\(..\)PM/$(($i+12))\1/g" Database`
	done

 	`sed -i 's/\(..\):\(..\)AM/\1\2/g' Database; sed -i 's/\(..\):\(..\)PM/\1\2/g' Database`
}


#
# Begin Main Program
#
mkdir $TMPDIR
cd $TMPDIR
grab
clean
build
cd ..
rm -r $TMPDIR
exit
reformat
if [ ! -f Campus.db ]
then
	touch Campus.db
	`sqlite3 Campus.db "CREATE TABLE classes (crn INTEGER, course TEXT, sec TEXT, title TEXT, credit float, max integer, enrolled integer, avail integer, wait integer, days TEXT, start INT, end INT, building TEXT, room TEXT, instructor TEXT);"`
	`echo -e '.separator "@"\n.import Database classes' | sqlite3 Campus.db`
fi










