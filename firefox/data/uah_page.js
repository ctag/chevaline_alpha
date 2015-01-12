//UAH page modifier

console.log("page matches, running uah_page.js");

//var data = $.parseJSON(courses);
//console.log("course: " + courses.length);

var colleges_num = new Array(courses.length);

for (var c = 0; c < colleges_num.length; c++)
{
	colleges_num[c] = courses[c].length;
}

var page_text = $('body').text();

//console.log("Page: " + page_text);

var myregex = /\b\w{2,3} \d{3}\b/gm;
var str = "BLAH";
//var mydata = page_text.replace(myregex, "BLAH");

var college_regex = /\w{2,3}/;

var page = $('body');
var temp_html = page.html();

do {
var mydata = myregex.exec(page_text);

if (mydata == null)
{
	break;
}

var college_regex_result = college_regex.exec(mydata);

console.log("searching for: " + mydata);

for (var c = 0; c < courses.length; c++)
{
	console.log("College: " + courses[c][0]);
	if (courses[c][0] == college_regex_result)
	{
		console.log("\tCourses in collage: " + courses[c].length);
		for (var i = 1; i < courses[c].length; i++)
		{
			console.log("checking: " + (courses[c][0] + " " + courses[c][i].course_num));
			if ((courses[c][0] + " " + courses[c][i].course_num) == mydata)
			{
				console.log("Found a match: " + (courses[c][0] + " " + courses[c][i].course_num + " " + courses[c][i].course_sec));
				
				temp_html = temp_html.replace(mydata, '<strong><div style="background: #AAFFAA; display: inline;">' + mydata + "</div></strong>");
				break;
			}
		}
	}	
}

//console.log(mydata);
//console.log(mydata.length);
}while (mydata != null);

page.html(temp_html);

console.log("Done searching");

//$('body').text(mydata);



