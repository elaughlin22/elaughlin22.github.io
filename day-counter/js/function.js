$(document).ready(function(){
	clock();
});

// -------------- timeline and date ------------ //

var url = "https://spreadsheets.google.com/feeds/list/1BDFXHOQffqffczKyNjF1mhojIDzDvTHy-5-6KRpNb8I/od6/public/values?alt=json"
$.getJSON( url, function( json ) {
	console.log("done (: ");
  schedule = json;
 })
	.done(function(){
		timeline();
	});

function timeline(){
	var x = getDay(x);
	for(y = 0; y < days[x].periods.length; y++){
		var length = (days[x].periods[y].length / 4.2) * (9 / 10) + "%";
		$("#periods-tr").append("<td style='width:" + length + "'><img src='img/" + days[x].periods[y].period + ".png' class='timeline-num'></td>");
        $("#periods-tr2").append("<td style='width:" + length + "'><div class='timeline-time'>" + days[x].periods[y].start + "</div></tr>");
	}
	$("#periods").append("<div id='end'><img src='img/end.png' class='timeline-end'><div class='timeline-endtime'>3:15</div></div>");
}

function getDay(i){
	var today = new Date();
	var month = today.getMonth() + 1;
	var date = today.getDate();
	var day = today.getDay();
	var year = today.getFullYear();
	var fullDate = month + "/" + date + "/" + year;
	for(v = 0; v < schedule.feed.entry.length; v++){
		if(fullDate === schedule.feed.entry[v]['gsx$date']['$t']){
			i = schedule.feed.entry[v]['gsx$day']['$t'];
			$("#day").html("Day " + i);
		}
	}
	$("#date").html(weekday[day] + ", " + monthNames[month -1] + " " + date);
	return 5;
}

// --------- clock stuff ------------- //

function clock(){
	var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    h = checkHour(h);
    m = checkMinute(m);
    $("#hour").html(h);
    $("#minute").html(":" + m);
    var schoolTime = today.getHours() * 3600 + m * 60 + s;
    if(schoolTime >= 29700 && schoolTime <= 54900){
        var percent = ((schoolTime - 29700) / 252) * (9 / 10) + "%";
        $("#timeline-progress").css("width", percent);
    }
    var t = setTimeout(function(){clock()},500);
}

function checkMinute(i){
    if(i<10){
    	i = "0" + i
    }
    return i;
}

function checkHour(i){
	if(i > 12){
		i = i - 12;
		$("#ampm").html("PM");
	}else{
		$("#ampm").html("AM");
	}
	return i;
}

// --------------- dates arrays --------------- //

var monthNames = new Array();
monthNames[0] = "January";
monthNames[1] = "February";
monthNames[2] = "March";
monthNames[3] = "April";
monthNames[4] = "May";
monthNames[5] = "June";
monthNames[6] = "July";
monthNames[7] = "August";
monthNames[8] = "September";
monthNames[9] = "October";
monthNames[10] = "November";
monthNames[11] = "December";

var weekday = new Array();
weekday[0]=  "Sun";
weekday[1] = "Mon";
weekday[2] = "Tue";
weekday[3] = "Wed";
weekday[4] = "Thu";
weekday[5] = "Fri";
weekday[6] = "Sat";

// end