// JavaScript Document
(function($) {
  $(document).ready(function() {  
	$("#dshbrd_items").sortable({
	  update: function(event, ui) {
	    id=$(this).attr('id');
		drg_id = ui.item.attr('id');
   	    drg_id_arr=drg_id.split("_");
		rcvd_id=drg_id_arr[1];
		
		if(id=="dshbrd_items"){
		  $.post("sav_dshbrd_ordr", { list: id, rcvd_id: rcvd_id, dshbrd_drag: 1, weights: $(this).sortable('serialize') } );
		}
	  },
	  placeholder: "ui-state-highlight col-md-3 col-sm-4 col-xs-12",
	  connectWith: ".menu",
      tolerance: "pointer",    
	  start: function(event, ui) {
        ui.item.data('start_pos', ui.item.index());
      },    
	  stop: function(event, ui) {
		$('body').children('.tooltips_wrpr').remove();  
        start_pos = ui.item.data('start_pos');
 	    id=$(this).attr('id');
		drg_id =ui.item.attr('id');
      },
	}).disableSelection();
	
	//removing element from dashboard
    $(document).on('click',"#dshbrd_items a.remove",function(e){
      id=$(this).attr('id');
	  //disable settings popup func.
	  $("body.page-dashboard #settings a.dshbrd_stngs").off("click");
	  $("body.page-dashboard #settings a.dshbrd_stngs").addClass("dsble_dshbrdstngs");
	  list_id=$(this).parent().parent().parent().attr("id");
	  //loader
	  $('body.page-dashboard #'+list_id).html('<div id="waiting"></div>');
	  $.post("rmv_dsbrd_item", { nid: id, weights: $("#dshbrd_items").sortable('serialize') },function(data){
	    //removing from display now
		$("#dshbrd_items #"+list_id).remove();
	    //enable settings popup func.
  	    $("body.page-dashboard #settings a.dshbrd_stngs").removeClass("dsble_dshbrdstngs");
		$("body.page-dashboard #settings a.dshbrd_stngs").on("click", dashboard_settings);
		if($("#dshbrd_items li").length==0) {
		 $("#no_dshbrd_item").show();
	    }
	  } );
    });
	$("#dshbrd_items a.remove").keydown(function (e) {
      if(e.which == 13) {
        $(this).trigger('click');
      }
    });
	//removing element from dashboard ends here		

	
	
	
    //dialog box intialization
    $("#in-active").dialog({
      modal: true,
	  draggable: false,	
	  autoOpen: false,	
	  resizable: false,
	  width: 600,
	  height: 400,
	  title:"SETTINGS",
   });

	//when settings button is clicked.....
	dashboard_settings = function(){ 
	  $( "#in-active" ).dialog( "open" );
	  $("#accordion").accordion({
	    animate: 200,
		collapsible: true,
		heightStyle: "content", 
		active:false,
	  }); 
	}
	$('#in-active').on('dialogclose', function(event) {
      $('#in-active .ui-accordion-content-active').hide();
    });
	$("body.page-dashboard #settings a.dshbrd_stngs").on("click", dashboard_settings);
    $("body.page-dashboard div#settings").keydown(function (e) {
      if(e.which == 13) {
        $('body.page-dashboard a.dshbrd_stngs').trigger('click');
      }
    });		
	//when settings button is clicked code ends here.....





	//ur_lsts_inact code starts here
    $("body.page-dashboard #in-active h3#ur_lsts").click(function(){
	   //loader
	   if(!$("body.page-dashboard #in-active #ur_lsts_cntnts").is(':visible') ) {
	     if($('body.page-dashboard #in-active #ur_lsts_cntnts div#waiting').length==0) {
		   $('body.page-dashboard #in-active #ur_lsts_cntnts').attr('style', 'overflow: hidden!important');	 
	       $('body.page-dashboard #in-active #ur_lsts_cntnts').html('<div id="waiting"></div>');
	     }
		 $('body.page-dashboard #in-active #ur_lsts_cntnts').attr('style', 'overflow: auto!important');	 
	     $.ajax({
		   type: "POST",
		   url: "/ur_lsts_inact",
		   success: function(msg){
		     $("body.page-dashboard #in-active #ur_lsts_cntnts").html(msg);
  	 	     $("#dshbrd_items, #ur_lsts_inact").sortable({
		       update: function(event, ui) {
			     id=$(this).attr('id');
			     drg_id = ui.item.attr('id');
				 drg_id_arr=drg_id.split("_");
				 rcvd_id=drg_id_arr[1];
			     if(id=="dshbrd_items"){
			 	   if($('body.page-dashboard #in-active #ur_lsts_cntnts #waiting2').length==0) {
                     $('body.page-dashboard #in-active #ur_lsts_cntnts').append('<div id="waiting2"></div>');  
				    }
				    post_top=$("#waiting2").position().top;
				    if(post_top<0) {
				      post_top=Math.abs(post_top);
  				      post_top=post_top+parseInt(10);
			        }else
			        {
				      post_top=0;
			        }
				    $('body.page-dashboard #in-active #ur_lsts_cntnts #waiting2').css({top:post_top+"px"});
				    $.post("sav_dshbrd_ordr", { list: id, rcvd_id: rcvd_id, weights: $(this).sortable('serialize') },function(data){
				      $('body.page-dashboard #in-active #ur_lsts_cntnts').attr('style', 'overflow: auto!important');
				      $('body.page-dashboard #in-active #ur_lsts_cntnts #waiting2').remove();
				      if(data>=12)
				      {	
  	                    $("#dialog-message").dialog("option","title","Alert");
			            $("#dialog-message #c_msg").text("Dashboard has 12 items limit.");
				        $("#dialog-message").dialog("open");
                        $("#ur_lsts_inact_no_data").hide();
				        $(ui.sender).sortable('cancel');		
				      }
				      else
				      {
					    $("body.page-dashboard #dshbrd_items #"+drg_id+" .tt-x-cust").hide();
				        $("body.page-dashboard #dshbrd_items #"+drg_id+" .s-title").show();
   				        $("body.page-dashboard #dshbrd_items #"+drg_id+" a.move").show();
 				        $("body.page-dashboard #dshbrd_items #"+drg_id+" a.remove").show();
				      }
				    } );//post ends
			     }//dashboard listings
		     },//update ends here
		     placeholder: "ui-state-highlight col-md-3 col-sm-4 col-xs-12",
  	         connectWith: ".menu",
			 tolerance: "pointer",
			 receive: function(event, ui) {
		       if($("#dshbrd_items li").length>0) {
		         $("#no_dshbrd_item").hide();
		       }
		       if($("#ur_lsts_cntnts li").length==0) {
		         $("#ur_lsts_inact_no_data").show();
		       }
             },
			 start: function() {
		       $('body.page-dashboard #in-active #ur_lsts_cntnts').attr('style', 'overflow: hidden!important');
             },
			 scroll : false,
	       }).disableSelection();
		 }
	   });//ajax ends
	  }//visible if
    });//click ends
	//ur_lsts_inact code ends here
	
	//your searches inactive code starts here
    $("body.page-dashboard #in-active h3#ur_srches").click(function(){
	   //loader
	   if(!$("body.page-dashboard #in-active #ur_srches_cntnts").is(':visible') ) {
	     if($('body.page-dashboard #in-active #ur_srches_cntnts div#waiting').length==0) {
		   $('body.page-dashboard #in-active #ur_srches_cntnts').attr('style', 'overflow: hidden!important');	 
	       $('body.page-dashboard #in-active #ur_srches_cntnts').html('<div id="waiting"></div>');
	     }
		 $('body.page-dashboard #in-active #ur_srches_cntnts').attr('style', 'overflow: auto!important');	 
	     $.ajax({
		   type: "POST",
		   url: "/ur_srches_inact",
		   success: function(msg){
		     $("body.page-dashboard #in-active #ur_srches_cntnts").html(msg);
  	 	     $("#dshbrd_items, #ur_srches_inact").sortable({
		       update: function(event, ui) {
			     id=$(this).attr('id');
			     drg_id = ui.item.attr('id');
				 drg_id_arr=drg_id.split("_");
				 rcvd_id=drg_id_arr[1];
			     if(id=="dshbrd_items"){
			 	   if($('body.page-dashboard #in-active #ur_srches_cntnts #waiting2').length==0) {
                     $('body.page-dashboard #in-active #ur_srches_cntnts').append('<div id="waiting2"></div>');  
				    }
				    post_top=$("#waiting2").position().top;
				    if(post_top<0) {
				      post_top=Math.abs(post_top);
  				      post_top=post_top+parseInt(10);
			        }else
			        {
				      post_top=0;
			        }
				    $('body.page-dashboard #in-active #ur_srches_cntnts #waiting2').css({top:post_top+"px"});
				    $.post("sav_dshbrd_ordr", { list: id, rcvd_id: rcvd_id, weights: $(this).sortable('serialize') },function(data){
				      $('body.page-dashboard #in-active #ur_srches_cntnts').attr('style', 'overflow: auto!important');
				      $('body.page-dashboard #in-active #ur_srches_cntnts #waiting2').remove();
				      if(data>=12)
				      {	
  	                    $("#dialog-message").dialog("option","title","Alert");
			            $("#dialog-message #c_msg").text("Dashboard has 12 items limit.");
				        $("#dialog-message").dialog("open");
                        $("#ur_srches_inact_no_data").hide();
				        $(ui.sender).sortable('cancel');		
				      }
				      else
				      {
					    $("body.page-dashboard #dshbrd_items #"+drg_id+" .tt-x-cust").hide();
				        $("body.page-dashboard #dshbrd_items #"+drg_id+" .s-title").show();
   				        $("body.page-dashboard #dshbrd_items #"+drg_id+" a.move").show();
 				        $("body.page-dashboard #dshbrd_items #"+drg_id+" a.remove").show();
				      }
				    } );//post ends
			     }//dashboard listings
		     },//update ends here
		     placeholder: "ui-state-highlight col-md-3 col-sm-4 col-xs-12",
  	         connectWith: ".menu",
			 tolerance: "pointer",
			 receive: function(event, ui) {
		       if($("#dshbrd_items li").length>0) {
		         $("#no_dshbrd_item").hide();
		       }
		       if($("#ur_srches_inact li").length==0) {
		         $("#ur_srches_inact_no_data").show();
		       }
             },
			 start: function() {
		       $('body.page-dashboard #in-active #ur_srches_cntnts').attr('style', 'overflow: hidden!important');
             },
			 stop: function() {
			   $('body').children('.tooltips_wrpr').remove();	 
		       $('body.page-dashboard #in-active #ur_srches_cntnts').attr('style', 'overflow: auto!important');
             },
			 scroll : false,
	       }).disableSelection();
		 }
	   });//ajax ends
	  }//visible if
    });//click ends
	//your searches inactive code ends here

	//your stardard list inactive code starts here
    $("body.page-dashboard #in-active h3#stndrd_lsts").click(function(){
	   //loader
	   if(!$("body.page-dashboard #in-active #stndrd_lsts_cntnts").is(':visible') ) {
	     if($('body.page-dashboard #in-active #stndrd_lsts_cntnts div#waiting').length==0) {
		   $('body.page-dashboard #in-active #stndrd_lsts_cntnts').attr('style', 'overflow: hidden!important');	 
	       $('body.page-dashboard #in-active #stndrd_lsts_cntnts').html('<div id="waiting"></div>');
	     }
		 $('body.page-dashboard #in-active #stndrd_lsts_cntnts').attr('style', 'overflow: auto!important');	 
	     $.ajax({
		   type: "POST",
		   url: "/stndrd_lsts_inact",
		   success: function(msg){
		     $("body.page-dashboard #in-active #stndrd_lsts_cntnts").html(msg);
  	 	     $("#dshbrd_items, #stndrd_lsts_inact").sortable({
		       update: function(event, ui) {
			     id=$(this).attr('id');
			     drg_id = ui.item.attr('id');
				 drg_id_arr=drg_id.split("_");
				 rcvd_id=drg_id_arr[1];
			     if(id=="dshbrd_items"){
			 	   if($('body.page-dashboard #in-active #stndrd_lsts_cntnts #waiting2').length==0) {
                     $('body.page-dashboard #in-active #stndrd_lsts_cntnts').append('<div id="waiting2"></div>');  
				    }
				    post_top=$("#waiting2").position().top;
				    if(post_top<0) {
				      post_top=Math.abs(post_top);
  				      post_top=post_top+parseInt(10);
			        }else
			        {
				      post_top=0;
			        }
				    $('body.page-dashboard #in-active #stndrd_lsts_cntnts #waiting2').css({top:post_top+"px"});
				    $.post("sav_dshbrd_ordr", { list: id, rcvd_id: rcvd_id, weights: $(this).sortable('serialize') },function(data){
				      $('body.page-dashboard #in-active #stndrd_lsts_cntnts').attr('style', 'overflow: auto!important');
				      $('body.page-dashboard #in-active #stndrd_lsts_cntnts #waiting2').remove();
				      if(data>=12)
				      {	
  	                    $("#dialog-message").dialog("option","title","Alert");
			            $("#dialog-message #c_msg").text("Dashboard has 12 items limit.");
				        $("#dialog-message").dialog("open");
                        $("#stndrd_lsts_inact_no_data").hide();
				        $(ui.sender).sortable('cancel');		
				      }
				      else
				      {
					    $("body.page-dashboard #dshbrd_items #"+drg_id+" .tt-x-cust").hide();
				        $("body.page-dashboard #dshbrd_items #"+drg_id+" .s-title").show();
   				        $("body.page-dashboard #dshbrd_items #"+drg_id+" a.move").show();
 				        $("body.page-dashboard #dshbrd_items #"+drg_id+" a.remove").show();
				      }
				    } );//post ends
			     }//dashboard listings
		     },//update ends here
		     placeholder: "ui-state-highlight col-md-3 col-sm-4 col-xs-12",
  	         connectWith: ".menu",
			 tolerance: "pointer",
			 receive: function(event, ui) {
		       if($("#dshbrd_items li").length>0) {
		         $("#no_dshbrd_item").hide();
		       }
		       if($("#stndrd_lsts_inact li").length==0) {
		         $("#stndrd_lsts_inact_no_data").show();
		       }
             },
			 start: function() {
		       $('body.page-dashboard #in-active #stndrd_lsts_cntnts').attr('style', 'overflow: hidden!important');
             },
			 scroll : false,
	       }).disableSelection();
		 }
	   });//ajax ends
	  }//visible if
    });//click ends
	//your stardard list inactive code ends here

	//your standard searches inactive code starts here
    $("body.page-dashboard #in-active h3#stndrd_srches").click(function(){
	   //loader
	   if(!$("body.page-dashboard #in-active #stndrd_srches_cntnts").is(':visible') ) {
	     if($('body.page-dashboard #in-active #stndrd_srches_cntnts div#waiting').length==0) {
		   $('body.page-dashboard #in-active #stndrd_srches_cntnts').attr('style', 'overflow: hidden!important');	 
	       $('body.page-dashboard #in-active #stndrd_srches_cntnts').html('<div id="waiting"></div>');
	     }
		 $('body.page-dashboard #in-active #stndrd_srches_cntnts').attr('style', 'overflow: auto!important');	 
	     $.ajax({
		   type: "POST",
		   url: "/stndrd_srches_inact",
		   success: function(msg){
		     $("body.page-dashboard #in-active #stndrd_srches_cntnts").html(msg);
  	 	     $("#dshbrd_items, #stndrd_srches_inact").sortable({
		       update: function(event, ui) {
			     id=$(this).attr('id');
			     drg_id = ui.item.attr('id');
				 drg_id_arr=drg_id.split("_");
				 rcvd_id=drg_id_arr[1];
			     if(id=="dshbrd_items"){
			 	   if($('body.page-dashboard #in-active #stndrd_srches_cntnts #waiting2').length==0) {
                     $('body.page-dashboard #in-active #stndrd_srches_cntnts').append('<div id="waiting2"></div>');  
				    }
				    post_top=$("#waiting2").position().top;
				    if(post_top<0) {
				      post_top=Math.abs(post_top);
  				      post_top=post_top+parseInt(10);
			        }else
			        {
				      post_top=0;
			        }
				    $('body.page-dashboard #in-active #stndrd_srches_cntnts #waiting2').css({top:post_top+"px"});
				    $.post("sav_dshbrd_ordr", { list: id, rcvd_id: rcvd_id, weights: $(this).sortable('serialize') },function(data){
				      $('body.page-dashboard #in-active #stndrd_srches_cntnts').attr('style', 'overflow: auto!important');
				      $('body.page-dashboard #in-active #stndrd_srches_cntnts #waiting2').remove();
				      if(data>=12)
				      {	
  	                    $("#dialog-message").dialog("option","title","Alert");
			            $("#dialog-message #c_msg").text("Dashboard has 12 items limit.");
				        $("#dialog-message").dialog("open");
                        $("#stndrd_srches_inact_no_data").hide();
				        $(ui.sender).sortable('cancel');		
				      }
				      else
				      {
					    $("body.page-dashboard #dshbrd_items #"+drg_id+" .tt-x-cust").hide();
				        $("body.page-dashboard #dshbrd_items #"+drg_id+" .s-title").show();
   				        $("body.page-dashboard #dshbrd_items #"+drg_id+" a.move").show();
 				        $("body.page-dashboard #dshbrd_items #"+drg_id+" a.remove").show();
				      }
				    } );//post ends
			     }//dashboard listings
		     },//update ends here
		     placeholder: "ui-state-highlight col-md-3 col-sm-4 col-xs-12",
  	         connectWith: ".menu",
			 tolerance: "pointer",
			 receive: function(event, ui) {
		       if($("#dshbrd_items li").length>0) {
		         $("#no_dshbrd_item").hide();
		       }
		       if($("#stndrd_srches_inact li").length==0) {
		         $("#stndrd_srches_inact_no_data").show();
		       }
             },
			 start: function() {
		       $('body.page-dashboard #in-active #stndrd_srches_cntnts').attr('style', 'overflow: hidden!important');
             },
			 stop: function() {
			   $('body').children('.tooltips_wrpr').remove();	 
		       $('body.page-dashboard #in-active #stndrd_srches_cntnts').attr('style', 'overflow: auto!important');
             },
			 scroll : false,
	       }).disableSelection();
		 }
	   });//ajax ends
	  }//visible if
    });//click ends
	//your standard searches inactive code ends here
	
	//drag requests completions
  
   //tooltip starts
   $(document).on('mouseover','body.page-dashboard .tt-x-cust',function(e){
     tooltip=$(this).attr('tooltip');
     $('body').append('<div class="tooltips_wrpr">'+tooltip+'</div>');
	 $('body').children('.tooltips_wrpr').css({
	   position:'absolute',
     });
   });
   $(document).on('mousemove','body.page-dashboard .tt-x-cust',function(e){
     $('body').children('.tooltips_wrpr').css({'top': e.pageY-45, 'left': e.pageX-20});   
   });
  $(document).on('mouseout click','body.page-dashboard .tt-x-cust',function(e){
     $('body').children('.tooltips_wrpr').remove();
   });
   //tooltip ends
 
   
   //msg box
    $("#dialog-message" ).dialog({
	  modal: true,	
	  draggable: false,	
      autoOpen: false,	
   	  resizable: false,
      show: {
	   effect: "blind",
	 },
    });
	
   //confrm box
   $("#dialog-confirm").dialog({
	   modal: true,
	   draggable: false,
       autoOpen: false,	
	   resizable: false,
       height:150,
       show: {
	   effect: "blind",
	   },
       buttons: {
         "Ok": function() {
	       func=$("#dialog-confirm #func").val();

   	       if(func=="clr_dshbrd") {
		     $.post("clr_dshbrd",function(data){
  			   $("#dshbrd_items").html('<div style="" id="no_dshbrd_item">No records found, drag and drop here.</div>');
			   $("#dialog-message #c_msg").text("Dashboard cleared.");
 	           $("#dialog-message").dialog("open");
   			   window.location.reload();
			 } );
		   }else if(func=="updt_dshbrd") {
		     $.post("updt_dshbrd",function(data){
			   $("#dialog-message #c_msg").text("Dashboard updated.");
 	           $("#dialog-message").dialog("open");
			   window.location.reload();
			 } );
		   }
           $( this ).dialog( "close" );
	     },
         Cancel: function() {
           $( this ).dialog( "close" );
         }
        }
    });
   
   //dashboarh clear func
   $(document).on('click',"body.page-dashboard #dshbrd_ctrls li#clr_dshbrd input",function(e){
     //jquery ui confirmation box
	 $("#dialog-confirm #cc_msg").text("Do you really want to clear dashboard?");
	 $("#dialog-confirm #func").val("clr_dshbrd");
     $("#dialog-confirm").dialog("open");
   });

   //dashboarh update func
   $(document).on('click',"body.page-dashboard #dshbrd_ctrls li#updt_dshbrd input",function(e){
     $("#dialog-confirm #cc_msg").text("Do you really want to update dashboard? It will replace with standard items.");
	 $("#dialog-confirm #func").val("updt_dshbrd");
     $("#dialog-confirm").dialog("open");
  });
   
  //removing overlay div
  $("body.page-dashboard #page-fade").remove(); 
   
  //map profile similar people tab add list
  if($('body.page-dashboard div.save-list').length==0) { 
    $('body.page-dashboard').append('\
      <div id="modal-without-animation" class="modal lists list-detail in save-list">\
  <div class="modal-dialog">\
    <div class="modal-content">\
      <div class="modal-header">\
        <a href="javascript:;" aria-hidden="true" data-dismiss="modal" class="close btn btn-xs btn-icon btn-circle btn-danger">x</a>\
        <h4 class="modal-title">Add to List</h4>\
       </div>\
       <div class="validation-error"></div>\
       <div class="modal-body">\
         <input type="radio" name="optionsRadios" value="option2" class="radio-select-list" checked="">\
         <label class="radio-inline list-length select-add-list">\
           <select size="1" name="length">\
             <option selected="selected" value="">Select a List</option>\
           </select>\
		   </label>\
		   <label class="radio-inline new">\
         <input type="radio" name="optionsRadios" value="option1" class="mx-len-init">\
           Create New List\
         </label>\
         <span class="new-list" id="new-list">\
           <input type="email" value="" class="form-control list-title chk-max-chrz" placeholder="List Name"><p class="chrz-rmng"></p>\
                  <input type="hidden" class="max-chrz-allwd" value="60"> \
           <textarea class="form-control list-desc" placeholder="Optional Description" rows="5"></textarea><p></p>\
           <input type="email" value="" class="form-control list-tags" placeholder="Optional Tags">\
		   <p class="tags-example">Example: funny, bungee jumping, "Company, Inc.".</p>\
           <input type="hidden" value="" class="twitter-id">\
         </span>\
       </div>\
       <div class="modal-footer m-t-0">\
         <a class="btn btn-sm btn-primary" href="javascript:;">Save</a>\
         <a data-dismiss="modal" class="btn btn-sm btn-white" href="javascript:;">Cancel</a>\
       </div>\
     </div>\
   </div>\
</div>\
	  \
	<div id="modal-alert" class="modal fade list-detail lists in" style="display: none;" aria-hidden="false">\
  <div class="modal-dialog">\
    <div class="modal-content">\
      <div class="modal-header">\
        <a href="javascript:;" aria-hidden="true" data-dismiss="modal" class="close btn btn-xs btn-icon btn-circle btn-danger">x</a>\
          <h4 class="modal-title">Success</h4>\
       </div>\
       <div class="modal-body">\
       <p><img width="50" height="50" alt="" src="" style="float: left; margin-right: 10px;"> <span id="twir-uname">Dick Beahrs</span> has been added to <span class="text-info list-name"><b>SF Bay Area Influencers</b></span></p>\
       </div>\
    </div>\
  </div>\
</div>');
  }
  
  //check view port 
/*  jQuery.fn.isOnScreen = function(){
    var viewport = {};
    viewport.top = jQuery(window).scrollTop();
    viewport.bottom = viewport.top + jQuery(window).height();
    var bounds = {};
    bounds.top = this.offset().top;
    bounds.bottom = bounds.top + this.outerHeight();
    return ((bounds.top <= viewport.bottom) && (bounds.bottom >= viewport.top));
  }
  
  var rq_snt = [];
  $("body.page-dashboard ul#dshbrd_items li.save_search").each(function( index ) {
    dsh_itm=$(this).attr('id');
	if(jQuery("#"+dsh_itm).isOnScreen(0.2, 0.2)) {
	  rq_snt.push(dsh_itm);
	}
  });
  $(window).scroll(function(evt){
  	$("body.page-dashboard ul#dshbrd_items li.save_search").each(function( index ) {
      dsh_itm=$(this).attr('id');
	  if(jQuery("#"+dsh_itm).isOnScreen(0.2, 0.2) && jQuery.inArray(dsh_itm, rq_snt)==-1){//-1 not found
		rq_snt.push(dsh_itm);
		//alert($("body.page-dashboard #dshbrd_items #"+dsh_itm).find( 'input[name=qry_str]').val());
		get_map(dsh_itm);
	  }
	});
  });
*/ 


   //mx limit check
   $(".mx-len-init").on("click", function(e) {
	   if($(this).attr('type')=="radio") {
	     wndow_id='#new-list';
	   }
	   else {
	     wndow_id=$(this).attr('href');
		 if(wndow_id=="#modal-save-search")
		   $(wndow_id+' .chk-max-chrz').val("");
	   }
	   prvded=$(wndow_id+' .chk-max-chrz').val().length;
	   max_allowed=$(wndow_id+" .max-chrz-allwd").val();  
	   if(prvded>0) {
	     remaining=max_allowed-prvded;
	     $(wndow_id+" .chrz-rmng").text('Remaining '+remaining);
	   }
	   else {
	     $(wndow_id+" .chrz-rmng").text('Max. allowed '+max_allowed);
	   }
   });
   $(".chk-max-chrz").on("keyup", function(e) {
 	 max_allowed=$(".max-chrz-allwd").val();  
     prvded=$(this).val().length;
	 remaining=max_allowed-prvded;
	 if(remaining<0) {
	   remaining=0;
	 }
	 $(".chrz-rmng").text('Remaining '+remaining);
     if(remaining<=0) {
       $(this).val($(this).val().substr(0, max_allowed));
 	 }
   });
   //mx limit check ends



  //user drop down close
  $("body").live( "click", function(e) {
	if($(e.target).closest("#block-block-1").length==0) {
	  $("ul.dropdown-menu").hide();
	}
  });
  $(document).keydown(function(e) {
    if (e.keyCode == 27) {   // esc
      $("ul.dropdown-menu").hide();
    }  
  });
  //user drop down close ends here
  
  
  //fed page prod. default icon
  $('body#pid-fed-search div.fed-products div.panel-body .image-span img[src="theme/assets/avatars/cb-prod2.png"]').each(function(i){
     $(this).parent().parent().css({"height":"auto"}); 
  }); 
  //fed page prod. default icon ends
  
 });//ready ends
})(jQuery);
  