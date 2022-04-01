	// var URL_SIGNUPSHEET = "https://spreadsheets.google.com/feeds/cells/17Vtxbeh7Q6-ic89sWC8_U8RUoUAr6dlvi3jxADRMNQU/2/public/full?alt=json";
	// var URL_TOASTIESSHEET = "https://spreadsheets.google.com/feeds/cells/1E9VdBM1YSS0ykQG-U8yAopu8a2c9_G9U66DG_pmBmw4/1/public/full?alt=json";
// old api is inconvenient because it skips empty cells and don't allow accessing via sheetname (sheet index is needed, so we put the sheet always the second sheets)
// getData(row, col) {
// 	let entry = this.entry;
// 	row = '' + row // to string
// 	col = '' + col
// 	for (let i = 0; i < entry.length; i++) {
// 		if(entry[i].gs$cell.row == row && entry[i].gs$cell.col == col) {
// 			return  entry[i].content.$t;
// 		}
// 	}
// }
var signupSheet;
var toastiesSheet;
var date = getUrlVars()["date"]
var today = new Date()
if (date != undefined) {
	var parts =  date.split('-');
	today = new Date(parts[0], parts[1] - 1, parts[2]);
	// today = new Date(date); gives wrong results // new Date('2021-12-01') --> Tue Nov 30 2021 18:00:00 GMT-0600 (Central Standard Time)
} // Please pay attention to the month (parts[1]); JavaScript counts months from 0:
// January - 0, February - 1, etc.


today = today.getDateWithoutTime()
console.warn(`today: ${today}`)

	$(document).ready(function() {
		var SIGNUPSHEET_ID = '17Vtxbeh7Q6-ic89sWC8_U8RUoUAr6dlvi3jxADRMNQU';
		var TOASTIESSHEET_ID = '1E9VdBM1YSS0ykQG-U8yAopu8a2c9_G9U66DG_pmBmw4';
		toastiesSheet = new ToastiesSheet(TOASTIESSHEET_ID, "2021");

		var sheetname = SignupSheet.getMeetingSheetName(today);
		console.warn(`Be sure to check sheetname (space): ${sheetname}`)
		signupSheet = new SignupSheet(SIGNUPSHEET_ID, encodeURIComponent(sheetname)); // "Aug+%2721-Sept+%2721"
	  // wait for all sheets are loaded
		// first prepare listener
		console.log("document is ready")
	  var members_loaded = new Promise(function(resolve) {
	      document.addEventListener("loaded_ToastiesSheet",resolve,false);
	  })
	  var roles_loaded = new Promise(function(resolve) {
	      document.addEventListener("loaded_SignupSheet", resolve, false);
	  })

	  Promise.all([members_loaded, roles_loaded]).then(function() {
	      // after getting meeting col
				// In the javascript world months begin with zero! kind of weird to me. Anyhow, 9 is NOT September, but rather 9 is October.
				toastiesSheet.members = toastiesSheet.listMembers();
				console.log(`today: ${today}`)
				signupSheet.meetingCol = signupSheet.getMeetingCol(today);
				meetingColToday = signupSheet.getMeetingCol(new Date());
				console.log(`today: ${today}`)
				signupSheet.members = toastiesSheet.members;
				signupSheet.roles = signupSheet.getColumn(signupSheet.meetingCol);
				console.log(toastiesSheet.members)
				console.log(signupSheet.meetingCol)

	    // get a fixed list of people and shuffle it
	    // seed = Number(signupSheet.whois('Meeting #'));
	    // console.log('seed:', seed);
	    // shuffle(active_members, seed);

	    // let unavailable_members = signupSheet.unavailableMembers;
	    // get assigned people
	    signupSheet.fillInForm();
	    // problem: if is empty, will go to next
	    // highlight roles that have not been assigned
	    // add presiding officer
			// let members = toastiesSheet.members;
			// show_growth(members);
			if (/\bprint=1\b/.test(window.location.search)) window.print();
	  });
	});
