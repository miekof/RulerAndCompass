//Drawing App Object

/* 
 * Interprets mouse events and sends them off for activitiy
 */
var DrawApp = function(){
	  
	self=this;
	coordDictionary=new CoordDictionary();  
	  
	 /* CLICK EVENTS
	  * Click events are either starting points or ending points 
	  * clicknum keeps track of which stage you are at. 
	  * 1. start
	  * 2. end
	  */
	 
	var clicknum=0; 
	
	var mode="line";
	
	var newLineCoord = {
        x1: "nan",
        y1: "nan",
        x2: "nan",
        y2: "nan"
    }
    
    self.init=function(){
    	setUpCanvas();
    	return self;
    }
    self.init();
    
    
    //Register Keyboard Events
   $(document).keyup(function(e) {
	  e = e || window.event; 
	  var charCode = e.charCode || e.keyCode, character = String.fromCharCode(charCode);
	  var keycode=e.keyCode;    
	
	//alert(keycode);
	
		switch (keycode){
			case 27:
				reset_vars();
			break;
			
			case 187:
				zoomIn();
			break;
			
			case 189:
				zoomOut();
			break;
			
			case 48:
				zoomReset();
			break;
			
			case 190:
				hideIntersectionPoints();
			break;	
		}	  

	});
	 
	//document.getElementById("frame").addEventListener("click", function(e){
	// document.addEventListener("click", function(e){
		
	$(document).on('click',".intersection",function(){
		
  		var my_x=this.getAttribute("cx");
		
		var my_y=this.getAttribute("cy");
		/* get mouse positions */
		
		/*//get values
		var parent_offset=$("#nest").parent().offset(); 
		var my_x=parseInt(e.pageX-parent_offset.left);
		var my_y=parseInt(e.pageY-parent_offset.top);*/
		
		//only register clicks inside the drawing canvas
		if(my_x <0|| my_y <0){
			return false; 
		}
		
		clicknum++;
		
		if(clicknum == 1){
			//starting coordinates
			newLineCoord.x1=my_x;
			newLineCoord.y1=my_y;
			
		} else if (clicknum == 2){ 
			
			//ending coordinates
			newLineCoord.x2=my_x;
			newLineCoord.y2=my_y;
			var current_line; 

						
			switch (mode){
				
				case "line":
					//add new line
					add_line();
					var current_line=$(".guideline").last(); 

				break;
				
				case "circle-center":
					add_circle("guide");
					current_line=$(".guide").last(); 
				break;
				
				case "circle-edge":
					add_circle("guide");
					current_line=$(".guide").last(); 
				break;
				
			}
			
			coordDictionary.currentElement=current_line; 
			coordDictionary.find_coords(); 
		
			//remove the preview line
			reset_vars();
		
		}		
	});
	
	/* MOUSE MOVE */
	document.onmousemove = function(e) { 
		if(newLineCoord.x1!='nan' ) {
			$('.preview_line').remove();
			var parent_offset=jQuery('#nest').parent().offset();
			newLineCoord.x2=parseInt(e.pageX-parent_offset.left);
			newLineCoord.y2=parseInt(e.pageY-parent_offset.top);
			jQuery('#preview').Guideline({css_class:"preview_line",x1: newLineCoord.x1, y1:newLineCoord.y1, x2:newLineCoord.x2, y2:newLineCoord.y2}).draw();
			if(mode=="circle-center" || mode=="circle-edge"){
				add_circle("preview_line");
			}
		} 
	}
	
	function reset_vars(){ 
		clicknum=0;
		newLineCoord.x1="nan";
		newLineCoord.y1="nan";
		newLineCoord.x2="nan";
		newLineCoord.y2="nan";
		$('.preview_line').remove();
	}
	
	function add_line(){
		x1v=newLineCoord.x1;
		y1v=newLineCoord.y1;
		x2v=newLineCoord.x2;
		y2v=newLineCoord.y2;
		
		jQuery('#guidelines').Guideline({x1: x1v, y1:y1v, x2:x2v, y2:y2v}).draw();
		 
	}
	
	function add_circle(className){
		//define variables
		var myClass=className;
		//get circle attributes from click distance & mode
		if(mode=="circle-center"){
			var attrs=calculateCircleCenterAttrs();
		}
		else if(mode=="circle-edge"){
			var attrs=calculateCircleEdgeAttrs();
		}
		
		//draw circle
		$("#guidecircles").CircleDraw({cx:attrs.cx,cy:attrs.cy,radius:attrs.radius, css_class:className }); 

	}
	
	function calculateCircleCenterAttrs(){
				
		var x1v=newLineCoord.x1;
		var y1v=newLineCoord.y1;
		var x2v=newLineCoord.x2;
		var y2v=newLineCoord.y2;
		var magnitude=$("line.preview_line").LineEquation().getMagnitude();

		var attrs={
			cx:x1v,
			cy:y1v,
			radius:magnitude
		}
		
		return attrs;
		
	}
	
	function calculateCircleEdgeAttrs(){
		var x1v=newLineCoord.x1;
		var y1v=newLineCoord.y1;
		var x2v=newLineCoord.x2;
		var y2v=newLineCoord.y2;
		var midpoint=$("line.preview_line").LineEquation().findMidpoint();
		var magnitude=$("line.preview_line").LineEquation().getMagnitude();
				
		var attrs={
			cx:midpoint.x,
			cy:midpoint.y,
			radius:magnitude/2
		}
		
		return attrs;
	}
	
	$("#toolbox button").click(function(){
		$("#toolbox button").removeClass("active");
		mode=$(this).attr('data-mode');
		$(this).addClass("active").blur();
	});
	
	function setUpCanvas(){
		
			var frameHeight=Number($('#nest').height());
			var frameWidth=Number($('#nest').width());
		
			$("#guidecircles").CircleDraw();
			var xCoord=$("circle").attr("cx");
			var yCoord=$("circle").attr("cy");
			//$("#intersection_points").CircleDraw({cx:xCoord, cy:yCoord, radius:5, css_class:"intersection"});
			$("#guidelines").Guideline({x1:xCoord,y1:0,x2:xCoord,y2:frameHeight}).draw();
			coordDictionary.currentElement=$("line").last(); 
			coordDictionary.find_coords(); 
			
			$("#guidelines").Guideline({x1:0,y1:yCoord,x2:frameWidth,y2:yCoord}).draw();
			coordDictionary.currentElement=$("line").last();
			coordDictionary.find_coords(); 
		
	}
	
	var zoomIn=function(){
		
	}
	
	var zoomOut=function(){
		
	}
	
	var zoomReset=function(){
		
	}
	
	var hideIntersectionPoints=function(){
		if($("#intersection_points").hasClass("hidden")==true){
			$("#intersection_points").removeClass("hidden");
		} else {
			$("#intersection_points").addClass("hidden");
		}
	}
	
  }
