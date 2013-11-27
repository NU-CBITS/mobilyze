var app = {};
app.content = appContent;

app.config = {};
app.config.mode = "demo"; //demo or normal or assessment

app.config.contentDiv = ".mainContent";

app.config.mainContent = {};
app.config.mainContent.showTitle = false;
app.config.title = "Mobilyze";
app.config.assessments = {};
app.config.assessments.exist = false;
app.config.lessonToLoad = function (days_in_treatment, lesson_id) {

    if (app.status.todaysLessonHasBeenRead()) {

        return lesson_id
    } else {
        var todays_lesson_id = _.where(app.content, {
            days_in_treatment: user.state.days_in_treatment
        })[0].id;

        return todays_lesson_id
    }
}


app.images_url = "images/";
app.videos_url = "videos/";
app.audio_url = "audio/";

app.status = {};
app.status.currentPageIndex = null;
app.status.currentChapterId = null;
app.status.currentChapterElement = null;
app.status.currentChapterContents = null;
app.status.numPagesInCurrentChapter = null;

app.status.todaysLessonHasBeenRead = function () {


    if (_.where(app.content, {
        days_in_treatment: user.state.days_in_treatment
    })[0] != undefined) {

        var todays_lesson_id = _.where(app.content, {
            days_in_treatment: user.state.days_in_treatment
        })[0].id
        return _.contains(user.state.lessons.reviewed, todays_lesson_id)

    } else {
        return true
    }

}

app.start = {};

app.start.lesson = function (appContent, lesson_id) {
    document.title = app.config.title;
    app.status.currentChapterId = app.config.lessonToLoad(user.state.days_in_treatment, lesson_id);

    app.build.navChapterBar(app.arrayOfChapterIds(appContent));
    user.state.lessons.reviewed.push(app.config.lessonToLoad(user.state.days_in_treatment, lesson_id));
    app.build.chapter(app.status.currentChapterId, appContent);

}

app.start.summary = function () {
    var summaryContent = "";

    var isEnabled = function (day_in_treatment) {

        if (day_in_treatment <= user.state.days_in_treatment) {
            return "enabled"
        } else {

            return ""
        }

    };


    var hasLesson = function (element_list) {

        if (element_list != "") {
            return "<i class='icon-book icon-2x'></i>"
        } else {
            return ""
        }

    };

    var hasTool = function (refers_to) {

        if (refers_to != "") {
            return "<i class='" + _.where(user.sub.apps, {
                alt_name: refers_to
            })[0].icon + " icon-2x'></i>"
        } else {
            return ""
        }

    };

    var showIcons = function (element) {

        var all_valid_icon_tags = "";

        all_valid_icon_tags += hasLesson(element.element_list);
        all_valid_icon_tags += hasTool(element.refers_to);

        return all_valid_icon_tags
    };

    _.each(_.where(app.content, {
        element_type: "lesson"
    }), function (el) {

        // console.log(el);
        if (isEnabled(el.days_in_treatment) == "enabled") {
            summaryContent = "<tr><td class='icons'><div class='load-lesson " + isEnabled(el.days_in_treatment) + "'data-lesson-id='" + el.id + "'>" + showIcons(el) + "</div></td><td class='nav'><div class='load-lesson " + isEnabled(el.days_in_treatment) + "'data-lesson-id='" + el.id + "'><h4 style='font-weight:bold; color:#444444'>Day " + el.days_in_treatment + "</h4><h3>" + el.pretty_name + "</h3>" + el.description + "<br/><br/></td></tr>" + summaryContent;
        }

    });


    $(app.config.contentDiv).html("");
    $(app.config.contentDiv).append("<h1><a href='../index.html'><i class='icon-home'></i> </a> Lessons</h1><br/><br/><table>" + summaryContent + "</table>");
    $(".load-lesson.enabled").on("click", function (ev) {
        app.start.lesson(app.content, ev.currentTarget.dataset.lessonId)
    });
};



app.arrayOfChapterIds = function (appContent) {

    var search_criteria = {
        element_type: "lesson"
    };
    return _.where(appContent, search_criteria);
};

app.getChapterContents = function (chapter_id, appContent) {

    var search_criteria = {
        id: parseInt(chapter_id)
    };

    chapter_contents_list = _.where(appContent, search_criteria)[0].element_list.toString().split(",");
    chapter_contents = [];

    console.log("Chapter selected:", _.where(appContent, search_criteria)[0]);
    console.log("Chapter contents list:", chapter_contents_list);
    _.each(chapter_contents_list, function (element) {
        // console.log(parseInt(element));
        chapter_contents.push(_.where(appContent, {
            id: parseInt(element)
        })[0]);
    });
    return chapter_contents;
};




app.build = {};
app.build.navChapterBar = function (arrayOfChapters) {

    _.each(arrayOfChapters, function (i) {

        $("#main_nav").append('<li class="load-chapter" data-id="' + i.id + '"><a href="#' + i.pretty_name + '">' + i.pretty_name + '</a></li>');

    });

    $(".load-chapter").on("click", function (ev) {
        app.actions.goToChapter(ev.currentTarget.dataset.id, app.content)
    });
};





app.build.action_uri = function (currentChapterId) {

    var goto_uri = "../index.html";

    if (_.where(app.content, {
        id: parseInt(currentChapterId)
    }).length > 0) {

        if (_.where(user.sub.apps, {
            alt_name: _.where(app.content, {
                id: parseInt(currentChapterId)
            })[0].refers_to
        }).length > 0) {
            goto_uri = "../" + _.where(user.sub.apps, {
                alt_name: _.where(app.content, {
                    id: parseInt(currentChapterId)
                })[0].refers_to
            })[0].uri;
        }
    }

    return goto_uri
}

app.build.find_next_chapter_action = function(currentChapterId){

    var next_chapter_action = user.sub.apps_default;


    if (_.where(app.content, {
        id: parseInt(currentChapterId)
    }).length > 0) {

        if (_.where(user.sub.apps, {
            alt_name: _.where(app.content, {
                id: parseInt(currentChapterId)
            })[0].refers_to
        }).length > 0) {
            next_chapter_action = _.where(user.sub.apps, {
                alt_name: _.where(app.content, {
                    id: parseInt(currentChapterId)
                })[0].refers_to
            })[0];
        }
    }

    return next_chapter_action

}


app.build.chapter = function (currentChapterId, appContents) {
    var next_action = app.build.find_next_chapter_action(currentChapterId);

    var action_uri = app.build.action_uri(currentChapterId);

    $("button.pageNext").off("click");
    $("button.pageBack").off("click");
    currentChapterId = parseInt(currentChapterId);
    console.log("Building Chapter", currentChapterId);
    app.status.currentChapterElement = _.where(appContents, {
        id: currentChapterId
    })[0];
    app.status.currentChapterContents = _.compact(app.getChapterContents(currentChapterId, appContents));
    app.status.numPagesInCurrentChapter = _.compact(app.getChapterContents(currentChapterId, appContents)).length;
    if (app.status.numPagesInCurrentChapter > 0) {
        app.status.currentPageIndex = 0;
        app.actions.setPage(app.status.currentChapterContents[app.status.currentPageIndex]);
        $("li.load-chapter").removeClass("active");
        $("li.load-chapter[data-id=\"" + currentChapterId + "\"]").addClass("active");
        $(".pageBack").hide();




        $(".pageNext").html('<i class= "icon-chevron-right"></i>');
        $(".pageBack").html('<i class="icon-chevron-left"></i>');


        $("button.pageNext").on("click", function (ev) {
            app.actions.changePage(app.status.currentPageIndex + 1, currentChapterId)
        });
        $("button.pageBack").on("click", function (ev) {
            app.actions.changePage(app.status.currentPageIndex - 1, currentChapterId)
        });

        if (app.status.numPagesInCurrentChapter > 1) {
            app.build.chapterProgressBar(app.status.currentPageIndex + 1, app.status.numPagesInCurrentChapter);
            $(".currentSlideCount").html("1 of " + app.status.numPagesInCurrentChapter);
        }
        else {
            $(".currentSlideCount").html("<button class='btn next_action' style='font-size:1.2em;'>" + next_action.name + " <i class='"+ next_action.icon +"'></i></button>");
            $(".next_action").on("click", function(ev){ utility.goto_action_uri(action_uri); });
        }

        $(".mainContainer, .pageNext, .chapterProgress, .currentSlideCount").show();
        if (app.status.numPagesInCurrentChapter == 1) {
            $(".pageNext").hide();
            $(".pageBack").hide();
        } else {
            $(".pageNext").show();
            $(".pageBack").show();
        }

    } else {

        utility.goto_action_uri(action_uri);

    }
};

app.build.chapterProgressBar = function (position, total) {
    $(".chapterProgressBar").width((position / total) * 100 + "%");
}



app.templates = {};
app.templates.fullPage = '<div class="span12 mainContent"></div>';
app.templates.threePanel = '<div class="span7 mainContent"></div><div class="span5"><div class="row-fluid"><div class="span12 topRight"></div><div class="row-fluid"><div class="span12 bottomRight"></div></div></div></div>';

app.actions = {};

app.actions.setPage = function (pageContents) {


    mainContentsTemplate = function (headline, contents) {

        var main_contents = "";
        if (app.config.mainContent.showTitle == true) {
            main_contents = main_contents + "<h1>" + headline + "</h1>";
        }

        main_contents = main_contents + contents.replace(server_cdn,local_static_assets);;
        return main_contents;
    }

    if (pageContents.template == "fullPage") {

        $(".mainContainer").html(app.templates.fullPage);
        $(".mainContent").html(mainContentsTemplate(pageContents.pretty_name, pageContents.main_content));
    } else {

        $(".mainContainer").html(app.templates.threePanel);
        $(".mainContent").html(mainContentsTemplate(pageContents.pretty_name, pageContents.main_content));
        $(".topRight").html(pageContents.side_panel_content2);
        $(".bottomRight").html(pageContents.side_panel_content);
    }

    // $(".tooltip").tooltip();
    $("a.image").on("click", function (ev) {
        ev.preventDefault();
        console.log(ev);
        app.actions.loadImage(ev.currentTarget.href);
    });
    $("a.graph").on("click", function (ev) {
        ev.preventDefault();
        console.log(ev);
        app.actions.loadGraph(ev.currentTarget.href);
    });
    $("a.video").on("click", function (ev) {
        ev.preventDefault();
        console.log(ev);
        app.actions.loadVideo(ev.currentTarget.href);
    });
    $("a.audio").on("click", function (ev) {
        ev.preventDefault();
        console.log(ev);
        app.actions.loadVideo(ev.currentTarget.href);
    });
    $("a.audioImage").on("click", function (ev) {
        ev.preventDefault();
        console.log(ev);
        app.actions.loadVideo(ev.currentTarget.href);
    });
    $(".definition").tooltip();
    $(".definition").on("click", function (ev) {
        ev.preventDefault();
    });

};

app.actions.changePage = function (index_of_page, currentChapterId) {
    console.log("Page changed to ", index_of_page + 1, "of", app.status.numPagesInCurrentChapter);

    $(".currentSlideCount").html(index_of_page + 1 + " of " + app.status.numPagesInCurrentChapter);

    app.status.currentPageIndex = index_of_page;
    if (index_of_page == 0) {
        $("button.pageNext").off("click");
        $("button.pageBack").off("click");
        $("button.pageNext").on("click", function (ev) {
            app.actions.changePage(app.status.currentPageIndex + 1, currentChapterId)
        });
        $("button.pageBack").on("click", function (ev) {
            app.actions.changePage(app.status.currentPageIndex - 1, currentChapterId)
        });
        $(".pageBack").hide();
    }

    if (index_of_page == app.status.numPagesInCurrentChapter - 1) {
        var next_action = app.build.find_next_chapter_action(currentChapterId);
        var action_uri = app.build.action_uri(currentChapterId);

        var finishText = "<i class='"+ next_action.icon +"'></i>";
 

        $(".pageNext").html(finishText);
        $("button.pageNext").off("click");
        $("button.pageBack").off("click");
        $("button.pageNext").on("click", function (ev) {
            utility.goto_action_uri(action_uri);
        });
        $("button.pageBack").on("click", function (ev) {
            app.actions.changePage(app.status.currentPageIndex - 1, currentChapterId)
        });

    }

    if (index_of_page != 0 && index_of_page != app.status.numPagesInCurrentChapter - 1) {
        $(".pageNext").html('NEXT <i class= "icon-chevron-right"></i>');
        $(".pageBack").html('<i class="icon-chevron-left"></i> BACK');
        $("button.pageNext").off("click");
        $("button.pageBack").off("click");
        $("button.pageNext").on("click", function (ev) {
            app.actions.changePage(app.status.currentPageIndex + 1, currentChapterId)
        });
        $("button.pageBack").on("click", function (ev) {
            app.actions.changePage(app.status.currentPageIndex - 1, currentChapterId)
        });
        $(".pageBack").show();
    }

    app.build.chapterProgressBar(app.status.currentPageIndex + 1, app.status.numPagesInCurrentChapter);
    app.actions.setPage(app.status.currentChapterContents[app.status.currentPageIndex]);

};


app.actions.goToChapter = function (chapterId, appContents) {

    if (confirm('Are you sure you want to quit this chapter?')) {
        app.build.chapter(parseInt(chapterId), appContents);
    } else {
        // Do nothing!
    }


}


app.actions.loadAssessment = function (id_of_questionnaire) {
    if (app.config.assessments.exist) {
        alert("Assessments have not yet been provided, please check in later!");
    }
};

app.actions.loadImage = function (image) {

    var imageTemplate = function (image_location) {
        return '<img src="' + app.images_url + image_location + '"/>'
    }
    $(".topRight").html(imageTemplate(image.replace("http://", "").replace("/", "")));


}

app.actions.loadVideo = function (video) {

    var videoTemplate = function (mp4_location) {
        return '<video style=\"width:100%;\" controls autoplay><source src="' + app.videos_url + mp4_location + '" type="video/mp4">Your browser does not support the video tag.</video>'
    }
    $(".topRight").html(videoTemplate(video.replace("http://", "").replace("/", "")));
}



app.actions.loadAudio = function (audiofile) {

    var audioTemplate = function (mp4_location) {
        return '<audio style=\"width:100%;\" controls autoplay><source src="' + app.audio_url + mp4_location + '" type="audio/mp3">Your browser does not support the video tag.</video>'
    }

    $(".topRight").html(audioTemplate(audiofile.replace("http://", "").replace("/", "")));
}

app.actions.loadAudioImage = function (filename) {

    var audioImageTemplate = function (filename) {
        return '<img src="' + app.images_url + filename + '.jpg"/><br/><audio style=\"width:100%;\" controls autoplay><source src="' + app.audio_url + filename + '.mp3" type="audio/mp3">Your browser does not support the video tag.</video>'
    }

    $(".topRight").html(audioImageTemplate(audiofile.replace("http://", "").replace("/", "")));
}




//proxy until highcharts discussion
app.actions.loadGraph = function (image) {

    var imageTemplate = function (image_location) {
        return '<img src="' + app.images_url + image_location + '"/>'
    }

    $(".topRight").html(imageTemplate(image.replace("http://", "").replace("/", "")));


}


app.actions.loadId = function (id_to_load, appContents) {

    return _.where(appContents, {
        id: id_to_load
    }).main_content;

}