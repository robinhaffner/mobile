var __t, __d, __id, __localStorage;
var __speed = 50;
tdata = {};
var numOfQuestions = 0;

$( document ).on( "pageinit", "[data-role='page'].app-page", function() {
	var page = "#" + $( this ).attr( "id" ),
		// Get the filename of the next page that we stored in the data-next attribute
		next = $( this ).jqmData( "next" );
	
	// Check if we did set the data-next attribute
	if ( next ) {
		// Prefetch the next page
		$.mobile.loadPage( next + ".html", {prefetch:"true"} );
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

$(document).on('pageshow', "[data-role='page'].app-page", function(event, ui) {
	//console.log('ps',event, ui, $(this));
	__id = $(this)

	if ($(this).find('last')) {
		renderJSONContent.lastPage();
	}

	$("#ISI").scrollTop(0);

	if(typeof(Storage)!=="undefined")
	{
		localStorage.segment = $(this).jqmData( "segment" );
	}

	__d = $(this).jqmData( "selectdata" );
	//console.log("__d",__d)

	if(typeof(__d)!=="undefined"){
		$.getJSON(__d+'.json', function(json, textStatus) {
			var count = Object.keys(json).length
			if (__d == "question") { localStorage.count = count; };
			if ( localStorage.segment != 0) {
				$('.info_banner span.question').empty().append(localStorage.segment +" of "+ localStorage.count);
				$('.info_banner span.score').empty().append(localStorage.score);
				$('.info_banner span.rank').empty().append(localStorage.rank);
			};
			
			if (textStatus == "success") {
				$.extend(tdata, json);
				__localStorage = "question"+localStorage.segment

				$.each(tdata, function(index, val) {

					if (index == __localStorage){
		 				tdata = val
		 				if (__d == "question") {
		 					renderJSONContent.questionJSON();
		 				}
		 				if (__d == "scores") {
		 					if(typeof(Storage)!=="undefined")
							{
								localStorage.score = tdata.score;
								localStorage.rank = tdata.rank;
							}
		 					renderJSONContent.scoreJSON();
		 				}
		 				if (__d == "ad") {
		 					//data-next="q2" data-segment="1"
		 					numOfQuestions++;

		 					if (numOfQuestions == parseInt(localStorage.count)) {
		 						$.mobile.loadPage( "last.html", {prefetch:"true"} );
		 						$.mobile.changePage("last.html", { transition: "none" }, true, true );
		 					} else { 
		 						$.mobile.loadPage( "q"+numOfQuestions+".html", {prefetch:"true"} );
		 						$.mobile.changePage( "q"+numOfQuestions+".html", { transition: "none" }, true, true );
		 					 }
		 					
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
		//console.log("questionJSON: ", __localStorage, __d, __id, tdata)
		var questionContent = $(__id).find('#question_content').html();
		var questionHTML = Mustache.to_html(questionContent, tdata);
		$(__id).find('#question_content').show('fast').html(questionHTML);
		if (__localStorage == "question1") {
			getListView();
		};
	},
	scoreJSON: function(){
		//console.log("scoreJSON: ", __localStorage, __d, __id, tdata)
		var scoreContent = $(__id).find('#score_content').html();
		var scoreHTML = Mustache.to_html(scoreContent, tdata);
		$(__id).find('#score_content').empty().show('fast').html(scoreHTML);
	},
	adJSON: function(){
		//console.log("adJSON: ", __localStorage, __d, __id, tdata, numOfQuestions)
		var adContent = '<div id="ad_space" class="ui-grid-solo"><div class="ui-block-a"><img src="{{image_url}}" id="ad_space" /></div></div>';
		var adHTML = Mustache.to_html(adContent, tdata);
		$(__id).find('#ad_content').show('fast').html(adHTML);
	},
	lastPage: function(){
		//console.log("lastPage: ", __localStorage, __d, __id, tdata, numOfQuestions)
		$('.info_banner span.question').empty().append("&nbsp;");
		$('.info_banner span.score').empty().append(localStorage.score);
		$('.info_banner span.rank').empty().append(localStorage.rank);
		$('a#return').attr('href', location.host+"/mobile/mobile.html");
	}
}

function getListView(){
    $('#sortable')
        .sortable({
            'containment': 'parent',
            'opacity': 0.6,
            update: function(event, ui) {
                console.log(event, ui)
            }
        })
        .disableSelection()
        .listview().listview('refresh');
};

$( window ).orientationchange();

