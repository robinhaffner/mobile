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
var filePathJSON = {
    ifFileExists: function(url){
        $.getJSON(url, function(qdata, textStatus) {})
        .success(function(qdata, textStatus) {
            filePathJSON.ifFileSuccess(qdata)
        })
        .error(function(qdata, textStatus) { 
            if(qdata.status == "404"){
                    filePathJSON.ifFileError()
            } 
            return false
        })                        
    },
    ifFileSuccess: function(data){
        var q = Object.keys(data).length
        $.each(data, function(i, ele) {
                q--
            for(a in ele.answers){
                plot[q].push([ele.answers[a].score,ele.answers[a].answer])
            }
        });
        plot1 = plot[0];
        plot2 = plot[1];
        createBarRenderer()
    },
    ifFileError: function(){
        filePath = "json/demo1/"+__g+".json";
        filePathJSON.ifFileExists(filePath)
    }
}

function createBarRenderer () {
    //each of these arrays should be built dynamically from the json data
    //var plot1 = [[5,"Bleeding Risk"],[4,"Stroke Risk"],[3,"Mortality Risk"],[2,"Adherence"],[1,"INR/PT test"]];
    //var plot2 = [[4.5,"Bleeding Risk"],[3.2,"Stroke Risk"],[3,"Mortality Risk"],[2,"Adherence"],[1.4,"INR/PT test"]];
    
    //The length of the plots determines the ticks and number of ticks
    var numTicks = plot1.length;
    var tickArray = new Array();
    for (var i=0; i<numTicks; i++)
      {
            tickArray.push(i+1);
      }

    plot5 = $.jqplot('chart5', 
    [plot1, plot2],
    {
        animate: true,
        captureRightClick: true,
        seriesDefaults:{
            renderer:$.jqplot.BarRenderer,
            shadowAngle: 135,
            rendererOptions: {
                barDirection: 'horizontal',
                highlightMouseDown: true    
            },
            pointLabels: {show: true, formatString: '%d'},
        },
        series:[
            {label:'Your selections'},
            {label:'What your peers think'}
            ],
        legend: {
            show: true,
            location: 'ne',     // compass direction, nw, n, ne, e, se, s, sw, w.
           // xoffset: 100,        // pixel offset of the legend box from the x (or x2) axis.
            yoffset: 300       // pixel offset of the legend box from the y (or y2) axis.
        },
        axisdefaults: {
            // show: false,    // wether or not to renderer the axis.  Determined automatically.
                min: 0,      // minimum numerical value of the axis.  Determined automatically.
                max: numTicks ,    // maximum numverical value of the axis.  Determined automatically.
                pad: 1,       // a factor multiplied by the data range on the axis to give the
                    // axis range so that data points don't fall on the edges of the axis.
                ticks: tickArray,//[1,2,3,4,5],      // a 1D [val1, val2, ...], or 2D [[val, label], [val, label], ...]
                    // array of ticks to use.  Computed automatically.
                numberTicks: numTicks,
                renderer: $.jqplot.LinearAxisRenderer,  // renderer to use to draw the axis,

                tickOptions: {
                    mark: 'outside',    // Where to put the tick mark on the axis
                                        // 'outside', 'inside' or 'cross',
                    showMark: true,
                    showGridline: true, // wether to draw a gridline (across the whole grid) at this tick,
                    markSize: 4,        // length the tick will extend beyond the grid in pixels.  For
                                        // 'cross', length will be added above and below the grid boundary,
                    show: true,         // wether to show the tick (mark and label),
                    showLabel: true,    // wether to show the text label at the tick,
                    formatString: '',   // format string to use with the axis tick formatter
                },
                showTicks: true,        // wether or not to show the tick labels,
                showTickMarks: true,    // wether or not to show the tick marks
        },
        axes: {
            yaxis: {
                renderer: $.jqplot.CategoryAxisRenderer
            },
            
            xaxis: {
                tickInterval: 1,
                ticks: tickArray,//[1,2,3,4,5],
                drawMajorGridlines: true,
                drawMinorGridlines: true,
                drawMajorTickMarks: true,
                rendererOptions: {
                    tickInset: 0.5,
                    minorTicks: 1
                }
            }
        }
    });
}//createBarRenderer