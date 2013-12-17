var __t, __d, __id, __localCookie;
var __speed = 50;
tdata = {};
var numOfQuestions = 0;
var selectedColor = "#f96802";
var defaultColor = "#dcd2ba";
var colorArray = []; 
var plotItems = []; 
var plotResults = [];


$( document ).on( "pageinit", "[data-role='page'].app-page", function() {
	   var page = "#" + $( this ).attr( "id" ),
		// Get the filename of the next page that we stored in the data-next attribute
		next = $( this ).jqmData( "next" );
    //console.log(page, next);
	
	// Check if we did set the data-next attribute
	if ( next ) {
         
		// Prefetch the next page
		//$.mobile.loadPage( next + ".html", {prefetch:"true"} );
		// Navigate to next page on swipe left
		$( document ).on( "swipeleft", page, function() {
			$.mobile.changePage( next + ".html", { transition: "none" }, true, true);
		});
		// Navigate to next page when the "next" button is clicked
		$( ".control .next", page ).on( "click", function(event) {
			event.preventDefault()
			$.mobile.changePage( next + ".html", { transition: "none" }, true, true );
		});
	}
	// Disable the "next" button if there is no next page
	else {
		$( ".control .next", page ).addClass( "ui-disabled" );
	}
    if (page == "#main"){
        var cookies = $.cookie();
        for(var cookie in cookies) {
           $.removeCookie(cookie);
        }
        //console.log("remove all cookies");
    }
    
	//footer
	$( "[data-role='footer']#ftr #ISI" ).load( "isi.html", function() {
		$(this).scrollTop(0);
		scroll_isi();
	});
});

function scroll_isi() {
    if (__t) clearTimeout(__t);
    document.getElementById("ISI").scrollTop++;
    __t = setTimeout("scroll_isi();", __speed);
}

var folderJSON;

function getPageParam() {
   
    __param = $.mobile.path.parseUrl(window.location);
    __p = __param.search.split("?")
    var b = {};
    if(__p.length > 1){

	    getParam = __p[1].split('&')
	    for (var i = 0; i < getParam.length; ++i)
        {
            var p=getParam[i].split('=');
            if (p.length != 2) continue;
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
        }
        for(folder in b){
        	if ( folder == "demo") {
        		folderJSON = b.demo
        	} else { 
        		folderJSON = "demo1"; 
        	}
        }
    } else {
    	folderJSON = "demo1"
    }

}
$(document).on('pageshow', "[data-role='page'].app-page", function(event, ui) {
	__id = $(this)

	if ($(this).find('last')) {
		renderJSONContent.lastPage();
	}

	$("#ISI").scrollTop(0);

	//use cookie to store values
	$.cookie('__segment', $(this).jqmData( "segment" ));
	var __segment = $.cookie('__segment');

	__d = $(this).jqmData( "selectdata" );

	if(typeof(__d)!=="undefined"){
		getPageParam(); //get JSON demo folder

		$.getJSON("json/"+folderJSON+"/"+__d+'.json', function(json, textStatus) {
			var __pages, __score, __rank;
			var count = Object.keys(json).length;
			$.cookie("__pages", count); 

			__score = $.cookie('__score');
			__rank = $.cookie('__rank');
			__pages = $.cookie('__pages');

			if ( __segment != 0) {
				$('.info_banner span.question').empty().append(__segment +" of "+ __pages);
				$('.info_banner span.score').empty().append(__score);
				$('.info_banner span.rank').empty().append(__rank);
			}
			
			if (textStatus == "success") {
				$.extend(tdata, json);
				__localCookie = "question"+__segment;
				$.each(tdata, function(index, val) {
                    localStorage.setItem("json", json);
                    //console.log("2", json.question2);
					if (index == __localCookie){
		 				tdata = val
		 				if (__d == "question") {
		 					renderJSONContent.questionJSON();
                            getBubbleView(json.question2);
		 				}
		 				if (__d == "scores") {
		 					//use cookie to store values
		 					$.cookie('__score', tdata.score);
		 					$.cookie('__rank', tdata.rank);
		 					renderJSONContent.scoreJSON();
		 				}
		 				if (__d == "ad") {
		 					//data-next="q2" data-segment="1"
		 					/*numOfQuestions++;

		 					if (numOfQuestions == parseInt(__pages)) {
		 						$.mobile.loadPage( "last.html", {prefetch:"true"} );
		 						$.mobile.changePage("last.html", { transition: "none" }, true, true );
		 					} else { 
		 						$.mobile.loadPage( "q"+numOfQuestions+".html", {prefetch:"true"} );
		 						$.mobile.changePage( "q"+numOfQuestions+".html", { transition: "none" }, true, true );
		 					 }
		 					*/
		 					$(__id).data('segment', numOfQuestions)
		 					renderJSONContent.adJSON();
		 				}

		 			}
		 		}); //each
			};
		}); //getJSON
	}


}); //pageshow

var renderJSONContent = {
	questionJSON: function(){
		//console.log("questionJSON: ", __localCookie, __d, __id, tdata)
		var questionContent = $(__id).find('#question_content').html();
		var questionHTML = Mustache.to_html(questionContent, tdata);
		$(__id).find('#question_content').show('fast').html(questionHTML);
		if (__localCookie == "question1") {
			getListView();
            //getBubbleView(tdata);
		};
        
        
	},
	scoreJSON: function(){
		//console.log("scoreJSON: ", __localCookie, __d, __id, tdata)
		var scoreContent = $(__id).find('#score_content').html();
		var scoreHTML = Mustache.to_html(scoreContent, tdata);
		$(__id).find('#score_content').empty().show('fast').html(scoreHTML);
	},
	adJSON: function(){
		//console.log("adJSON: ", __localCookie, __d, __id, tdata, numOfQuestions)
		var adContent = '<div id="ad_space" class="ui-grid-solo"><div class="ui-block-a"><img src="{{image_url}}" id="ad_space" /></div></div>';
		var adHTML = Mustache.to_html(adContent, tdata);
		$(__id).find('#ad_content').show('fast').html(adHTML);
	},
	lastPage: function(){
		//console.log("lastPage: ", __localCookie, __d, __id, tdata, numOfQuestions)
		$('.info_banner span.question').empty().append("&nbsp;");
		$('.info_banner span.score').empty().append($.cookie('__score'));//localStorage.score);
		$('.info_banner span.rank').empty().append($.cookie('__rank'));//localStorage.rank);
		$('a#return').attr('href', window.location.href.match(/^.*\//)[0]+"mobile.html");
	}
}

    

function getBubbleView(d){
    // console.log("init", d.answers);
    var answers = d.answers
    colorArray = [];
   for( i in answers){
        //console.log(answers[i].answer, answers[i].score);
        plotResults[i]=[answers[i].score, answers[i].answer];
        plotItems.push(answers[i].answer.replace('<br>',' '));
        colorArray.push('#dcd2ba');
    }
    
    //initialize the results array used to draw the results
   /* plotResults =[[90, "Bleeding<br>Risk"],[25, "Stroke<br>Risk" ],[73,"Mortality<br>Risk"],[42, "Adherence"],[48,"INR/PT<br>test"]];
    //Initialize the color array and the plotItems array to test selected by label
    for (var a=0; a<plotResults.length; a++){
        plotItems.push(plotResults[a][1].replace('<br>',' '));
        colorArray.push('#dcd2ba');
    }*/
    //use cookie to store data plots
    $.removeCookie('__plotResults');
    $.removeCookie('__plotItems');
    $.removeCookie('__colorArray');

   $.cookie("__plotResults", plotResults); 
   $.cookie("__plotItems", plotItems); 
   $.cookie("__colorArray", colorArray); 
    var canvasArr, labelArr, clickBubble, userSelectedBubble = [];
    var selected;
	$('#canvasBubble').bind('jqplotDataClick',
		function (ev, seriesIndex, pointIndex, data) {
			canvasArr = $.makeArray( $(this).find(".jqplot-series-canvas .jqplot-bubble-point") );
			labelArr = $.makeArray( $(this).find(".jqplot-series-canvas .jqplot-bubble-label") );
			//search for click location and hide from canvas container
			for( t in labelArr){
				if($.inArray($(labelArr[t]).html().toString(), data) != -1) {
					var options = {};
                    selected = $(labelArr[t]).html().toString();
					$(labelArr[t]).hide()
					$(canvasArr[t]).effect( "puff", options, 300);
                    colorArray[t] = selectedColor;
				}
			}
            $.removeCookie('__colorArray');
            $.cookie("__colorArray", colorArray); 
	});

}



function getListView(){
var plot1= [], plot2=[];

    $('#sortable')
        .sortable({
            'containment': 'parent',
            'opacity': 0.6,
            update: function(event, ui) {
                plot1= [], plot2=[];
                $('#sortable').find("li").each(function(i, e){
                	var s = $(e).html().replace(' ', '<br>');
                	plot1.push([i+1, s]);
                	plot2.push([parseFloat($(e).jqmData( "avg" )), s]);
                });

                plot1.reverse();
                plot2.reverse();

	            //use cookie to store data plots
	            $.removeCookie('__plot1');
	            $.removeCookie('__plot2');

	            $.cookie("__plot1", plot1); 
	            $.cookie("__plot2", plot2); 

                $("#q1 .control .next").removeClass( "ui-disabled" );
            }
        })
        .disableSelection()
        .listview().listview('refresh');
};

$( window ).orientationchange();

