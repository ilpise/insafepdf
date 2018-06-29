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

    snp.append( data );

    var essevg = Snap.selectAll('svg');
	essevg[0].attr({width:"100%", height:"100%", viewBox:"0, 0, 210, 150" });
	essevg[1].attr({width:"100%", height:"100%", viewBox:"0, 0, 210, 150" });
//	essevg[1].attr({width:"100%", height:"100%", viewBox:"0, 0, 100, 120" });
//	essevg[1].attr({width:"100%", height:"100%", viewBox:"0, 0, 200, 240" });

//	essevg[1].attr({width:"100%", height:"100%", viewBox:"0, 0, 150, 180" });

    /**/
    /* Get all the hotspot elements */
    /**/
    htspt = Snap.selectAll('[id^="hotspot."]'); // type set
    htspt.forEach(function(el) {
      //
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
       // get the bounding box of the label equal element
       var bb = Snap.path.getBBox(equal);
       TextBboxWidth.push(Math.ceil(bb.width));

      el.click(function(e){ // ATTACH CLICK functionalities to hotspot elements
        // The hotspots are groups of paths
        var path = this.selectAll('path'); // Select all the paths inside the clicked path
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
        // get the bounding box of the label equal element
        var bb = Snap.path.getBBox(equal);
        // console.log(bb.x2);
        // Set variables
        var texto;
        var test = bb.cy;
        var diff, initial, newdiff;
        // Cycle on TextArray to get the min diff between cy
        $.each(TextArray, function(k,v){
          if (k == 0) {
            var inital = v.cy;
            texto = v.text;
            diff = Math.abs (test - inital);
          } else {
            var newdiff = Math.abs (test - v.cy);
            if (newdiff < diff) {
                diff = newdiff;
                texto = v.text;
            }
          }
        });

        gotop(texto, false, false);

      });
    });
    /**/
    /*  get all the text elements and create a TextArray global object
    /**/
    text = Snap.selectAll('text'); // type set
    // console.log(text); //
    var max = Math.max.apply(Math,TextBboxWidth);
    // console.log('MAX');
    // console.log(TextBboxWidth);
    // console.log(max);
    text.forEach(function(el) {
      // Calculate bbox and fill the TextArray object
      var bbox = el.getBBox();
      TextArray.push({
        text : el.node.textContent,
        cy : bbox.cy
      });
      // //ADD CART IMAGE
      var codeicet = el.node.textContent;
      if (el.node.textContent.indexOf('_') === -1 ) {
        var tx = el.transform().globalMatrix.e; // translation on x
        var ty = el.transform().globalMatrix.f; // translation on y
        var sx = el.transform().globalMatrix.a; // scaling on x
        var sy = el.transform().globalMatrix.d; // scaling on y
        if (navigator.appVersion.indexOf("MSIE") != -1 || navigator.appVersion.indexOf("Trident") != -1 || navigator.appVersion.indexOf("Edge") != -1 ) {
          // var tfwidth = 30 // This is the width of the frame around the text
          var tfwidth = max + 1
        } else {
          // var tfwidth = 29 // This is the width of the frame around the text
          var tfwidth = max
        }
        snp.image("common/carrello.jpg", 0, 0, 7, 7)
//        .transform( 't'+ ( ((bbox.x + tx) * sx) + (tfwidth*sx) ) +','+ ( ((bbox.y + ty) * sy) -5) )
		.transform( 't'+ ( ((bbox.x + tx) * sx) + (tfwidth*sx) ) +','+ ( ((bbox.y + ty) * sy) -2) )
        .click(function(){
		  setcodice(codeicet);
		})
        .attr({class:'cart'});
      }
  	});

   //AGGIUNGI HOME E BACK
   //alert(currentav +" "+ pagina);
   if (((currentav+".svg" != pagina) && (currentav != pagina)) && (pagina) && (currentav)) {

     //                                                                             x, y, width, height
     snp.image("common/back.jpg", 0, 0, 10, 10)
       //.click(function(){ gotob(); })
       .click(function(){
			var node =  $("#mytreeview").jstree('get_selected', true);
//			console.log(node);
			var parentid = node[0].parent;
			var parent = $("#"+parentid+"_anchor");
//			console.log(parent);
			var text = parent[0].innerText
//			console.log(text);
			//$('#mytreeview').jstree('select_node', parentid);
			//$("#"+node[0].id+"_anchor").removeClass('jstree-clicked');
			//$('#mytreeview').jstree('deselect_node', node );
			gotop(text, parentid, node); })
       .attr({id:'back', class:'back'});

     snp.image("common/home.jpg", 10, 0, 10, 10)
       .click(function(){ gotoh(); })
       .attr({id:'home', class:'home'});
   }

  //
  $('.back').hover(function() {
    $(this).attr('href', 'common/back_1.jpg');
  }, function() {
    $(this).attr('href', 'common/back.jpg');
  });
  //
  $('.home').hover(function() {
    $(this).attr('href', 'common/home_1.jpg');
  }, function() {
    $(this).attr('href', 'common/home.jpg');
  });
  //
  $('.cart').hover(function() {
    $(this).attr('href', 'common/carrello_1.jpg');
  }, function() {
    $(this).attr('href', 'common/carrello.jpg');
  });
  //

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

function ShowPaper()
{
  var svgDocument = getDocument();
  var paper = svgDocument.getElementById("paperID");
  if(paper)
  {
    paper.setAttribute("transform","scale(1)");
    paper.setAttribute("opacity","1");
    paper.setAttribute("visibility","visible");
  }
  var svg = svgDocument.getRootElement();
  if(svg)
  {
    svg.setAttribute("width","220.000mm");
    svg.setAttribute("height","160.000mm");
    svg.setAttribute("viewBox","-5.000000 -5.000000 220.000000 160.000000");
  }
}


function gotop(param, psid, psnode) {
  // alert("PARAMETRO DA SVG: "+param);
  // console.log('gotop');

  if (filelist.indexOf($('.jstree-clicked').text()) >= 0) {
	//	console.log('parametro ' +param+ ' in filelist');
    //previotav = $(".jstree-clicked").text();
    //alert("normale livello "+param);
    currentav = $(".jstree-clicked").text();

    if (filelist.indexOf(param) >= 0) {
	  //	  console.log('filelist');
	  //	  console.log(param);
      goto(param);

      var snp = Snap("#svg_div");
      var htspt;
      var TextArray = [];
      var cartella =$('input#matricola').val().toLowerCase();
      currentav= param;
      var tavtoload = param;
      $("#svg_div").empty();
      snp = undefined;
      snp = Snap("#svg_div");

      // define the url to load the svg from
      var url = '../xcompany/az_insafe/macchine/'+cartella+'/svg/'+currentav+'.svg';
      Snap.load(url, onSVGLoaded );

    }
  } else {

	// console.log('parametro ' +param+ ' NOT in filelist');
    //sono ultimo livello
    var hhh = $('#miniatura').attr("src");
    var hhh1 = hhh.split('/').pop().toUpperCase().replace('.JPG', '');
    //check if there is _
    if (param.indexOf('_') !== -1) {
      var desin = param.split('_')[0].toUpperCase();
      var compa = hhh1.split('_')[0].toUpperCase();
      //alert(desin+' '+compa);
      if (desin == compa) {
        //previotav = hhh1+desin;
        var cartella = $('input#matricola').val().toLowerCase();
        var calfile = '../xcompany/az_insafe/macchine/'+cartella+'/img/'+ param +'.jpg';

        $.ajax({
                url:calfile,
                type:'HEAD',
                error: function() {
                  //file not exists
                  //alert("miniatura ok" )+calfile;
                  var notta = 0;
                },
                success: function() {
                  //file exists
                  // alert("miniatura workaround"+calfile);
                  /* $('#miniatura').attr('src', calfile);
                     $('#miniatura').attr('alt', param);
                     $('#mytreeview').filter(function(){
                     return (/param/i).test($(this).text())
                     }).addClass("jstree-clicked");*/
                }
        });
      }
    }
    //alert("ultimo livello");
    //alert("vai :"+previotav);
    var instance = $.jstree.reference(this),
	node = instance.get_node(this);
	id     = node.id;

	$.ajax({
	  type:'post',
	  url:'is_treeview.php',
	  data:{ funz : 'svg', id : id },
	  dataType : "json",
	  async:false,
	  success:function(response) {
		var idcomponente  = response.idcomponente;
		var idpatron      = response.idpatron;
		var tavola        = response.tavola;
		var filesvg       = response.filesvg;
		var miniatura     = response.miniatura;
		var patron        = response.patron;
		var codcomp       = response.codcomp;

		if ( debug == 1 ){
			// $('#debug_alert').html(messaggio);
			$("#debug_alert").empty();
			$( "#debug_alert" ).append("<p>ID " + idcomponente + " </p>");
			$( "#debug_alert" ).append("<p>Parent " + idpatron + " </p>");
			$( "#debug_alert" ).append("<p>FILESVG " + filesvg + " </p>");
			$( "#debug_alert" ).append("<p>TAVOLA " + tavola + " </p>");
			$( "#debug_alert" ).append("<p>MINIATURA " + miniatura + " </p>");
		 }
		 $("#codcomp").val(codcomp);
		 $("#miniatura").attr("src",miniatura);
		 $("#miniatura").attr("alt",patron);
		 // Memorizzo
//         localStorage.setItem("last_id", idcomponente);
//         localStorage.setItem("last_parent", idpatron);
         lastlev = tavola;
       }
	 });

     //goto(lastlev);
     var tavtoload=lastlev;
     var snp = Snap("#svg_div");
     var htspt;
     var TextArray = [];
     var cartella =$('input#matricola').val().toLowerCase();
     currentav= lastlev;

     $("#svg_div").empty();
     snp = undefined;
     snp = Snap("#svg_div");

     // define the url to load the svg from
     var url = '../xcompany/az_insafe/macchine/'+cartella+'/svg/'+tavtoload+'.svg';
     //$('#svg_div').load(url);
     Snap.load(url, onSVGLoaded ) ;

   }

	if ( (psnode !== false) && (psid !== false) ){
		//console.log(psid);
		//console.log(psnode);
//		$('#mytreeview').jstree('deselect_node', psnode );
		$('#mytreeview').jstree('deselect_all');
		$('#mytreeview').jstree('select_node', psid);
	}

}

function gotob() {

  var hhh = $('#miniatura').attr("src");
  var hhh1 = hhh.split('/').pop().toUpperCase().replace('.JPG', '')
  previotav = hhh1;

  if(previotav) {
  	var tavtoload = previotav+'.svg';
  }
  else {
  	var tavtoload = pagina;
  }

  currentav=tavtoload;
  //alert(previotav);
  goto(previotav);
  var snp = Snap("#svg_div");
  var htspt;
  var TextArray = [];
  var cartella =$('input#matricola').val().toLowerCase();
  $("#svg_div").empty();
  snp = undefined;
  snp = Snap("#svg_div");

  // define the url to load the svg from
  var url = '../xcompany/az_insafe/macchine/'+cartella+'/svg/'+tavtoload;
  //$('#svg_div').load(url);
  Snap.load(url, onSVGLoaded ) ;

}

function gotoh() {
  currentav =$('input#matricola').val().toUpperCase();
  // alert($('input#matricola').val().toUpperCase());
  var snp = Snap("#svg_div");
  var htspt;
  var TextArray = [];
  var cartella =$('input#matricola').val().toLowerCase();
  $("#svg_div").empty();
  snp = undefined;
  snp = Snap("#svg_div");

  // define the url to load the svg from
  var url = '../xcompany/az_insafe/macchine/'+cartella+'/svg/'+$('input#matricola').val().toUpperCase()+'.svg';
  //$('#svg_div').load(url);
  Snap.load(url, onSVGLoaded ) ;
  gomacchina();
}



//change binding of event on tree
$("#mytreeview").bind('click', function(event){

  if (currentav != $('.jstree-clicked').text()) {
//    console.log(currentav);
    if (filelist.indexOf($('.jstree-clicked').text()) >= 0) {
      previotav = currentav;

      var snp = Snap("#svg_div");
      var htspt;
      var TextArray = [];
      var cartella =$('input#matricola').val().toLowerCase();
      currentav= $('.jstree-clicked').text();
      var tavtoload = $('.jstree-clicked').text();
      $("#svg_div").empty();
      snp = undefined;
      snp = Snap("#svg_div");

      // define the url to load the svg from
      var url = '../xcompany/az_insafe/macchine/'+cartella+'/svg/'+tavtoload+'.svg';
      //$('#svg_div').load(url);
      Snap.load(url, onSVGLoaded ) ;

     } else {
       //GET THE CLOSEST PARENT OF TREE IF NO TARGET TAV
       var uptrg = $('.jstree-clicked').closest(".jstree-open").find('a').first().text();
       var hhh = $('#miniatura').attr("src");
       var hhh1 = hhh.split('/').pop().toUpperCase().replace('.JPG', '')
       previotav = hhh1;
       gotop(previotav, false, false);
    }
  }
});
