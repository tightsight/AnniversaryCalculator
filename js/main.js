
var ONE_SECOND = 1000;
var ONE_MINUTE = ONE_SECOND * 60;
var ONE_HOUR = ONE_MINUTE * 60;
var ONE_DAY = ONE_HOUR * 24;
var ONE_WEEK = ONE_DAY * 7;

var ONE_THOUSAND = 1000;
var ONE_MILLION = 1000000;
var ONE_HUNDRED_MILLION = 100000000;
var ONE_BILLION = 1000000000;

var MAX_YEARS = 100;
var MAX_MILLION_MINUTES = 53;
var PI = 3.14159265359;
var SPEED_OF_LIGHT = 299792458; // m/s, C Seconds =~ 9.5 years.

function dateDifference(d1, d2){
   var difference = {
      years : 0,
      months : 0,
      days : 0,
      hours : 0,
      minutes : 0,
      seconds : 0,
   }

   var counter = new Date(d2.getTime());

   // Years
   while(true){
      counter.setFullYear(d2.getFullYear() + difference.years + 1)

      if(counter < d1) difference.years += 1;
      else {
         counter.setFullYear(d2.getFullYear() + difference.years)
         break;
      }
   }

   // Months
   while(true){
      counter.setMonth(d2.getMonth() + difference.months + 1)

      if(counter < d1) difference.months += 1;
      else {
         counter.setMonth(d2.getMonth() + difference.months)
         break;
      }
   }

   // Days
   while(true){

      console.log('D1: ' + d1)
      console.log('Counter: '+counter)

      counter.setDate(d2.getDate() + difference.days + 1)

      if(counter < d1) difference.days += 1;
      else {
         counter.setDate(d2.getDate() + difference.days)
         break;
      }
   }

   return difference;
}

// https://stackoverflow.com/questions/979975/how-to-get-the-value-from-the-get-parameters
function parse_query_string(query) {
  var vars = query.split("&");
  var query_string = {};
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    // If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = decodeURIComponent(pair[1]);
      // If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
      query_string[pair[0]] = arr;
      // If third or later entry with this name
    } else {
      query_string[pair[0]].push(decodeURIComponent(pair[1]));
    }
  }
  return query_string;
}

var app = new Vue({ 
  el: '#app',
  data : {
   app_name : "Wedding Anniversary Calculator",

   dateSelected : false,
   showLink : false,
   pageLink : '',
   showIndex : 2,

   anniversary : '',
   momentAnniversary : '',
   allAnniversaries : [],
   upcomingAnniversaries : [],

   // Date picker components
   picker : '',
   timer : '',

   // Not in use now
   weeksMarried : -1,
   daysMarried : -1,
   hoursMarried : -1,
   minutesMarried : -1,
   secondsMarried : -1,
   marriageTimer : {
      years : 0,
      months : 0,
      days : 0,
      hours : 0,
      minutes : 0,
      seconds : 0,
   },
  },
  methods : {
   datePicked : function(){
      this.dateSelected = true;
      this.showLink = true;
      // Format: 2017-12-02 " " 12:57am
      var dateSplit = this.picker.split('-');
      var year = dateSplit[0];
      var month = dateSplit[1];
      var day = dateSplit[2];

      var timerSplit = this.timer.split(':');

      var hour = timerSplit[0];
      var minute = timerSplit[1].substring(0, 2);
      var ampm = timerSplit[1].substring(2,4);

      if(ampm == "am"){
         if(hour == "12") hour = 0;
         else hour = parseInt(hour);
      }
      else {
         hour = parseInt(hour) + 12;
      }

      // Month is 0 based
      this.anniversary = new Date(year, month - 1, day, hour,minute,0);

      this.pageLink = this.buildLink(this.anniversary);

      this.momentAnniversary = moment(this.anniversary);

      // this.calculateTimes();
      this.populateAnniversaries(this.anniversary);

      // this.calculateMarriageTimer();
   },
   buildLink : function(aDate){
      var url = window.location.href + "?year="+aDate.getFullYear()+"&month="+aDate.getMonth()+"&day="+aDate.getDate()+"&hour="+aDate.getHours()+"&minute="+aDate.getMinutes();
      return url;
   },
   gotoStart : function(){
      var newURL = window.location.origin + window.location.pathname;
      window.location.href = newURL;
   },
   showMore : function (){
      this.showIndex += 4;
   },
   showAll : function(){
      this.showIndex = this.allAnniversaries.length;
   },
   calculateTimes : function(){

      // DANGER: only since 1970
      var rawMilliseconds = (new Date()).getTime() - this.anniversary.getTime();

      // Can probably do months via a different method.  Years too?
      this.weeksMarried = Math.round(rawMilliseconds / ONE_WEEK)
      this.daysMarried = Math.round(rawMilliseconds / ONE_DAY)
      this.hoursMarried = Math.round(rawMilliseconds / ONE_HOUR)
      this.minutesMarried = Math.round(rawMilliseconds / ONE_MINUTE)
      this.secondsMarried = Math.round(rawMilliseconds / ONE_SECOND)

      setTimeout(this.calculateTimes, ONE_SECOND)
   },
   populateAnniversaries : function(anniversary){
      
      var aClone = new Date(anniversary);
      var aRaw = anniversary.getTime();
      var aMoment = moment(aClone);

      this.allAnniversaries = [

         // Years
         {text : 'One Year',  milestone : true, date : new Date(aClone.setFullYear(anniversary.getFullYear() + 1))},

         // Seconds
         { text : "One Million Seconds",  date : new Date(aRaw + ONE_SECOND*ONE_MILLION) },
         { text : "One Billion Seconds", milestone : true,  date : new Date(aRaw + ONE_SECOND*ONE_BILLION) },
         { text : "Two Billion Seconds", milestone : true,  date : new Date(aRaw + ONE_SECOND*ONE_BILLION*2) },

         // Minutes
         { text : "Ten Thousand Minutes",  date : new Date(aRaw + ONE_MINUTE*ONE_THOUSAND*10) },
         { text : "One Hundred Thousand Minutes",  date : new Date(aRaw + ONE_MINUTE*ONE_THOUSAND*100) },
         { text : "One Million Minutes", milestone: true, date : new Date(aRaw + ONE_MINUTE*ONE_MILLION) },

         // Hours
         { text : "One Thousand Hours",  date : new Date(aRaw + ONE_HOUR*ONE_THOUSAND) },
         { text : "Ten Thousand Hours",  date : new Date(aRaw + ONE_HOUR*ONE_THOUSAND*10) },
         { text : "One Hundred Thousand Hours",  date : new Date(aRaw + ONE_HOUR*ONE_THOUSAND*100) },

         // Days
         { text : "One Hundred Days", milestone : true, date : new Date(aRaw + ONE_DAY*100) },
         { text : "Five Hundred Days", date : new Date(aRaw + ONE_DAY*500) },
         { text : "One Thousand Days", milestone : true, date : new Date(aRaw + ONE_DAY*ONE_THOUSAND) },
         { text : "Ten Thousand Days", milestone : true, date : new Date(aRaw + ONE_DAY*ONE_THOUSAND*10) },
         { text : "Twenty Thousand Days", date : new Date(aRaw + ONE_DAY*ONE_THOUSAND*20) },

         // Weeks
         { text : "Ten Weeks", date : new Date(aRaw + ONE_WEEK*10) },
         { text : "One Hundred Weeks", milestone : true, class: "", date : new Date(aRaw + ONE_WEEK*100) },
         { text : "One Thousand Weeks", milestone : true, class: "", date : new Date(aRaw + ONE_WEEK*ONE_THOUSAND) },

         // Months - use moment here to prevent day wrapping for end of month differences.
         { text : "One Hundred Months", milestone : true, date : moment(anniversary).add(100, 'months').toDate() },
         { text : "One Thousand Months", milestone : true, date : moment(anniversary).add(1000, 'months').toDate() },
      ]

      // YEARS
      for(var i = 2 ; i <= MAX_YEARS; i++){
         this.allAnniversaries.push({text : i + ' Years',  milestone : true, date : new Date(aClone.setFullYear(anniversary.getFullYear() + i))})
      }

      // Months
      for(var i=2; i<=11 ; i++){
         if(i != 10) this.allAnniversaries.push({ text : i+"00 Months",  date : moment(anniversary).add(i*100, 'months').toDate() });
      }

      // Weeks
      for(var i=2; i<=40;i++){
         if(i != 10) this.allAnniversaries.push({ text : i+"00 Weeks", class: "", date : new Date(aRaw + ONE_WEEK*100*i) })
      }

      // Days
      for(var i = 2; i < 10; i++){
         this.allAnniversaries.push({ text : i+" Thousand Days", date : new Date(aRaw + ONE_DAY*ONE_THOUSAND*i) });
         // Do 11 - 20, but skip 20k
         this.allAnniversaries.push({ text : (i+10)+" Thousand Days", date : new Date(aRaw + ONE_DAY*ONE_THOUSAND*(i+10)) });

         // 21 - 29k
         this.allAnniversaries.push({ text : (i+20)+" Thousand Days", date : new Date(aRaw + ONE_DAY*ONE_THOUSAND*(i+20)) });
      }

      // HOURS
      for(var i = 2 ; i <= 5 ; i++){
         this.allAnniversaries.push({ text : i + "00 Thousand Hours",  date : new Date(aRaw + ONE_HOUR*ONE_THOUSAND*100*i) });
      }

      // MINUTES
      for(var i = 2; i<MAX_MILLION_MINUTES; i++){
         this.allAnniversaries.push({ text : i+" Million Minutes", date : new Date(aRaw + ONE_MINUTE*ONE_MILLION*i)})         
      }

      // SECONDS: 10 - 100
      for(var i = 10; i<100; i+=10){
         this.allAnniversaries.push({ text : i + " Million Seconds",  date : new Date(aRaw + ONE_SECOND*ONE_MILLION*i) })         
      }

      // SECONS: 100 - 1000
      for(var i = 100; i<1000; i+=100){
         this.allAnniversaries.push({ text : i + " Million Seconds",  date : new Date(aRaw + ONE_SECOND*ONE_MILLION*i) })         
      }

      this.allAnniversaries.sort(function(a,b){
         return a.date.getTime() - b.date.getTime();
      });

      var now = new Date();
      this.upcomingAnniversaries = this.allAnniversaries.filter(function(obj){
         return obj.date > now;
      });
   },
   prettyPrint : function(oldDate){
      var newDate = moment(oldDate)
      // return newDate.format("DD.MM.YYYY, [at] h:mm:ss a");
      return newDate.format("MMMM Do YYYY, [at] h:mm:ss a");
   }
  },
  computed : {
   canProceed : function(){
      return (this.picker != '' && this.timer != '');
   },
   showToolbar : function(){
      return !this.dateSelected;
   }
  },
  created : function(){

      // We use '10' here in case random junk gets added to the URL somehow...
      if(window.location.search != "" && window.location.search.length > 10 ){
         var searchString = window.location.search.substring(1, window.location.search.length);
         var params = parse_query_string(searchString);

         this.dateSelected = true;
         this.anniversary = new Date(params.year, params.month, params.day, params.hour, params.minute, 0);
         this.momentAnniversary = moment(this.anniversary);
         this.populateAnniversaries(this.anniversary);
      }


      // var now = new Date();
      // var lastMonth = new Date(2017, 11, 15, 2, 2, 0);
      // var yesterday = new Date(2018, 0, 5, 12, 4, 1, 0);
      // var lastYear = new Date(2017, 4, 4, 12, 4, 1, 0);
      // var tenYears = new Date(2010, 7, 3, 12, 4, 1, 0);

      // console.log('Running date tests: ');

      // var dif1 = dateDifference(now, yesterday);
      // console.log('Yesterday: ' + JSON.stringify(dif1))

      // var dif2 = dateDifference(now, lastMonth);
      // console.log("Last Month: " + JSON.stringify(dif2));

      // var dif3 = dateDifference(now, lastYear);
      // console.log('Last Year: '+JSON.stringify(dif3));

      // var dif4 = dateDifference(now, tenYears);
      // console.log('Ten Years: '+JSON.stringify(dif4));
  }
})