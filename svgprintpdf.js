var snp = Snap("#svg_div");

$(document).ready(function(){
  Snap.load('./svg/20161160FA024.svg', onSVGLoaded ) ;
});

function onSVGLoaded( data ){
    // console.log('onSVGLoaded called');
		console.log(data);
    // Reset variables
    var htspt;
    var TextArray = [];
    var TextBboxWidth = [];
    var TextBbox = [];
    var HotspotBbox  = [];

    snp.append( data );

    var essevg = Snap.selectAll('svg');
  	essevg[0].attr({width:"100%", height:"100%", viewBox:"0, 0, 210, 150" });
  	essevg[1].attr({width:"100%", height:"100%", viewBox:"0, 0, 210, 150" });

    /**/
    /* Get all the hotspot elements */
    /**/
    htspt = Snap.selectAll('[id^="hotspot."]'); // type set
    htspt.forEach(function(el) {
      //
      // el.attr({
      //   opacity: 0.5, // or dash-separated names
      // });

      // The hotspots are groups of paths
      var path = el.selectAll('path'); // Select all the paths inside the clicked path
      var pathindex = 0;
      var arr = [];
      // convert each path to an array
      // get the maximum right element of the clicked path
      // the maximum right element is the label of the clicked hotspot
      path.forEach(function(node) {
        var d = node.toString();
        arr = Snap.parsePathString(d);
        var maxX = 0;
        $.each(arr, function(index, value) {
          if (value[0] == 'M') {
            var Mpath = arr[index];
            if(Mpath[1] > maxX){
              maxX = Mpath[1];
              pathindex = index;
            }
          }
        });
      });
      // create a label equal closed path element
      var equal = [];
      var end = 0;
      var sem = 0;
      var sliced = arr.slice(pathindex);
      // console.log(navigator.appVersion);
      sliced.forEach(function (val, index) {
        if (navigator.appVersion.indexOf("MSIE") != -1 || navigator.appVersion.indexOf("Trident") != -1 || navigator.appVersion.indexOf("Edge") != -1 ) {
        // if (navigator.appVersion.indexOf("MSIE") != -1 || navigator.appVersion.indexOf("Edge") != -1 ) {
          if (val == 'Z' && sem == 0) {
                end = index;
                sem = 1;
          }
        } else {
          if (val[0] == 'z' && sem == 0) {
                end = index;
                sem = 1;
          }
        }
      });
      for (i = pathindex; i < pathindex+end; i++) {
        equal.push(arr[i]);
      }
      equal.push('z');

      var bb = Snap.path.getBBox(equal);
      HotspotBbox.push({
        element: el,
        bbox: bb
      })

    });

    console.log(HotspotBbox);

    text = Snap.selectAll('text'); // type set
    // console.log(text);
    // var max = Math.max.apply(Math,TextBboxWidth);
    // console.log('MAX');
    // console.log(TextBboxWidth);
    // console.log(max);
    text.forEach(function(el) {
      // Calculate bbox and fill the TextArray object
      console.log(el.node.textContent);
      var bbox = el.getBBox();
      // console.log(bbox.cx);
      // console.log(bbox.cy);
      if ($.urlParam('code') == el.node.textContent) {
        TextArray.push({
          text : el.node.textContent,
          cx : bbox.cx,
          cy : bbox.cy
        });
      }
    });
    console.log(TextArray);

    console.log($.urlParam('code'));

    // var index =

    // var test = Snap.path.isPointInsideBBox(HotspotBbox[1].bbox,TextArray[0].cx,TextArray[0].cy)
    // console.log(test);
    // if(test){
    //   HotspotBbox[1].element.attr({
    //     opacity: 0.5, // or dash-separated names
    //   });
    // }

    $.each( HotspotBbox, function( key, value ) {
      var test = Snap.path.isPointInsideBBox(value.bbox,TextArray[0].cx,TextArray[0].cy)
      if(test){
        value.element.attr({
          opacity: 0.5, // or dash-separated names
        });
      }

    });


}

$.urlParam = function(name){
  var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
  if (results==null){
     return null;
  }
  else{
     return decodeURI(results[1]) || 0;
  }
}


// Add ecma script functionalities
function ShowHotSpot(evt,hotspotid){
  // console.log('ShowHotSpot');
  // console.log(evt); // Mouse event
	var svgDocument = evt.target.ownerDocument;
  // console.log('svgDocument');
  // console.log(svgDocument);
	var strId = "hotspot."+hotspotid;
	var hotspot = svgDocument.getElementById(strId);
  // console.log('hotspot');
  // console.log(hotspot);
	if(hotspot)
		hotspot.setAttribute("opacity",".5");
}
function HideHotSpot(evt,hotspotid) {
	var svgDocument = evt.target.ownerDocument;
	var strId = "hotspot."+hotspotid;
	var hotspot = svgDocument.getElementById(strId);
	if(hotspot)
		hotspot.setAttribute("opacity","0");

	var toolTip = svgDocument.getElementById('ToolTip');
	if(toolTip)
		toolTip.setAttribute("visibility","hidden");
}
function ShowToolTip(evt,hotspotid,strTooltip) {
	return;
}
