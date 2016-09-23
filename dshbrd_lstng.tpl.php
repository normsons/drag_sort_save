<?php

/**
 * @file
 * This file actually generating the dashboard page layout
 *
 * Available variables:
 * - $node->nid: holds node id
 * - $node->type: holds node type
 * - $node->field_search_url["und"][0]["value"]: holds save search url
 * - $user->uid:  holds uid of current logged user
 * - $user->roles: an array containg roles in the system
 */

//firstname lastname fancybox files req.
$mod_path = drupal_get_path('module', 'custom_plenz_components');
drupal_add_css($mod_path.'/includes/assets/css/light/jquery.fancybox.css');
drupal_add_js($mod_path.'/includes/assets/js/lightbox/jquery.fancybox.js');
drupal_add_js($mod_path.'/includes/assets/js/flot/jquery.flot.min.js');
drupal_add_js($mod_path.'/includes/assets/js/flot/jquery.flot.pie.min.js');
drupal_add_js($mod_path.'/includes/assets/js/flot/jquery.flot.resize.min.js');
drupal_add_js($mod_path.'/includes/assets/js/mycustomjs.js');

?>
<script type="text/javascript">
  jQuery(document).ready(function() {  
    //username click popup dashboard
    jQuery('body.page-dashboard .text-info .fancybox').fancybox({
	    helpers: { overlay: { locked: true } },
	    beforeLoad: function() {
          jQuery(this).attr('href', jQuery(this).attr('href')+'&fbox');
        },
	    minWidth	:	960,
	    minHeight	:	400,
	    fitToView	: false,
	    width		  : '80%',
	    height		: '550',
	    autoSize	: false,
	    padding		:	[32, 0, 10, 0],
     });
 });

</script>

<ul class="menu"  id="dshbrd_items">
<?php
global $user;
$chk_qry = db_select('dashboard_listing', 'dblstng');
$chk_qry->join('node','nod','dblstng.nid = nod.nid');
$chk_qry->condition('nod.status',1, '=');
$chk_qry->condition('dblstng.uid',$user->uid, '=');
$chk_qry->condition('dblstng.lstd',1, '=');
$chk_qry->fields('nod', array('nid'));
$chk_qry->orderBy('dblstng.wght', 'ASC');
$total_recs = $chk_qry->execute()->rowCount();
if($total_recs > 0) {
  $results = $chk_qry->execute();
  foreach ($results as $result): 
    $node = node_load($result->nid);
    if($node->type == "save_search") {
      $title_lnk=$node->field_search_url["und"][0]["value"]."&nid=".$node->nid;  
	}


	
?>
  <li id="srch_<?php echo $node->nid;?>" class="<?php echo strtolower($node->type); ?> col-md-3 col-sm-4 col-xs-12 m-t-0 p-0">
    <div id="sv_srch_wrpr" class="p-10 m-r-5 m-b-10 m-l-5">
      <div class="mv_wrpr"><a class="move tt-x-cust"  id="move-<?php echo $node->nid; ?>" tooltip="Move">Move</a></div>
      <div class="rmv_wrpr"><a class="remove tt-x-cust" style="cursor:pointer; float:right;" id="<?php echo $node->nid;?>" tooltip="Remove">Remove</a></div>
      <div id="title">
        <h1><a href="<?php echo $title_lnk; ?>" target="_blank"><?php echo htmlspecialchars(drupal_substr($node->title, 0, 40));?></a></h1>
      </div>
      <?php  
if ($node->type=="save_search") {  
  echo save_search_view($node->nid);	  
}
?>
    </div>
  </li>
  <?php
  endforeach; ?>
  <div id="no_dshbrd_item" style="display: none;">No records found, drag and drop here.</div>
  <?php
}
else{
?>
  <div id="no_dshbrd_item">No records found, drag and drop here.</div>
  <?php }?>
</ul>
<div id="in-active" style="display:none;">
  <ul id="dshbrd_ctrls">
<?php
if ( !in_array('editor', $user->roles) ) {
?>
    <li id="updt_dshbrd">
      <input type="button" value="Update Dashboard">
    </li>
<?php
}
?>
    <li id="clr_dshbrd">
      <input type="button" value="Clear Dashboard">
    </li>
  </ul>
  <div id="accordion">
    <h3 id="ur_srches">Your Saved Searches</h3>
    <div id="ur_srches_cntnts"></div>
<?php
if ( !in_array('editor', $user->roles) ) {
?>
    <h3 id="stndrd_srches">Standard Searches</h3>
    <div id="stndrd_srches_cntnts"></div>
    <?php
}
?>
  </div>
  
  <!--confirmation-->
  <div id="dialog-confirm" title="Confirmation?" style="display:none;">
    <p><span class="ui-icon ui-icon-alert" style="float:left; margin:0 7px 20px 0;"></span><span id="cc_msg"></span>
      <input type="hidden" id="func" value="">
    </p>
  </div>
  <!--#confirmation-->
  
  <!--success-->
  <div id="dialog-message" title="Success" style="display:none;">
    <p> <span class="ui-icon ui-icon-circle-check" style="float:left; margin:0 7px 50px 0;"></span> <span id="c_msg"></span> </p>
  </div>
  <!--#success-->
</div>
