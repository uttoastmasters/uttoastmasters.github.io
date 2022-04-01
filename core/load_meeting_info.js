/*
New features:

- go to any date
- What we did last year (last year ) throwback2020 throwback2019
- canceled big font

https://stackoverflow.com/questions/1643320/get-month-name-from-date
const date = new Date(2009, 10, 10);  // 2009-11-10
const month = date.toLocaleString('default', { month: 'short' });
console.log(month);
*/
var meetingColToday;
var rolesWanted = [];
console.warn('load_meeting_info.js loaded!')
// https://html-online.com/articles/get-url-parameters-javascript/
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}
const getFirstWord = string => {
    const words = string.trim().split(' ');
    return words[0].split(':')[0];
    // .toUpperCase();
    // return words[0].toUpperCase();
};
const getPoints = string => {
    return string.trim().split(':')[1];
    // .toUpperCase();
    // return words[0].toUpperCase();
};
function getTop(dict, num=5) {
  // https://stackoverflow.com/questions/25500316/sort-a-dictionary-by-value-in-javascript
  // Create items array
  var items = Object.keys(dict).map(function(key) {
    return [key, dict[key]];
  });

  // Sort the array based on the second element
  items.sort(function(first, second) {
    return second[1] - first[1];
  });

  // Create a new array with only the first 5 items
  // console.log(items.slice(0, 5));
  return items.slice(0, num);
}
// last meeting and this meeting, find out up and down information



var INFO = {
"#whatIsDate": "Date",
"#meetingNo": "Meeting #",
"#whichRoom": "Room",
"#whatTheme": "Theme",
"#whatWordOfTheDay": "Grammarian's Word of the Day",
"#whatSpeech1": "#1 Manual, Project, Speech Title and Duration",
"#whatSpeech2": "#2 Manual, Project, Speech Title and Duration",
"#whatSpeech3": "#3 Manual, Project, Speech Title and Duration",
// "#announcement": "annoucement",
}
var ROLES = {
".whoIsPresidingOfficer": "Presiding Officer", //
".whoIsToastmaster": "Toastmaster",
".whoIsAhCounter": "Ah Counter.     (2 mins)",
".whoIsGrammarian": "Grammarian     (2 mins)",
".whoIsTimeKeeper": "Time Keeper",
".whoIsVoteCounter": "Vote Counter",
"#whoIsGeneralEvaluator": "General Evaluator",
// "#whoIsTableTopicsEvaluator": "TableTopics Evaluator (2-3 mins)",
"#whoIsTableTopicsEvaluator": "TableTopics Evaluator (3-4 mins)",
".whoIsSpeaker1": "Speaker # 1",
".whoIsEvaluator1": "Evaluator # 1 (2-3 mins)",
".whoIsEvaluator2": "Evaluator # 2 (2-3 mins)",
".whoIsSpeaker2": "Speaker # 2",
".whoIsSpeaker3": "Speaker # 3",
".whoIsEvaluator3": "Evaluator # 3 (2-3 mins)",
"#whoIsTopicsMaster": "Topics Master",
// "#whoIsTechMaster": "Tech-Master",
};
var SCORES = {
"Participants": 1, // don't include those who has roles
"Social Participants": 1,
"Early TM sign-up": 1,
"Speaker # 1": 2+1,
"Speaker # 2": 2+1,
"Speaker # 3": 2+1,
"Evaluator # 1 (2-3 mins)": 1+1,
"Evaluator # 2 (2-3 mins)": 1+1,
"Evaluator # 3 (2-3 mins)": 1+1,
"TableTopics Evaluator (3-4 mins)": 2+1,
"General Evaluator": 1+1,
"Topics Master": 1+1,
"Toastmaster": 1+1,
"Best Speaker": 3,
"Best Table Topics": 2,
"Best Evaluator": 2,
"Traveling Award": 2,
"Member Sign-up": 4,
"Time Keeper": 1,
"Vote Counter": 1,
"In-person Participants": 1,
"Virtual Participants": 0.3,
"Grammarian     (2 mins)": 1,
"Ah Counter.     (2 mins)": 1,
};
// removed table topic speakers. no need to track

class SheetV4 {
  constructor(spreadsheetId, sheetname=null) {
    var json;
    this.sheename = sheetname
    console.log('---' + this.constructor.name);
    var url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:json`;
    if (sheetname != null) {
      url += '&sheet=' + sheetname

    }
    fetch(url)
        .then(res => res.text())
        .then(text => {
            this.table = JSON.parse(text.substr(47).slice(0, -2)).table
            document.dispatchEvent(new Event('loaded_'+this.constructor.name));
    })
    console.log('done')
  }
  getColumn(col) { // return a dict: key: row title, value: column value
    // if row title is duplicated, values will be joined with ','
    console.log('getColumn ---- ')
    var col = parseInt(col)
    var d_roles = {};
    this.table.rows.forEach( row => {
      let cell = row.c[0];
      if (cell != null) {
        var key = cell.v.trim(); // important
        var val = (row.c[col]!= null)? row.c[col].v: null;
        if (val != null) {val = val.trim();}
        if (key in d_roles) {
          d_roles[key] +=  ',' + val;
        } else {
          d_roles[key] =   val;
          console.log(key + ':' + val);
        }
      } else {
        console.log('cell is null');
      }
    })
    console.log(d_roles)
    return d_roles
  }
  getData(d, key) {
    return (key in d) ? d[key] : null;
  }
}

class ToastiesSheet extends SheetV4{
  loadJson(json) {
    // https://docs.google.com/spreadsheets/d/e/2PACX-1vQ3Viig2-DlkSkufg6xBK6IdVRFJR2pwkUmq0NzyfOIAi3cCdCkGuf8ZARUa3HoF2Il17WKvOA7pomh/pubhtml
    // console.log('---' + this.constructor.name);
    console.log(json);
    this.data = json;
    console.log(this.data);
    console.log('---' + this.constructor.name);
    this.members = this.listMembers();
    // let active_members = Object.keys(this.members).filter(key => this.members[key] >= 10);
    // let n_members = Object.keys(this.members).length
    // let n_active_members = Object.keys(active_members).length
    // console.log(n_members + ' members: ' + this.members);
    // console.log(n_active_members + ' active members: ' + active_members);
    //
  }
  // list members
  // find the cell and then get all following rows with col=0 and col1
  listMembers() {
    // member and toastie scores...
    // nick name --> full name and scores dictonary
    var members = {};
    this.table.rows.forEach(row => {
      if (row['c'] != null) {
        if(row['c'][1]!=null) {
          members[getFirstWord(row['c'][1]['v'])] = {
            'full_name': ((row['c'][0]!=null)? row['c'][0]['v'].split(',')[0] : row['c'][1].v),
            'point': Number(row['c'][2]['v']),
            'email': ((row['c'][3]!=null)? row['c'][3]['v'] : '')
          }
        }
        if(row['c'][0]!=null) {
          // also allow using the first name only
          members[getFirstWord(row['c'][0]['v'])] = {
            'full_name': row['c'][0]['v'].split(',')[0],
            'point': Number(row['c'][2]['v']),
            'email': ((row['c'][3]!=null)? row['c'][3]['v'] : '')
          }
        }
      }
    })
    return members;
  }
}

// https://bobbyhadz.com/blog/javascript-get-date-of-next-friday
function getNextFriday(date = new Date()) {
  const dateCopy = new Date(date.getTime());

  const nextFriday = new Date(
    dateCopy.setDate(
      dateCopy.getDate() + ((7 - dateCopy.getDay() + 5) % 7 || 7),
    ),
  );

  return nextFriday;
}

class SignupSheet extends SheetV4{
  loadJson(json) {
    // var url="https://docs.google.com/spreadsheet/pub?key=p_aHW5nOrj0VO2ZHTRRtqTQ&single=true&gid=0&range=A1&output=csv";
    // var url="https://spreadsheets.google.com/feeds/cells/17Vtxbeh7Q6-ic89sWC8_U8RUoUAr6dlvi3jxADRMNQU/2/public/full?alt=json";
    console.log(json);
    this.data = json;
    this.entry = json.feed.entry;
  }
  // 3
  static getMeetingSheetName(cur_date) {
    // find the upcoming friday
    let date = getNextFriday(cur_date)
    let m = date.getMonth();
    let y = date.getFullYear().toString().slice(2); // "09"
    if (m%2 != 0) {
      var makeDate = date.addMonths(1);
      // var makeDate = date;
      // new Date(makeDate.setMonth(makeDate.getMonth() + 1));
      let m2 = makeDate.getMonth();
      let y2 = makeDate.getFullYear().toString().slice(2);
      return monthNames[m] + "'" + y +  "-" + monthNames[(m+1)%12] + "'" + y2;
    }
    else {
      // this will mess up today object...
      // var makeDate = date;
      // makeDate = new Date(makeDate.setMonth(makeDate.getMonth() - 1));
      var makeDate = date.addMonths(-1);
      let m2 = makeDate.getMonth();
      let y2 = makeDate.getFullYear().toString().slice(2);
      return monthNames[(m-1)%12] + "'" + y2 +  "-" + monthNames[m] + "'" + y;
    }
  }
  getDateOfColumn(column_data) {
    let cell = column_data['Date'];
    let res = (typeof cell === 'string' || cell instanceof String)?  new Date(cell.trim()) : (new Date(eval(cell)).getDateWithoutTime().addDays(-1));
    console.warn(res)
    console.warn(cell)
    return res
  }
  getMeetingCol(date_now) {
    // data is always the first row
    // theme is the third row
    var date_row = this.table.rows[0].c;
    var theme_row = this.table.rows[3].c;
    // date_now = date.getDateWithoutTime().addDays(1); // so weird
    this.date = today;
    var index, cell;
    var meeting_col = 1; //index;

    for ([index, cell] of date_row.entries()) {
      if(index==0){continue}
      if(cell==null){continue}
      if(cell.v==null){continue}
      let date = ('f' in cell)? (new Date(eval(cell.v)).getDateWithoutTime().addDays(-1)) : new Date(cell.v.trim());
      console.log(`compare ${date.yyyymmdd()} and ${date_now.yyyymmdd()}`)
      // console.log(cell)
      // console.log(date)
      if( date_now.getFullYear() === date.getFullYear() ) {
        if (date_now.getMonth() === date.getMonth() && date_now.getDate() <= date.getDate()) {
          console.log('getMeetingCol:break1')
          console.log(date_now)
          console.log(date)
          break;
        } // next month
        else if (date_now.getMonth() < date.getMonth() ) {
          console.log('getMeetingCol:break2')
          break;
        }
      }  // next year
      else if( date_now.getFullYear() < date.getFullYear()) {
        console.log('getMeetingCol:break3')
        break;
      }
      meeting_col +=1;
    }
    console.warn(`meeting_col: ${meeting_col}`)
    if(theme_row[meeting_col-1]!=null) {$("#themeLast").html(theme_row[meeting_col-1].v);}
    if(theme_row[meeting_col]!=null) {$("#themeThis").html(theme_row[meeting_col].v);}
    if(theme_row[meeting_col+1]!=null) {$("#themeNext").html(theme_row[meeting_col+1].v);}
    return meeting_col;
  }
  showAgendaByColumn(col) {
    // assert col is in the valid range
    // can do without reload sheet
    // will also need to locate the sheetname again (if for older meetings)
    this.meetingCol = col;
    // console.log(`today: ${date}`)
    this.roles = this.getColumn(this.meetingCol);
    var theme_string = this.roles['Theme'];
    if (theme_string  != null) {
      $("#theme").html(theme_string.split(':')[0]);
      $("#desc").html(theme_string.split(':')[1]);
    }
    // $("#desc").html(this.roles['Description']);
    $("#when_where").html('5:55 PM ~ 7:15 PM, ' + this.roles['Date'] + ', ' + this.roles['Room']);
    this.fillInForm();
    // -----------------------------
    //  Count Down JS
    // -----------------------------
    // only count down future events
    let target = this.getDateOfColumn(this.roles).getDateWithoutTime();
    if( $('.timer').length )  { // exist
      $('.timer').html(""); //empty existing first
      // haven't reach target date
      if (new Date() < target) {
        $('.timer').syotimer({
            year: target.getFullYear(),
            month: target.getMonth()+1,
            day: target.getDate(),
            hour: 18,
            minute: 0
        });
      }
    }

  }
  showAgendaByDate(date) {
    if (0) { // always reload
      // (this.sheename != null) && (this.sheename == SignupSheet.getMeetingSheetName(date))
      // can do without reload sheet
      this.showAgendaByColumn(this.getMeetingCol(date));
    } else {
      // has to load from another sheet
      let url = window.location.origin + '/agenda.html?date='+date.yyyymmdd();
      location.replace(url)
    }
  }
  nextMeeting() {
    // not working properly
    // location.href = window.location.origin + '/index.html?date='+this.date.addDays(8).yyyymmdd();
    // console.log(location.href)
    if (1) { // not in the current sheet meetingColToday < 9
      this.showAgendaByDate(this.date.addDays(8));
    }  else {
      meetingColToday += 1;
      this.showAgendaByColumn(meetingColToday);
    }
    // let url = window.location.origin + '/index.html?date='+this.date.addDays(8).yyyymmdd();
    // location.replace(url)
    // return false
  }
  thisMeeting() {
    // this.showAgendaByColumn(meetingColToday);
    this.showAgendaByDate(new Date());
  }
  throwback2020() {
    let url = window.location.origin + '/agenda.html?date='+this.date.addYears(-1).yyyymmdd();
    location.replace(url)
    // console.log(location.href)
    return false
  }
  prevMeeting() {
    if (1) { // meetingColToday > 1// not in the current sheet
      this.showAgendaByDate(this.date.addDays(-6));
    } else {
      meetingColToday -= 1;
      this.showAgendaByColumn(meetingColToday);
    }
    // let url = window.location.origin + '/index.html?date='+this.date.addDays(-7).yyyymmdd();
    // // console.log(location.href)
    // location.replace(url)
    // return false
  }
  // get leader board
  getToastyPoints(member) {
    var short_names = Object.keys(this.members);
    var points = {...this.members};
    var meeting_points = {...this.members};

    for(let name in points) {
      points[name] = 0; // init as zero
    }
      // for(var item in SCORES) {
      //   var point = SCORES[item];
      //   // Participants
      //   // signupSheet.whois('Participants').trim().split(',');
      //   var s = this.whois(item).trim();
      //   if (s == 'TBA') {
      //     continue;
      //   }
      //   s.split(',').forEach(function (name, index, array){
      //     name = getFirstWord(name);
      //     let r = short_names.indexOf(name);
      //     if (r == -1) {
      //       return '[' + item + ']:' + name + ' is not a member.(Check spelling?) ';
      //     }
      //     points[name] += point;
      //     console.log(`add ${point} to ${name} for ${item}`)
      //   });
      // }
    for (let col=1; col<=this.meetingCol; col++) {
      for(let name in meeting_points) {
        meeting_points[name] = 0; // init as zero
      }
      let column_data = this.getColumn(col);

      let li_items = '';
      // the first week    31, 1, 2, 3, 4, 5, 6, 7, 8
      // column_data['Date']
     if (this.getDateOfColumn(column_data).getDate() <= 7) {
     // console.warn(column_data['Date'])
     // if (column_data['Date'].getDate() <= 7) {
       // reset all members
       if (member != undefined) {
         if (points[member] >0) {
           li_items += `<li class="list-group-item d-flex justify-content-between align-items-center">
           <span class="badge badge-primary badge-pill">-${points[member]}</span>
             Monthly Reset
           </li>`;
         }
       }
       for(let name in points) {
         if( (member == undefined) & (points[name] != 0) ) {
           li_items += `<li class="list-group-item d-flex justify-content-between align-items-center">
           <span class="badge badge-primary badge-pill">-${points[name]}</span>
             ${name} (Reset)
           </li>`;
         }
         points[name] = 0; // reset
       }
     }
      // SCORES
      for (let [key, value] of Object.entries(column_data)) {
        // console.warn(`${key}: ${value}`);
        if (key in SCORES) {
          if(value != null) {
            for(let item of value.split(",")) {
              let reward_member = getFirstWord(item.trim());
              console.warn(`${reward_member}`);
              // console.warn(`${reward_member}: +${pts}`);
              if (reward_member in this.members) {
                let pts = getPoints(item);
                pts = (pts==undefined)? SCORES[key] : parseInt(pts);
                meeting_points[reward_member] += pts;
                console.warn(`${reward_member}: +${pts}`);
                if(member == reward_member ){
                  // Ad in Adi
                  li_items += `<li class="list-group-item d-flex justify-content-between align-items-center">
                  <span class="badge badge-primary badge-pill">+${pts}</span>
                    ${key.split('(')[0]}
                  </li>`;
                }
              }
            }
          }
        }
      }
      // each meeting summary
      for(let name in points) {
        points[name] += meeting_points[name]; // init as zero
        if( (member == undefined) & (meeting_points[name] != 0) ) {
          li_items += `<li class="list-group-item d-flex justify-content-between align-items-center">
          <span class="badge badge-primary badge-pill">+${meeting_points[name]}</span>
            ${name}
          </li>`;
        }
      }
      $("#boxtimeline").append(`
      <div class="timeline-item" >
        <div class="timeline-img"></div>
        <div class="timeline-content js--fadeInLeft" style="background-color:${  ( (member == undefined) | (meeting_points[member] > 0) )? 'transparent':'#b9b9b9'}">
          <h2 align=center>${column_data['Theme']}</h2>
          <div class="date">${column_data['Date']}</div>
          <ul class="list-group">
            ${li_items}
          </ul>
        </div>
      </div>`);
    }
    if (member != undefined) {
      $("#member_score").html(`${points[member]} Points Earned~`);
    }
    console.log(points)
    return points
    // return Object.values(points).join('\n');
  }
  cellIndex(role, strict=true) {
    let entry = this.entry;
    let meeting_col = this.meetingCol;
    role = role.trim();
    let i = this.whereis(role, strict); // index
    let row = entry[i].gs$cell.row;
    for (let j = 1; entry[i+j].gs$cell.row == row; j++) {
      if(entry[i+j].gs$cell.col == meeting_col) {
        return i+j;
      }
    }
    return -1
  }
  // locate the cell
  whereis(text, strict=true) {
    var result = this.getData(this.roles, text);
    // console.log(text)
    // console.log(result)
    return (result == null)? 'TBA' : result;
  }
  whois(role, strict=true) {
    var result = this.getData(this.roles, role);
    // if(result != null) {result = getFirstWord(result);}
    // else {
    if(role=='Presiding Officer') {
      result = (this.date.getFullYear()==2020)? 'Arushi':result;
    }
    //get full name if possible
    // dangerous: result = this.members[result]['full_name']
    return (result == null)? '' : result; // note it return empty string
  }
  who_is_in(role) {
    let s = whois(role);
    let result = [];
    for ( let item of s.split(",") ){
      let short_name = getFirstWord(item.trim());
      result.push(short_name);
    }
    return result;
  }
  get unavailableMembers() {
    console.log('getting unavailable members..')
    let entry = this.entry;
    let data = this.data;
    let meeting_col = this.meetingCol;
    let i = this.whereis('Unavailable');
    let row = entry[i].gs$cell.row;
    // TODO: compute how many columns might be more efficient
    let members = [];
    for (let j = 1; entry[i+j]; j++) {
      if(entry[i+j].gs$cell.col == meeting_col) {
        let name = entry[i+j].content.$t;
        if(name == ''){
          break;
        }
        members.push(getFirstWord(name));
      }
    }
    console.log('unavailable members: ' + members)
    return members;
  }
  get availableActiveMembers() {
    return $.grep(active_members, function(el){
      return $.inArray(el, unavailable_members) == -1 &&  ($.inArray(el, assigned_members) == -1)
    });
  }
  fillInRole(role, element) {
      let who = this.whois(role);
      console.log(element + ':' + who);
      var defaultResult = '<nobr style="color: white; background-color: orange">&nbsp;TBA&nbsp;<nobr>';
      $(element).html(defaultResult);

      if(who =='') {
        if (role.includes('Evaluator #') && (rolesWanted.includes('Speaker # '+role[role.indexOf('#')+2])) ) {
          // speaker exists but evalutor doesn't
         // first check spearker, then check evaluator
         console.warn('Evaluator is not needed since no speech to evaluate: ' + role)
        } else {
          console.warn('roleWanted: ' + role)
          rolesWanted.push(role);
        }

        if (role.includes('Speaker')) {
          console.warn('hide: ' + role)
          $('.speech'+role[role.length-1]).hide();
        }

        return;
      }
      // $(element).html(who);
      let result = '';
      for ( let item of who.split(",") ){
        let short_name = getFirstWord(item.trim());
        if (short_name in this.members) {
          let fullname = this.members[short_name]['full_name'];
          // result += `
          //   <a href="/timeline.html?member=${short_name}">
          //     ${fullname}
          //   </a> `;
          result += `${fullname}`;
          this.assignedMembers.push(short_name)
        } else {
          result += short_name;
        }
      }
      // $(element).html( (result=='')?`<a href="https://docs.google.com/spreadsheets/d/17Vtxbeh7Q6-ic89sWC8_U8RUoUAr6dlvi3jxADRMNQU/"
      // class="btn btn-main-sm" style='padding:2px'>Signup role</a>`:result);
      // var default = `<form action="https://docs.google.com/spreadsheets/d/17Vtxbeh7Q6-ic89sWC8_U8RUoUAr6dlvi3jxADRMNQU/"
      // ><input type="submit" value="Signup role" /></form>`

      $(element).html( (result=='')?defaultResult:result);

  }
  fillInInfo(role, element) {
      let s = this.whereis(role);
      let who = s.includes('Date(')? (new Date(eval(s))).getDateWithoutTime().addDays(-1).yyyymmdd() : s;
      console.log(element + ':' + who);
      if(who!='TBA') {$(element).html(who)};
  }
  fillInSuggestion(element) {
    console.log('To be assigned: ' + available_active_members);
      if ($(element).text() == 'TBA') {
        let who = available_active_members.shift()
        $(element).html(who+'?');
      }
  }
  fillInForm() {
    Object.entries(INFO).forEach(e => this.fillInInfo(e[1], e[0]))
    if(this.whereis('Theme').trim().toUpperCase()=='CANCELED') {
      $("#maintable").hide();
    }
    this.assignedMembers = [];
    Object.entries(ROLES).forEach(e => this.fillInRole(e[1], e[0]))
    $('#rolesWanted').html(rolesWanted.join());
    console.log('Assigned: ' + this.assignedMembers);
    // add those who already assigned

    // disable speech role suggestion, don't show it if there are no speaker


    //////// disable fillInSuggestion for now (add a switch to control showing it)
    // for(var element in roles) {
    //   var role = roles[element];
    //   fillInSuggestion(element);
    // }
  }
  // outdated
  computeMeetingScores(members) {
    var short_names = Object.keys(members);
    var meeting_points = {...members};
    for(let name in meeting_points) {
      meeting_points[name] = 0; // init as zero
    }
    for(var item in SCORES) {
      var point = SCORES[item];
      // Participants
      // signupSheet.whois('Participants').trim().split(',');
      var s = this.whois(item).trim();
      if (s == 'TBA') {
        continue;
      }
      s.split(',').forEach(function (name, index, array){
        name = getFirstWord(name);
        let r = short_names.indexOf(name);
        if (r == -1) {
          return '[' + item + ']:' + name + ' is not a member.(Check spelling?) ';
        }
        meeting_points[name] += point;
        console.log(`add ${point} to ${name} for ${item}`)
      });
    }
    return Object.values(meeting_points).join('\n');
  }
}
