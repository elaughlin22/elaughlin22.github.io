$(document).ready(function() {
	$("#log").append("<p>Waiting for user input...</p>");
});

var rows = [
    ["Subject", "Location", "Start Date", "Start Time", "End Date", "End Time", "All Day Event"]
];

var pastYear = 0;
var url = "https://spreadsheets.google.com/feeds/list/1Acf2-wXPwMJFOg6TUdGzJ5e_gqN6po_-EENVXahvBgY/od6/public/values?alt=json"
function beginGeneration() {
	$("#submit").attr("class", "button-unused");
	$("#submit").attr("onclick", "");
	$("#log").append("<p>Fetching schedule...</p>");
	$.getJSON(url, function(json) {
		schedule = json;
	})
	.done(function() {
		try {
			$("#log").append("<p>Done.</p>");
			$("#log").append("<p>Generating calendar...</p>");
			generateCalendar();
		} catch(err) {
			$("#log").append("<p>Failed to generate calendar. Please check your inputs for invalid characters.</p>");
		}
	})
	.fail(function() {
		$("#log").append("<p>Failed to fetch schedule. Please check your connection and try again.</p>");
	});
}

function generateCalendar() {
	pastYear = schedule.feed.entry[0]['gsx$date']['$t'].split("/")[2];
	for(v = 0; v < schedule.feed.entry.length; v++) {
		m = schedule.feed.entry[v]['gsx$date']['$t'];
		x = schedule.feed.entry[v]['gsx$day']['$t'];
		if(x >= 1 && x <= 8) {
			for(y = 0; y < days[x].periods.length; y++) {
				var startHour;
				var startMinute;
				startHour = parseInt(days[x].periods[y].start.split(":")[0]);
				startMinute = parseInt(days[x].periods[y].start.split(":")[1]);
				var endMinute = startMinute + parseInt(days[x].periods[y].length);
				if(endMinute == 120) {
					var endHour = startHour + 2;
					endMinute = "00";
				} else if(endMinute > 60) {
					var endHour = startHour + 1;
					endMinute = endMinute - 60;
				} else if(endMinute == 60) {
					var endHour = startHour + 1;
					endMinute = "00";
				} else if(endMinute < 60) {
					var endHour = startHour;
				}
				if(startHour < 12){
					startMinute = startMinute+" AM";
				} else if(startHour == 12){
					startMinute = startMinute+" PM";
				} else {
					startHour = parseInt(startHour)-12;
					startMinute = startMinute+" PM";
				}
				if(endHour < 12){
					endMinute = endMinute+" AM"
				} else if(endHour == 12){
					endMinute = endMinute+" PM";
				} else {
					endHour = parseInt(endHour)-12;
					endMinute = endMinute+" PM";
				}
				if(startMinute == "0 PM") {
					startMinute = "00 PM";
				} else if(startMinute == "0 AM") {
					startMinute = "00 AM";
				}
				if(startMinute == "5 PM") {
					startMinute = "05 PM";
				} else if(startMinute == "5 AM") {
					startMinute = "05 AM";
				}
				if(endMinute == "5 PM") {
					endMinute = "05 PM";
				} else if(endMinute == "5 AM") {
					endMinute = "05 AM";
				}
				if(days[x].periods[y].period == "lunch") {
					for(t = 0; t < days[x].periods.length; t++) {
						if(days[x].periods[t].lunchPeriod) {
							if(schedule.feed.entry[v]['gsx$date']['$t'].split("/")[2] > pastYear) {
								var adjustedPeriod = parseInt(days[x].periods[t].period)+8;
							} else {
								var adjustedPeriod = parseInt(days[x].periods[t].period);
							}
							var lunchValueA = $("#lunch"+adjustedPeriod+"a").prop("checked");
							var lunchValueB = $("#lunch"+adjustedPeriod+"b").prop("checked");
							if(lunchValueA) {
								var lunchValue = "a";
							} else if(lunchValueB) {
								var lunchValue = "b";
							} else {
								var lunchValue = "c";
							}
							if(!$("#lunchBlank").prop("checked") && lunchValue == days[x].periods[y].lunch) {
								rows.push(["Lunch", "N/A", m, startHour+":"+startMinute, m, endHour+":"+endMinute, "false"]);
							}
						}
					}
				} else {
					var skip = false;
					var prt;
					if(schedule.feed.entry[v]['gsx$date']['$t'].split("/")[2] > pastYear) {
						var adjustedPeriod = parseInt(days[x].periods[y].period)+8;
					} else {
						var adjustedPeriod = parseInt(days[x].periods[y].period);
					}
					var title = $("#"+adjustedPeriod).val();
					var loc = $("#loc"+adjustedPeriod).val();
					var prtValueA = $("#"+adjustedPeriod+"a").prop("checked");
					var lunchValueA = $("#lunch"+adjustedPeriod+"a").prop("checked");
					var lunchValueB = $("#lunch"+adjustedPeriod+"b").prop("checked");
					if(prtValueA) {
						var prtValue = "a";
					} else {
						var prtValue = "b";
					}
					if(lunchValueA) {
						var lunchValue = "a";
					} else if(lunchValueB) {
						var lunchValue = "b";
					} else {
						var lunchValue = "c";
					}
					if(loc == "") {
						loc = "N/A";
					}
					if(title == "") {
						skip = true;
					}
					if(title.includes("\"") || title.includes(",") || loc.includes("\"") || loc.includes(",")) {
						throw(err);
					}
					if(days[x].periods[y].prt != prtValue && days[x].periods[y].prt != undefined) {
						skip = true;
					}
					if(days[x].periods[y].lunch != lunchValue && days[x].periods[y].lunch != undefined) {
						skip = true;
					}
					if(!skip) {
						rows.push([title, loc, m, startHour+":"+startMinute, m, endHour+":"+endMinute, "false"]);
					}
				}
			}
		} else if(x == "-") {
		} else if(x == "CLSD") {
		} else if(x == "BRK") {
		} else if(x == "FIN") {
			rows.push(["Final Exams", "N/A", m, "", m, "", "true"]);
		} else {
			rows.push(["Altered Schedule", "N/A", m, "", m, "", "true"]);
		}
	}
	$("#log").append("<p>Done.</p><p>Exporting CSV...</p>");
	exportCsv();
}

function exportCsv() {
	let csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
	var encodedURI = encodeURI(csvContent);
	$("#download").attr("href", encodedURI);
	$("#download").attr("download", "calendar.csv");
	$("#download").attr("class", "button");
	$("#log").append("<p>Done.</p>");
	$("#submit").attr("class", "button");
	$("#submit").attr("onclick", "reset()");
}

function reset() {
	rows = [
		["Subject", "Location", "Start Date", "Start Time", "End Date", "End Time", "All Day Event"]
	];
	beginGeneration();
}