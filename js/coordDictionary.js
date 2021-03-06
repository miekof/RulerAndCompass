	var CoordDictionary = function(settings){
	  
        var self=this;
    	this.snapshot_width=10;
    	this.Dictionary=[];
    	this.currentElement='';
    	this.currentElementID='';
    	var lastComparison=[];//last comparison list
	      
        this.find_coords=function(){
     		
     	/*	Brute force test algorithm 
     	 *  It is initially fast, but gets exponentially larger with each line
     	 *  Sweep Line has better worst case with very fast best case scenarios
     	 
			var ce=this.currentElement;
			$('line').not(this.currentElement).each(function(){
				var coord=new LineIntersections(); 
				coord.line1Id=$(ce).attr("data-identifier");
				coord.line2Id=$(this).attr("data-identifier");
				var intersection_point=coord.intersection_point();
				if(intersection_point!=false && isNaN(intersection_point.x)!=true &&  isNaN(intersection_point.y)!=true){ 
					$("#intersection_points").CircleDraw({cx:intersection_point.x,cy:intersection_point.y,radius:5, css_class:"intersection" });
				}
			});
			*/
						
			if(this.currentElement.is("circle")==true ) {
				this.find_circle_intersections();
				return;
			} 
     		
     		var myX1=parseInt($(this.currentElement).attr("x1"));
     		var myX2=parseInt($(this.currentElement).attr("x2"));
     		this.currentElementID=$(this.currentElement).attr("data-identifier");
     		
     		//check intersections with circles
			this.findLineCircleIntersections();
     		     		     		     		
     		if(myX1>myX2){
     			min_x=myX2;
     			max_x=myX1;
     		} else {
     			max_x=myX2;
     			min_x=myX1;
     		}  
     		
     		var start=this.find_start(min_x)-(this.snapshot_width*2); 
     		var end=max_x+(this.snapshot_width*2);
     		var my_y="nan";

     		for(var xpos=start;xpos<=end; xpos=xpos+this.snapshot_width){

         		my_y=$(this.currentElement).LineEquation({known_x:xpos}).y_from_x().toFixed(2);
         		this.add_y_to_dictionary(xpos,my_y );
         		this.check_for_intersections(xpos); 

         	}
         	         	
         	//reset comparison array
         	lastComparison=[];
         	
         	if(typeof this.intersections !="undefined"){
         		//console.log(this.intersections);
         	}
         	
         
     	}
         	
         /*
          * Find Coords
          * Find the Y value for each snapshot postition along the X axis
          */

         /* find the starting snapshot for an element */
         this.find_start=function(min_x){
         	var mstart =Math.floor(min_x / this.snapshot_width) * this.snapshot_width; 
         	return mstart;
         }
         
         /* Add a Y value to the dictionary paired with the shape id */
		 this.add_y_to_dictionary=function(my_x,my_y){
			el_id=$(this.currentElement).attr('data-identifier');
	
			var entry=[];
			entry.y=my_y;
			entry.id=el_id;
			
			if(typeof this.Dictionary[my_x] === 'undefined') {
			    this.Dictionary[my_x]=[];
			}
			
			this.Dictionary[my_x].push(entry);
			var enrtySorted=sort_entry(this.Dictionary[my_x]);
			this.Dictionary[my_x]=enrtySorted;
			
		} 	
		
		function sort_entry(entry){
			
			entry.sort(function(a,b) {
			 // assuming distance is always a valid integer
			 return parseFloat(a.y) - parseFloat(b.y);
			});
			
			return entry;
			
		}
		
		this.check_for_intersections=function(current_x){
			
			/*
			 * Sweep Line Check
			 * At each X ccordinate check for position shifts on the Y axis
			 * order changes relative to another element indicates that an intersection has ocurred
			 */
			
			// Look for more than one element in the Dictionary at given x position
			// If more than one exists compare previous array to current position
			
			//find previous position by subtracting snapshot distance from current X position
			var current_x=current_x;
			var last_x=current_x-this.snapshot_width;
			
			//$('#guidelines').Guideline({x:current_x,css_class:"gridline"}).draw_guideline_vertical();
			
			/*
			 * Compare order of ID to other element in each array. 
			 * If there is a change add elements into intersectingElements[]
			 */
			 			
			//locate dictionary for current X 
			var current_x_list=this.Dictionary[current_x];
			//reuse last comparison list
			var last_x_list=lastComparison;
			
			//if comparison list is undefined: current list = last list; end;
			if(typeof lastComparison =="undefined"){
				
				//make sure there is at least two to compare
					if(current_x_list.length>1){
						last_comparisons=this.make_comparison_list(current_x_list);
					}
				return;
			} 
			//if last list is present: make a current list
			else if(typeof current_x_list!="undefined"  ){ 
				//make sure there is at least two to compare
				if(current_x_list.length>1){
					current_comparisons=this.make_comparison_list(current_x_list);
				}
												
			}
			
			//Now compare the two. Crossing of size will indicate an intersection
			if(typeof current_comparisons !="undefined" && typeof lastComparison !="undefined"){
				//console.log(current_comparisons,lastComparison);
				this.append_intersection_list(current_comparisons,lastComparison );
			}
							
			 //Prepare for the next go around	
			if(typeof current_comparisons!="undefined"  ){ 
				lastComparison=current_comparisons;
			}	
		}
		
		this.append_intersection_list=function(current_comparisons,lastComparison ){
			//console.log(current_comparisons,lastComparison);
			if(current_comparisons.length>0 && lastComparison.length>0){
				
				for(index in current_comparisons ){
					if(current_comparisons[index]!=lastComparison[index]){
						elems=[index,this.currentElementID];
						this.find_intersection_points(elems);
					}
				} 
				
			}
		}
		
		this.make_comparison_list=function(list){
				var comparison_list=[];
				var compare='smaller';
				for(var it=0; it<list.length; it++ ){
					var li=list[it];
					if(li.id==this.currentElementID){
						compare="subject";
						comparison_list[li.id]=compare; 
						compare="bigger";
					} else {
						comparison_list[li.id]=compare;
					}
				}//end for loop
			return comparison_list;
		}//end make comparison list
		
       	//The grand finale
		//Find intersection points and add them to the list
		this.find_intersection_points=function(elems){
			var intersectionCoord=new LineIntersections(); 
			intersectionCoord.line1Id=elems[0];
			intersectionCoord.line2Id=elems[1];

			var intersection_point=intersectionCoord.intersection_point();
			var iCoord=new Coords(intersection_point.x,intersection_point.y);
			if(intersection_point!=false && isNaN(intersection_point.x)!=true &&  isNaN(intersection_point.y)!=true){ 
				var iNode=new IntersectionNode(iCoord,elems);
			}
		}
		
		this.find_circle_intersections=function(){
			var cur=this.currentElement;
			
			$("#guidecircles circle").not(this.currentElement).each(function(){
				var intersects=$(cur).CircleEquation({circleToTest:$(this)}).FindCircleCircleIntersections();
				console.log(intersects);
				var elems=[$(this).attr("data-identifier"),$(cur).attr("data-identifier")];
												
				if(intersects[0]!=false && typeof intersects[0]!="undefined"){
					//make intersection node
					var iCoord=new Coords(intersects[0].x,intersects[0].y);
					var iNode=new IntersectionNode(iCoord,elems);
				} 
 				if(intersects[1]!=false && typeof intersects[1]!="undefined"){
 					//make intersection node
 					var iCoord=new Coords(intersects[1].x,intersects[1].y);
 					var iNode=new IntersectionNode(iCoord,elems);
				}

			});
			
			$("line").not(".preview_line").each(function(){
				var intersects=$(cur).CircleEquation({lineToTest:$(this)}).findCircleLineIntersection();
				var elems=[$(this).attr("data-identifier"),$(cur).attr("data-identifier")];
								
				if(intersects[0]){
					var iCoord=new Coords(intersects[0].x,intersects[0].y);
					var iNode=new IntersectionNode(iCoord,elems);
				} 
 				if(intersects[1]){
					var iCoord=new Coords(intersects[1].x,intersects[1].y);
					var iNode=new IntersectionNode(iCoord,elems);
				}
			});
			
		}
		
		this.findLineCircleIntersections=function(){
			var cur=this.currentElement;
			
			$("#guidecircles circle").each(function(){
				var intersects=$(this).CircleEquation({lineToTest:cur}).findCircleLineIntersection();

				var elems=[$(this).attr("data-identifier"),$(cur).attr("data-identifier")];
				
				if(intersects!=false ){ 
					if(intersects[0]){
						var iCoord=new Coords(intersects[0].x,intersects[0].y);
						var iNode=new IntersectionNode(iCoord,elems);
					} 
	 				if(intersects[1]){
						var iCoord=new Coords(intersects[1].x,intersects[1].y);
						var iNode=new IntersectionNode(iCoord,elems);
					}	
				}
			});
		}
		
 	}