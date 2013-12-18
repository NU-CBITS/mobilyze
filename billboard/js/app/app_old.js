var app = {};
app.content = appContent.nav_elements;

app.config = {};
app.config.mode = "demo"; //demo or normal or assessment

app.config.mainContent = {};
app.config.mainContent.showTitle = false; 
app.config.title = "CONEMO";
app.config.assessments = {};
app.config.assessments.exist = false;
app.config.lessonToLoad = function(){

    if (localStorage["page_to_load"] != undefined){
        return parseInt(localStorage["page_to_load"])
    }

    else {
        return void 0;
    }
};


app.images_url = "images/";
app.videos_url = "videos/";
app.audio_url = "audio/";

app.status = {};
app.status.currentPageIndex = null;
app.status.currentChapterId = null;
app.status.currentChapterElement = null;
app.status.currentChapterContents = null;
app.status.numPagesInCurrentChapter = null;

app.start = function (appContent) {
    document.title = app.config.title;
    app.status.currentChapterId = app.config.lessonToLoad();

    if (!app.status.currentChapterId) {
        app.actions.loadHome()
    };


    app.build.navChapterBar(app.arrayOfChapterIds(app.content));
    app.build.chapter(app.status.currentChapterId, app.content);

        $(".pageBack").hide();


}

app.arrayOfChapterIds = function (appContent) {

    var search_criteria = {
        element_type: "lesson"
    };
    return _.where(appContent, search_criteria);
};

app.getChapterContents = function (chapter_id, appContent) {
    var search_criteria = {
        id: chapter_id
    };
        chapter_contents_list = _.where(appContent, search_criteria)[0].element_list.toString().split(",");
        chapter_contents = [];

    // console.log("Chapter selected:",_.where(appContent, search_criteria)[0]);
    // console.log("Chapter contents list:",chapter_contents_list);

    _.each(chapter_contents_list, function (element) {
        // console.log(parseInt(element));
        chapter_contents.push(_.where(appContent, {
            id: parseInt(element)
        })[0]);
    });
    return chapter_contents;
};





app.build = {}
app.build.navChapterBar = function (arrayOfChapters) {

    _.each(arrayOfChapters, function (i) {

        $("#main_nav").append('<li class="load-chapter" data-id="' + i.id + '"><a href="#' + i.pretty_name + '">' + i.pretty_name + '</a></li>');

    });

    $(".load-chapter").on("click", function(ev){app.actions.goToChapter(ev.currentTarget.dataset.id,app.contents)})
};




app.build.chapter = function (currentChapterId, appContents) {

	$("button.pageNext").off("click");
    $("button.pageBack").off("click");

    console.log("Building Chapter", currentChapterId);
    app.status.currentChapterElement = _.where(app.content, {
        id: currentChapterId
    })[0];
    app.status.currentChapterContents = app.getChapterContents(currentChapterId, appContents);
    app.status.numPagesInCurrentChapter = app.status.currentChapterContents.length;
    app.status.currentPageIndex = 0;
    app.actions.setPage(app.status.currentChapterContents[app.status.currentPageIndex]);
    $("li.load-chapter").removeClass("active");
	$("li.load-chapter[data-id=\""+currentChapterId+"\"]").addClass("active");
	$(".pageBack").hide();

    $(".currentSlideCount").html("1 of " + app.status.numPagesInCurrentChapter);


    $(".pageNext").html('NEXT <i class= "fa fa-chevron-right"></i>');
    $(".pageBack").html('<i class="fa fa-chevron-left"></i> BACK');


    $("button.pageNext").on("click",function(ev){app.actions.changePage(app.status.currentPageIndex+1)});
    $("button.pageBack").on("click",function(ev){app.actions.changePage(app.status.currentPageIndex-1)});
    app.build.chapterProgressBar(app.status.currentPageIndex+1,app.status.numPagesInCurrentChapter);

    $(".mainContainer, .pageNext, .chapterProgress, .currentSlideCount").show();
        if (app.status.numPagesInCurrentChapter == 1){
    $(".pageNext").show();
    $(".pageBack").hide();
    }else{
    $(".pageNext").show();
    $(".pageBack").show();
    }


};

app.build.chapterProgressBar = function (position,total){

    var dots = "";

    for (var i=1;i<total+1;i++)
    { 
   
    if (i <= position){
    dots += '<i class="fa fa-circle"></i>'
    }
    else {
    dots += '<i class="fa fa-circle-o"></i>'   
    }


    }

    $(".position-indicator").html(dots);
	 
}



app.templates = {};
app.templates.fullPage = '<div class="col-md-12 mainContent"></div>';
app.templates.threePanel = '<div class="col-md-7 mainContent"></div><div class="col-md-5"><div class="row-fluid"><div class="col-md-12 topRight"></div><div class="row-fluid"><div class="col-md-12 bottomRight"></div></div></div></div>';

app.actions = {};

app.actions.setPage = function (pageContents) {

    mainContentsTemplate = function (headline, contents) {

        var main_contents = "";
        if (app.config.mainContent.showTitle == true){
            main_contents = main_contents + "<h1>" + headline + "</h1>";
        }

        main_contents = main_contents+ contents;
        return main_contents;
    }


    if (pageContents.template == "fullPage"){

    $(".mainContainer").html(app.templates.fullPage);
        $(".mainContent").html(mainContentsTemplate(pageContents.pretty_name, pageContents.main_content));
    } else{

    $(".mainContainer").html(app.templates.threePanel);
    $(".mainContent").html(mainContentsTemplate(pageContents.pretty_name, pageContents.main_content));
    $(".topRight").html(pageContents.side_panel_content2);
    $(".bottomRight").html(pageContents.side_panel_content);}

    // $(".tooltip").tooltip();
    $("a.image").on("click",function(ev){ev.preventDefault();console.log(ev);app.actions.loadImage(ev.currentTarget.href);});
    $("a.graph").on("click",function(ev){ev.preventDefault();console.log(ev);app.actions.loadGraph(ev.currentTarget.href);});
    $("a.video").on("click",function(ev){ev.preventDefault();console.log(ev);app.actions.loadVideo(ev.currentTarget.href);});
    $("a.audio").on("click",function(ev){ev.preventDefault();console.log(ev);app.actions.loadVideo(ev.currentTarget.href);});
    $("a.audioImage").on("click",function(ev){ev.preventDefault();console.log(ev);app.actions.loadVideo(ev.currentTarget.href);});
    $(".definition").tooltip();
    $(".definition").on("click",function(ev){ev.preventDefault();});

};

app.actions.changePage = function (index_of_page) {
    console.log("Page changed to ", index_of_page + 1, "of", app.status.numPagesInCurrentChapter);

    $(".currentSlideCount").html(index_of_page + 1 + " of " + app.status.numPagesInCurrentChapter);

    app.status.currentPageIndex = index_of_page;
    if (index_of_page == 0) {
    	$("button.pageNext").off("click");
    	$("button.pageBack").off("click");
    	$("button.pageNext").on("click",function(ev){app.actions.changePage(app.status.currentPageIndex+1)});
    	$("button.pageBack").on("click",function(ev){app.actions.changePage(app.status.currentPageIndex-1)});
    	$(".pageBack").hide();
    } 

    if (index_of_page == app.status.numPagesInCurrentChapter - 1) {
    	$(".pageNext").html('FINISH <i class= "fa fa-stop"></i>');

    	$("button.pageNext").off("click");
    	$("button.pageBack").off("click");
    	$("button.pageNext").on("click",function(ev){app.actions.loadHome();});
    	$("button.pageBack").on("click",function(ev){app.actions.changePage(app.status.currentPageIndex-1)});

    } 
    
    if (index_of_page != 0 && index_of_page != app.status.numPagesInCurrentChapter - 1){
    	$(".pageNext").html('NEXT <i class= "fa fa-chevron-right"></i>');
    	$(".pageBack").html('<i class="fa fa-chevron-left"></i> BACK');
    	$("button.pageNext").off("click");
    	$("button.pageBack").off("click");
    	$("button.pageNext").on("click",function(ev){app.actions.changePage(app.status.currentPageIndex+1)});
    	$("button.pageBack").on("click",function(ev){app.actions.changePage(app.status.currentPageIndex-1)});
    	$(".pageBack").show();
    }

    app.build.chapterProgressBar(app.status.currentPageIndex+1,app.status.numPagesInCurrentChapter);
    app.actions.setPage(app.status.currentChapterContents[app.status.currentPageIndex]);

};


app.actions.goToChapter = function(chapterId,appContents){

    if (confirm('Are you sure you want to quit this chapter?')) {
    app.build.chapter(parseInt(chapterId),app.content);
} else {
    // Do nothing!
}
    

}


app.actions.loadHome = function () {
  window.location.href = "reviewer.html";
};

app.actions.loadImage = function(image){

var imageTemplate = function (image_location){
    return '<img src="'+app.images_url +image_location +'"/>'}
    $(".topRight").html(imageTemplate(image.replace("http://","").replace("/","")));


}

app.actions.loadVideo = function(video){

var videoTemplate = function (mp4_location){
    return '<video style=\"width:100%;\" controls autoplay><source src="'+app.videos_url +mp4_location +'" type="video/mp4">Your browser does not support the video tag.</video>'}
    $(".topRight").html(videoTemplate(video.replace("http://","").replace("/","")));
}



app.actions.loadAudio = function(audiofile){

var audioTemplate = function (mp4_location){
    return '<audio style=\"width:100%;\" controls autoplay><source src="'+app.audio_url +mp4_location +'" type="audio/mp3">Your browser does not support the video tag.</video>'}

    $(".topRight").html(audioTemplate(audiofile.replace("http://","").replace("/","")));
}

app.actions.loadAudioImage = function(filename){

var audioImageTemplate = function (filename){
    return '<img src="'+app.images_url + filename +'.jpg"/><br/><audio style=\"width:100%;\" controls autoplay><source src="'+app.audio_url +filename +'.mp3" type="audio/mp3">Your browser does not support the video tag.</video>'}

    $(".topRight").html(audioImageTemplate(audiofile.replace("http://","").replace("/","")));
}




//proxy until highcharts discussion
app.actions.loadGraph = function(image){

var imageTemplate = function (image_location){
    return '<img src="'+app.images_url +image_location +'"/>'
}

    $(".topRight").html(imageTemplate(image.replace("http://","").replace("/","")));


}


app.actions.loadId = function(id_to_load, appContents){

    return _.where(appContents, {id:id_to_load}).main_content;

}
