;(function ( $, window, document, undefined ) {
    
$.fn.CircleDraw = function(settings){
  
    var plugin=this;
    
    var win_height=$('#frame').height();
    var win_width=$('#frame').width();

   var config = {
        "radius": 100,
        "cx": win_width/2,
        "cy":win_height/2,
        "css_class":'guide'
        //onSomeEvent: function() {}
    }

    if (settings) {
        $.extend(config, settings);
    }
    
    var init = function() {
        plugin.settings = $.extend({}, config, settings);
        plugin.draw_circle();
    }

    plugin.draw_circle=function(){
    	
    	if(isNaN(config.radius)==true){
    		console.log("Circle: config.radius ("+config.radius+") is not a number");
    		return false;
    	}
    	if(isNaN(config.cx)==true){
    		//console.log("Circle: config.cx ("+config.cx+") is not a number");
    		return false;
    	}
    	if(isNaN(config.cy)==true){
    		//console.log("Circle: config.cy ("+config.cy+") is not a number");
    		return false;
    	}

        var svgNS = "http://www.w3.org/2000/svg"; 
        var identifier="C"+($("circle").length++);
        var mLine = document.createElementNS(svgNS,"circle"); 
        mLine.setAttributeNS(null,"class",config.css_class);
        mLine.setAttributeNS(null,"r",config.radius);
        mLine.setAttributeNS(null,"cx",config.cx);
        mLine.setAttributeNS(null,"cy",config.cy);
        mLine.setAttributeNS(null,"data-identifier",identifier);

		var theID=$(plugin).attr("id");
        document.getElementById(theID).appendChild(mLine); 

    }
    
    init();

}

})( jQuery, window, document );