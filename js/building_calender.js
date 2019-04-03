function fillInCalender() {
	updateCalenderDates();

	var monthToFillIn = {};
	var previousMonthIndex;

	month_data.forEach(function(month, i) {
		if (month.year == data.calender.year && month.month_index == data.calender.month) {
			monthToFillIn = month;
			previousMonthIndex = i - 1;
			return;
		}
	});

	let days = document.getElementsByTagName("td");
	let currentMonthCount = 1;
	let previousMonthCount = month_data[previousMonthIndex].amount_of_days - monthToFillIn.starting_day + 1;
	let nextMonthCount = 1;

	cleanCells(days);

	for (let i = 0; i < days.length; i++) {

		//Filling current Month
		if (monthToFillIn.starting_day <= i && currentMonthCount <= monthToFillIn.amount_of_days) {
			fillPartialMonthData(days[i], currentMonthCount, monthToFillIn, "current");

			currentMonthCount++;

		//Filling previous Month
		} else if(currentMonthCount <= monthToFillIn.amount_of_days) {
			fillPartialMonthData(days[i], previousMonthCount, month_data[previousMonthIndex], "previous");

			previousMonthCount++;
			
		//Filling next month
		} else {
			fillPartialMonthData(days[i], nextMonthCount, month_data[monthToFillIn.month_index + 1], "next");

			nextMonthCount++;
		}
	}
	changeColor();
}



function fillPartialMonthData(day, count, monthObject, month) {
	day.innerHTML = count;

	if (month == "current") {
		if (count == data.current_date.date && CalenderisCurrentMonth()) {
				day.setAttribute("id", "current-day"); //setting grey as current day
			}
	} else {
		day.classList.add("color");
		if (month == "previous" && count == monthObject.amount_of_days) {
			console.log("true");
			day.classList.add("prev-month-last-day");
		}
	}

	uid = getUID(monthObject.month_index, monthObject.year, count);
	day.setAttribute("data-uid", uid);
	appendSpriteToCellAndTooltip(uid, day);
}


function getUID(month, year, day) {
	if (month == 12) {
		month = 0;
		year ++;
	}

	return month.toString() + year.toString() + day.toString();
}

function appendSpriteToCellAndTooltip(uid, elem) {
	for(let i = 0; i < post_its.length; i++) {
		if (uid == post_its[i].id) {
			elem.innerHTML += `<img src='images/note${post_its[i].note_num}.png' alt='post-it note'>`;
			elem.classList.add("tooltip");
			elem.innerHTML += `<span>${post_its[i].note}</span>`;
		}
	}

}


function cleanCells(cells) {
	removeCurrentDay();

	for (let i = 0; i < cells.length; i++) {

		if (cells[i].classList.contains("color")) {
			cells[i].classList.remove("color");
		}

		if (cells[i].classList.contains("tooltip")) {
			cells[i].classList.remove("tooltip");
		}

		if(cells[i].classList.contains("prev-month-last-day")) {
			cells[i].classList.remove("prev-month-last-day");
		}
		if(cells[i].hasAttribute("style")) {
			cells[i].removeAttribute("style");
		}

	}
}

function removeCurrentDay() {
	if (document.getElementById("current-day")) {
		document.getElementById("current-day").removeAttribute("id");
	}
}

function CalenderisCurrentMonth() {
	if (data.current_date.year == data.calender.year && data.current_date.month == data.calender.month) {
		return true;
	} else {
		return false;
	}
}

function nextMonth() {

		if (data.calender.month !== 11 || data.calender.year == 2018) {
			data.calender.month++;
		}
		if (data.calender.month >= 12) {
			data.calender.month = 0;
			data.calender.year++;
		}
		fillInCalender();

}

function previousMonth() {
	
	if (data.calender.month !== 11 || data.calender.year == 2019) {
			data.calender.month--;
		}
		if (data.calender.month <= -1) {
			data.calender.month = 11;
			data.calender.year--;
		}
		fillInCalender();
}

//on arrow buttons on keyboard can change calendar month
document.onkeydown = function(e) {
	switch(e.keyCode) {
		case 37: previousMonth();
		break;
		case 39: nextMonth();
		break;
	}
}