//UAH page modifier

console.log("page matches, running uah_page.js");

//var data = $.parseJSON(courses);

//console.log("course: " + courses.length);

var colleges_num = new Array(courses.length);

for (var c = 0; c < colleges_num.length; c++)
{
	colleges_num[c] = courses[c].length;
}

//console.log("number of colleges in database: " + colleges_num.length);

//console.log(colleges_num);

var matched_elems = $('*:contains(data.ACC)');

for (var i = 0; i < courses.length; i++)
{
	
	for (var c = 1; c < courses[i].length; c++)
	{
		//
	}
	
	//console.log(i + ": " + courses[i][0] + " - " + courses[i].length);
}

var page_text = $('body').text();

//console.log("Page: " + page_text);

var myregex = /\b\w{2,3} \d{3}\b/gm;
var str = "BLAH";
//var mydata = page_text.replace(myregex, "BLAH");


do {
var mydata = myregex.exec(page_text);

if (mydata == null)
{
	break;
}

console.log("searching for: " + mydata);

var college_regex = /\w{2,3}/;
var college_regex_result = college_regex.exec(mydata);

for (var c = 0; c < courses.length; c++)
{
	if (courses[c][0] == college_regex_result)
	{
		for (var i = 1; i < courses[c].length; i++)
		{
			if ((courses[c][0] + " " + courses[c][i].course_num) == mydata)
			{
				console.log("Found a match: " + (courses[c][0] + " " + courses[c][i].course_num + " " + courses[c][i].course_sec));
				var page = $('body');
				page.html(page.html().replace(mydata, '<strong><div style="background: #AAFFAA; display: inline;">' + mydata + "</div></strong>"));
			}
		}
	}	
}

//console.log(mydata);
//console.log(mydata.length);
}while (mydata != null);

console.log("Done searching");

//$('body').text(mydata);



