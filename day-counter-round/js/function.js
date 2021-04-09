var theta = [];
var main;
var mainHeight;
var day;

var url = "https://spreadsheets.google.com/feeds/list/1Acf2-wXPwMJFOg6TUdGzJ5e_gqN6po_-EENVXahvBgY/od6/public/values?alt=json"
$.getJSON( url, function( json ) {
	console.log("done (: ");
  schedule = json;
 })
	.done(function(){
		timeline();
	});

var setupCircle = function (n, rx, ry, id) {
	var circleArray = [];
    for (var i = 0; i < n; i++) {
        var circle = document.createElement('img');
        circle.className = "timeline-num";
		circle.id = "period-" + i;
        var startTime = days[day].periods[i].start.split(":");
        var startSeconds = (+startTime[0]) * 60 * 60 + (+startTime[1]) * 60;
		circle.setAttribute("data-starttime", startSeconds);
        circleArray.push(circle);
        circleArray[i].posx = Math.round(rx * (Math.cos(theta[i]))) * -1 + 'px';
        circleArray[i].posy = Math.round(ry * (Math.sin(theta[i]))) + 'px';
		circleArray[i].src = "img/" + days[day].periods[i].period + ".png";
        circleArray[i].style.position = "absolute";
        circleArray[i].style.top = ((mainHeight / 2) - parseInt(circleArray[i].posy)) + 'px';
        circleArray[i].style.left = ((mainHeight / 2) + parseInt(circleArray[i].posx)) + 'px';
        main.appendChild(circleArray[i]);
    }
};

var generateCircle = function (n, rx, ry, id) {
    var frags = 360 / n;
    for (var i = 0; i <= n; i++) {
		var length = days[day].periods[i].length * 3600;
		var angle = (360 / 56100) * length * Math.PI;
		theta.push(angle);
        //theta.push((frags / 180) * i * Math.PI);
		
    }
    setupCircle(n, rx, ry, id)
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
		}
	}
	return i;
}

function timeline() {
	day = getDay(day);
	main = document.getElementById("timeline");
	mainHeight = parseInt(window.getComputedStyle(main).height);
	generateCircle(days[day].periods.length, 100, 100, "timeline");
	setTimeout(function(){clock()},1000);
}

function clock() {
	var today = new Date();
	var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    m = checkMinute(m);
	var schoolTime = h * 3600 + m * 60 + s;
	//console.log(schoolTime);
    if(schoolTime >= 30600 && schoolTime <= 56100){
        //var percent = ((schoolTime - 30600) / 252) * (9 / 10) + "%";
        //$("#timeline-progress").css("width", percent);
		var periodCount = document.getElementsByClassName("timeline-num").length;
        //var periodCount = $("#timeline").length;
        if(periodCount >= 1){
            for(u = 0; u < (periodCount); u++){
                var startTime = $("#period-" + u).attr("data-starttime");
                if(schoolTime >= startTime){
                    if(!$("#period-" + u).attr("src").includes("-white")){
                        var newSrc = $("#period-" + u).attr("src").replace(".png","-white.png");
                        $("#period-" + u).attr("src",newSrc);
                    }
                }
            }
        }
    }
	setTimeout(function(){clock()},1000);
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
    if(i == 12){
        $("#ampm").html("PM");
    }
    if(i == 0){
        return 12;
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