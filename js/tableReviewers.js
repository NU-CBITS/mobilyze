	var tableReviewers = {};
  	tableReviewers.collections = [];

  	tableReviewers.definitionAssets = function(selectCriteria){
		return _.where(user.sub.apps,selectCriteria)[0]; 
  	};

  	tableReviewers.views = {};
  	tableReviewers.views.mainView = function(data_to_report){
  		console.log(data_to_report);
	  	var view = "";
	  	var buildDataArray = [];
	  		_.each(data_to_report, function(el){

	  			var collection = pound.find(el);
	  			_.each(collection, function(el2){ 
	  				buildDataArray.push({type:el,contents:el2});
	  			});
	  		});

	  	console.log(buildDataArray);

  		_.each(buildDataArray, function(el){
  			var viewTemplate = _.where(tableReviewers.views.viewCollection,{id:el.type})[0].template;
  			// view += '<i class="' '"></i>';
  			view += viewTemplate(el.contents);
		});

    if(buildDataArray.length > 0){
  	return view}
    else{

      return "<div class='alert alert-info'><b>We're sorry!</b><br/>You haven't yet used Mobilyze tools--but we KNOW you want to... or why else would you be here?</div><a href='../index.html' class='btn btn-primary'><i class='icon-home'></i> Visit the Home Screen and Try Something Else</a>"

    }

  	};

  	tableReviewers.views.viewCollection = [];
  	tableReviewers.views.viewCollection[0]= {
  		id:"active_coping",
  		selectCriteria:{name:"Active Coping"},
		template: function(record){


			var view = "";
			var activity = record.activity || "No activity entered";
			var activityAlternate = record.activityAlternate || "";
			var activityConsequences = record.activityConsequences || "";
			var activityReplacementActivity = record.activityReplacementActivity || "";
			var timestamp = record.timestamp || "";

			if (timestamp != ""){
			var timestamp_cleaned = timestamp.substring(0,10) + " " + timestamp.substring(12,19)
			view += '<div class="timestamp">'+ timestamp_cleaned +'</div>';
			}
			

			view += '<h1>You avoided</h1><div class="activity">' + activity + "</div>";
			view += '<h1>Instead you</h1><div class="activity-replacement-activity"> ' + activityReplacementActivity + '</div>';

			view += '<h1>As a result</h1><div class="activity-consequences"> ' + activityConsequences+ '</div>';
			view += '<h1>Instead you could</h1><div class="activity-alternate"> ' + activityAlternate+ '</div>';
			

			
			
			return '<div class="active_coping record">' + view + '</div>'

		},
		actions: function(){}
  	};


  	tableReviewers.views.viewCollection[1] = {
  		id:"coping_cards",
  		selectCriteria:{name:"Coping Card"},
		template: function(record){


			var view = "";
			var copingReminder = record.coping_reminder || "No reminder entered";
			var copingEventName = record.event_name || "";
			if (record.time != "" && record.date != ""){
			view += '<div class="timestamp">'+ record.date + " " +record.time +'</div>';}

			view += '<h1>Coping Situation</h1><div class="coping-event-name">' + copingEventName + "</div>";
			view += '<h1>Reminder</h1><div class="coping-reminder"> ' + copingReminder + '</div>';			
			
			return '<div class="coping_card record">' + view + '</div>'

		},
		actions: function(){}
  	};

  	
  	tableReviewers.views.viewCollection[2] = {
  		id:"activity_tracker",
  		selectCriteria:{name:"Activity Tracker"},
		template: function(record){


			var view = "";
			// var copingReminder = record.coping_reminder || "No reminder entered";
			// var copingEventName = record.event_name || "";
			// if (record.time != "" && record.date != ""){
			// view += '<div class="timestamp">'+ record.date + " " +record.time +'</div>';}

			// view += '<h1>Coping Situation</h1><div class="coping-event-name">' + copingEventName + "</div>";
			// view += '<h1>Reminder</h1><div class="coping-reminder"> ' + copingReminder + '</div>';			
			
			return '<div class="activity_tracker record">' + view + '</div>'

		},
		actions: function(){}
  	};

