var guid = function(){

return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
});

}

//Touche - makes HTML buttons more responsive on touch devices by 300ms
// (function() {
//   var isTouch = 'ontouchstart' in window || 'onmsgesturechange' in window;

//   function Touche(nodes) {
//     // Doing this allows the developer to omit the `new` keyword from their calls to Touche
//     if(!(this instanceof Touche)) return new Touche(nodes);

//     if (!nodes) {
//       throw new Error('No DOM elements passed into Touche');
//     }

//     this.nodes = nodes;

//     return this;
//   }

//   // Our own event handler
//   Touche.prototype.on = function(event, fn) {
//     var touchend, nodes = this.nodes, len = nodes.length, ev;

//     if (isTouch && event === 'click') {
//       touchend = true;
//     }

//     ev = function(el, event, fn) {
//       var called, once = function() {
//         if(!called && (called = true)) fn.apply(this, arguments);
//       };

//       el.addEventListener(event, once, false);

//       if(touchend) el.addEventListener('touchend', once, false);
//     }

//     // NodeList or just a Node?
//     if (len) {
//       while (len--) ev(nodes[len], event, fn);
//     } else {
//       ev(nodes, event, fn);
//     }

//     return this;
//   };

//   // Expose Touche
//   window.Touche = Touche;

//   // Has the developer used jQuery?
//   if (window.jQuery && isTouch) {
//     var originalOnMethod = jQuery.fn.on;
    
//     // Change event type and re-apply .on() method
//     jQuery.fn.on = function() {
//       var event = arguments[0];
//       arguments[0] = event === 'click' ? 'touchend' : event;
//       originalOnMethod.apply(this, arguments);
//       return this;
//     };
//   }
// })();
jQuery.fn.serializeObject = function() {
  var arrayData, objectData;
  arrayData = this.serializeArray();
  objectData = {};

  $.each(arrayData, function() {
    var value;

    if (this.value != null) {
      value = this.value;
    } else {
      value = '';
    }

    if (objectData[this.name] != null) {
      if (!objectData[this.name].push) {
        objectData[this.name] = [objectData[this.name]];
      }

      objectData[this.name].push(value);
    } else {
      objectData[this.name] = value;
    }
  });

  return objectData;
};


var utility = {};

utility.goto_action_uri = function (uri) {

    if (uri != "" && uri != undefined) {

        var domain_split_uri = uri.split("://");

        if (domain_split_uri.length == 1) {

            window.location.href = uri;

        } else {

            switch (domain_split_uri[0]) {

            case "http":
                window.location.href = uri;
                break;

            }

        }

    }

};


function dateDiff(date1,date2,interval) {
    var second=1000, minute=second*60, hour=minute*60, day=hour*24, week=day*7;
    date1 = new Date(date1);
    date2 = new Date(date2);
    var timediff = date2 - date1;
    if (isNaN(timediff)) return NaN;
    switch (interval) {
        case "years": return date2.getFullYear() - date1.getFullYear();
        case "months": return (
            ( date2.getFullYear() * 12 + date2.getMonth() )
            -
            ( date1.getFullYear() * 12 + date1.getMonth() )
        );
        case "weeks"  : return Math.floor(timediff / week);
        case "days"   : return Math.floor(timediff / day); 
        case "hours"  : return Math.floor(timediff / hour); 
        case "minutes": return Math.floor(timediff / minute);
        case "seconds": return Math.floor(timediff / second);
        default: return undefined;
    }
}



var user = {};

user.info = {};

user.info.firstLoginDate = function(){

  if (localStorage["user.info.firstLoginDate"]){
      return Date.parse(localStorage["user.info.firstLoginDate"])
  }
    else {

      localStorage["user.info.firstLoginDate"] = new Date();
    }

}


user.state = {};
user.state.days_in_treatment = 100;
user.state.lessons = {};
user.state.lessons.reviewed = [];

user.session = {};
user.session.id = guid();
user.session.state = {};

var behavioral = {};
behavioral.categories = [];
behavioral.categories_default = {id:0, name:"", styles:"", classes:"", priority:-1};
behavioral.categories[0] = {id:1, type:"clinical_aim", name:"home", title:"Home", styles:"",classes:"", priority:0};
behavioral.categories[1] = {id:2, name:"didactic", title:"Didactic Content", styles:"",classes:"bg-themeA", priority:0};
behavioral.categories[2] = {id:3, name:"coping", title:"Coping", styles:"",classes:"bg-themeB", priority:0};
behavioral.categories[3] = {id:4, name:"behavioral_activation", title:"Behavioral Activation", styles:"", classes:"bg-themeC",priority:0};
behavioral.categories[4] = {id:5, name:"viz", title:"Data Visualization", styles:"",classes:"bg-themeD", priority:0};
behavioral.categories[5] = {id:6, name:"prd", title:"Patient Reported Data", styles:"", classes:"bg-themeE",priority:0};
behavioral.categories[6] = {id:7, name:"ema", title:"Environmental Momentary Assessment", styles:"",classes:"bg-themeF", priority:1};
behavioral.categories[7] = {id:8, name:"cognitive", title:"Cognitive Restructuring", styles:"",classes:"bg-themeG", priority:0};
behavioral.categories[8] = {id:9, name:"recommendation", title:"Recommendation", styles:"",classes:"bg-themeG", priority:0};
behavioral.categories[9] = {id:10, name:"goal_setting", title:"Goal Setting", styles:"",classes:"bg-themeG", priority:0};


user.sub = {};
user.sub.apps = [];
user.sub.apps_default = {id: 0, behavioral_categories:[], name:"Home", icon: "icon-home", styles:"", classes:"", orderer:"0", visible:false, uri:"../index.html", alt_name:"home", disabled:false };
user.sub.apps[0] = {id: 1, behavioral_categories:['didactic'], name:"Lessons", icon: "icon-book", styles:"", classes:"", orderer:"1", visible:true, uri:"billboard/index.html", alt_name:"lessons",  disabled:false };
user.sub.apps[1] = {id: 2, behavioral_categories:['coping'], name:"Active Coping", icon: "icon-sun", styles:"", classes:"", orderer:"2", visible:true, uri:"traptrac/index.html", alt_name:"TRAP", disabled:false  };
user.sub.apps[2] = {id: 3, behavioral_categories:['coping'], name:"Coping Cards", icon: "icon-star-half-full", styles:"", classes:"", orderer:"3", visible:true, uri:"copingcard/index.html", alt_name:"Coping Card",  disabled:false };
user.sub.apps[3] = {id: 4, behavioral_categories:['behavioral_activation','prd'], name:"Activity Calendar", icon: "icon-calendar", styles:"", classes:"", orderer:"4", visible:true, uri:"calendar/index.html", alt_name:"Activity Calendar",  disabled:false  };
user.sub.apps[4] = {id: 5, behavioral_categories:['prd','ema'], name:"Check-In", icon: "icon-question", styles:"", classes:"", orderer:"5", visible:true, uri:"mobilyzepro/index.html", alt_name:"PRO",  disabled:false };
user.sub.apps[5] = {id: 6, behavioral_categories:['viz'], name:"Graphs", icon: "icon-bar-chart", styles:"", classes:"", orderer:"6", visible:true, uri:"graphs/index.html", alt_name:"Graphs",  disabled:false  };
user.sub.apps[6] = {id: 7, behavioral_categories:['viz'], name:"Review", icon: "icon-info-sign", styles:"", classes:"", orderer:"7", visible:true, uri:"review/index.html", alt_name:"review",  disabled:false  };
user.sub.apps[7] = {id: 8, behavioral_categories:['viz','recommendation'], name:"Predictions", icon: "icon-eye-open", styles:"", classes:"", orderer:"8", visible:false, uri:"prediction/index.html", alt_name:"Predictions",  disabled:false  };
user.sub.apps[8] = {id: 9, behavioral_categories:['recommendation'], name:"Current Prompt", icon: "icon-comment-alt", styles:"", classes:"", orderer:"9", visible:false, uri:"prompt/index.html", alt_name:"Current Prompt",  disabled:false  };
user.sub.apps[9] = {id: 10, behavioral_categories:['recommendation'], name:"Fun Things", icon: "icon-rocket", styles:"", classes:"", orderer:"10", visible:true, uri:"fun/index.html", alt_name:"Current Prompt",  disabled:false  };

user.sub.widget = {};
user.sub.widget.view = function(el){


      var cssClasses = function(el){

        var added_classes = el.classes;
        _.each(el.behavioral_categories, function(el2){ 

            if (_.where(behavioral.categories,{name:el2}).length > 0){
            added_classes += " " +_.where(behavioral.categories,{name:el2})[0].classes;
            }

        });

        return added_classes
      }

      var view = "";

      view += "<button class='widget widget" + el.id + "  " + cssClasses(el) + "' styles='" + el.styles + "' data-alt-name='" + el.alt_name +  "'>";
      view += "<i class='" + el.icon + "'></i>";
      view += "<h2 class='title'>" + el.name +"</h2>";
      view += "</button>";
      if (el.visible == true){
      return view
      }
      else {return ""}

    }

user.sub.widget.action = function(el){

  $(".widget" + el.id).on("click", function(ev){utility.goto_action_uri(el.uri)});

}

user.sub.widget.menu = {};
user.sub.widget.menu.view = function(array_of_widgets){
  var view = "";

  _.each(array_of_widgets, function(el){
      view += user.sub.widget.view(el)});

  return "<div class='widgetMenu'>" + view + "</div>"

}

user.sub.widget.menu.actions = function(array_of_widgets){
  _.each(array_of_widgets, function(el){
        $(".widget" + el.id).on("click", function(ev){utility.goto_action_uri(el.uri)});
  });
}







var prJsonSubmitUrl = "http://10.101.117.92:12345/json/submit";	// http://10.101.117.92:12345/test.html
var prwAddrHostAndPortHttps = "https://app2.cbits.northwestern.edu"; // https://ejs.cbits.northwestern.edu:8094 OR https://165.124.171.88 OR https://165.124.171.34:8094
var triggerIdCommonPrefix = 'CopingCard: ';





/**
 * Clears the contents of the specified jQuery element.
 * @param  {[type]} jqElem [description]
 * @return {[type]}        [description]
 */
var clearContents = function(jqElem) {
  if($(jqElem).is("input")) { $(jqElem).val(''); }
  if($(jqElem).is("textarea")) { $(jqElem).text(''); }
};





//===========================================================
// PurpleRobotWarehouse POST code (i.e. database-upload code)
//===========================================================

var s4 = function() {
  return Math.floor((1 + Math.random()) * 0x10000)
             .toString(16)
             .substring(1);
};

var guid = function() {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
         s4() + '-' + s4() + s4() + s4();
};


/**
 * 
 * @param  {[type]} protoHostAndPortUrlBase 
 * @param  {[type]} userId                  
 * @param  {[type]} postData                
 * @param  {[type]} cbFn                    
 * @param  {[type]} cbData                  
 * @return {[type]}                         
 */

/**
 * POSTs a user-enrollment form to Purple Robot Warehouse, for a specific user.
 * @param  {[type]} protoHostAndPortUrlBase Base URL to which you wish to POST. EX: "https://app2.cbits.northwestern.edu"
 * @param  {[type]} userId                  A user ID string, which will be MD5 hashed - this hash value is the database name. EX (pre-MD5-hashing): "evan.story@northwestern.edu".
 * @param  {[type]} tableName               Table name. EX: "user_responses".
 * @param  {[type]} postData                The data structure to POST. EX: { Q1: "Name?", A1: "John Doe", Q2: "Rate your happiness, 1-10 (high).", A2: 7 }
 * @param  {[type]} cbFn                    Callback function. Takes 4 parameters: cbData, responseData, postData, postUrl
 * @param  {[type]} cbData                  External data to pass to the callback function.
 * @return {[type]}                         No defined return value.
 */
var postToPRImporter = function(protoHostAndPortUrlBase, userId, tableName, postData, cbFn, cbData) {
  var postUrl = protoHostAndPortUrlBase + '/prImporter';

  // generate the PR Importer message to be posted
  var userIdHash = md5(userId);
  var prImporterPostMessage = {
    "json": {
      "Operation": "SubmitProbes",
      "UserHash": userIdHash,
      "Payload": [
        {
          "PROBE": tableName,
          "GUID": guid(),
          "TIMESTAMP": (new Date().getTime() / 1000)
        }
      ],
      "Checksum": ""
    }
  };

  // SINGLE-LEVEL TABLE COLUMN + VALUE APPEND: loop-over the keys in the postData obj and append them to the Payload
  _.each(_.keys(postData), function(k) {
    prImporterPostMessage.json.Payload[0][k] = postData[k];
  });

  // stringify the payload
  prImporterPostMessage.json.Payload = JSON.stringify(prImporterPostMessage.json.Payload);
  
  // package-up the data.
  prImporterPostMessage.json.Checksum = md5(
      prImporterPostMessage.json.UserHash
    + prImporterPostMessage.json.Operation
    + prImporterPostMessage.json.Payload
  );
  var postData = prImporterPostMessage;
  postData.json = JSON.stringify(prImporterPostMessage.json);

  // POST the data to the specified URL.
  console.log('posting the following object to this URL: ' + postUrl);
  console.log(postData);

  $.post(postUrl, postData)
    .done(function(responseData) { 
      // call the user's callback function, if defined
      if (!isNullOrUndefined(cbFn)) {
        cbFn(cbData, responseData, postData, postUrl);
      }
    }
  );
};




// =====================
// Date / Time functions
// =====================

/**
 * Takes an HTML5 date string, and and an HTML5 time string, and returns a JS Date object.
 * @param  {[type]} dateStr [description]
 * @param  {[type]} timeStr [description]
 * @return {[type]}         [description]
 */
var html5DateAndTimeToJSDateTime = function(dateStr, timeStr) {
	var darr = dateStr.split('-');
	var tarr = timeStr.split(':');

	var year = parseInt(darr[0]),
		month = parseInt(darr[1]) - 1,
		day = parseInt(darr[2]),
		hour = parseInt(parseInt(tarr[0], 10)),
		minute = parseInt(parseInt(tarr[1], 10)),
		second = 0
		;
	var d = new Date(year, month, day, hour, minute, second);
	return d;
};


/**
 * Returns the string representing an ICal-formatted Date string. EX: "20130101T123400" (as seen on: http://tech.cbits.northwestern.edu/purple-robot-javascript-api/)
 * Copy-pasted from PRNM.
 * @return {[type]} [description]
 */
Date.prototype.toICal = function() { var fn = 'Date.prototype.toICal';
  var  yy = this.getFullYear()
      ,MM = this.clone().addMonths(1).getMonth()
      ,dd = this.getDate()
      ,hh = this.getHours()
      ,mm = this.getMinutes()
      ,ss = this.getSeconds();

  var ret = ''
    + yy.toString()
    + ((MM < 10) ? '0' + MM : MM.toString())
    + ((dd < 10) ? '0' + dd : dd.toString())
    + 'T'
    + ((hh < 10) ? '0' + hh : hh.toString())
    + ((mm < 10) ? '0' + mm : mm.toString())
    + ((ss < 10) ? '0' + ss : ss.toString())
    ;
  return ret;
};


/**
 * Converts an ICal-formatted date string into a JS Date object.
 * Copy-pasted from PRNM.
 * @param  {[type]} iCalStr [description]
 * @return {[type]}         [description]
 */
var iCalToDate = function(iCalStr) { var fn = 'iCalToDate';
  var  yy = iCalStr.substr(0,4)
      ,MM = (parseInt(iCalStr.substr(4,2), 10)) - 1
      ,dd = iCalStr.substr(6,2)
      ,hh = iCalStr.substr(9,2)
      ,mm = iCalStr.substr(11,2)
      ,ss = iCalStr.substr(13,2);

  var d = new Date(yy,MM,dd,hh,mm,ss);
  // self.debug('iCalStr = ' + iCalStr + '; d = ' + d, fn);
  return d;
};



// =================
// Utility functions
// =================
 
var isNullOrUndefined = function(v) { var fn = 'isNullOrUndefined';
  // if(v == '"') { self.debug('v is a double-quote!', fn); return false; }
  return (v == null || v == undefined || v == 'null');
};

var isStringGt0Len = function(s) { var fn = 'isString';
  var ret = !self.isNullOrUndefined(s) && _.isString(s) && s.length > 0;
  self.debug('s = ' + s + '; ret = ' + ret, fn);
  return ret;
};


/**
 * Returns a single-quoted string representing a set of values in an array.
 * Copy-pasted from PRNM.
 * @param  {[type]} paramArray [description]
 * @return {[type]}            [description]
 */
var getQuotedAndDelimitedStr = function(paramArray, delim, quoteChar, doNotQuoteTokens) { var fn = 'getQuotedAndDelimitedStr';
  // self.log('entered and exiting, with paramArray = ' + paramArray,fn);
  var qc = self.isNullOrUndefined(quoteChar) ? '\'' : quoteChar;
  if(self.isNullOrUndefined(paramArray) || paramArray.length == 0) { return ''; }
  return _.reduce(_.map(paramArray, function(param) { 
      return !self.isNullOrUndefined(doNotQuoteTokens) && _.isArray(doNotQuoteTokens) && _.contains(doNotQuoteTokens, param)
        ? param
        : qc + param + qc;
    }),
    function(memo, val) {
      return paramArray.length == 1 ? val : memo + delim + val;
  });
};