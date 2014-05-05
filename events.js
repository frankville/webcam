$(document).ready(function() {
showInfoMsg("Todo Listo! ingresa tu id ");
	createDatabase();

$("#formulario").submit(function(event ){
	event.preventDefault();
		
		try {
			if($("#campo").val() != ""){
				var employee = parseInt($("#campo").val());
				isACheckin(employee);
				$("#campo").val("");				
			}
		}catch (error){
			console.log("error en submit "+error);	
		}
	
});



}) ;



  function doCheckin(employee) {
    var canvas = $("#cuadro")[0];
    canvas.width = video.getAttribute("width");
    canvas.height = video.getAttribute("height");
    canvas.getContext('2d').drawImage(video, 0, 0, video.getAttribute("width"), video.getAttribute("height"));
    var data = canvas.toDataURL('image/png');
    performCheckin(data,employee);
  }

  function getWTItems(){	
  	console.log("entra a getWTItems");
  	sync();
	db.allDocs({
    	include_docs: true, descending:true}, function (err,doc){
       	reloadwts(doc.rows);
    });

};

function isACheckin(employee){
	var flag = true;
	db.allDocs({
      include_docs: true, descending:true}, function (err,docs){
        for (var i = 0; i < docs.rows.length; i++) {
       		if(docs.rows[i].doc.employee == employee ){
       			console.log("entra al if 1");
       			if(docs.rows[i].doc.checkout === null){
       				console.log("entra al if 2");
       				    	console.log("hace checkout");

       				doCheckout(employee);
       				return;
       			}
       		}

        };

    	console.log("hace checkin");
    	doCheckin(employee);
       
    });
    
}

function performCheckin(img,employee){
	var wt = new WorkingTime();
	wt.employee = employee;
	wt.captcheckin = img;
	wt.checkin = new Date();
	db.post(wt, function(err, response){
		if(err){
			console.log("error al checkin! "+err);
		}else{
		
			getWTItems();
		}
	})
}

function performCheckout(img,employee){
db.allDocs({
      include_docs: true, descending:true}, function (err,docs){
      	if(err){
      		console.log("error al performCheckout! "+err);
      	}else{
	        for (var i = 0; i < docs.rows.length; i++) {
       		if(docs.rows[i].doc.employee == employee ){
       			docs.rows[i].doc.captcheckout = img;
       			docs.rows[i].doc.checkout = new Date();
       			console.log("valor del doc "+docs.rows[i].doc);
       			db.put(docs.rows[i].doc, function(errUpdate, respUpdate){
       				if(errUpdate){
       					console.log("error en update!! "+errUpdate);
       				}else{
       					getWTItems();      		
       				}
       			});
       		}
        };
      	};
    });

}
  

var reloadwts = function(wts){
	$("#lista tbody tr").remove();

	// Check to see if we have any results.
	if (!wts){
	return;
	}
	for(var i=0;i < wts.length; i++){
		var row = "<tr>";

    var imgCheckin = wts[i].doc.captcheckin;
	var imgCheckout = wts[i].doc.captcheckout;
    var imgChin = "<img src='"+imgCheckin+"' width='100' height='100' class='snapshot' >";
    var imgChout = "";
    if(wts[i].doc.captcheckout != null){
    	imgChout="<img src='"+imgCheckout+"' width='100' height='100' class='snapshot' >";
    }
    row = row +
		"<td id='idwt'>"+(i+1)+"</td>"+
		"<td>"+wts[i].doc.employee+"</td>"+
		"<td>"+imgChin+"</td>"+
		"<td>"+wts[i].doc.checkin+"</td>"+
		"<td>"+imgChout+"</td>"+
		"<td>"+wts[i].doc.checkout+"</td>"+
		"<td>"+"<button>x</button></td>"+
		"</tr>";
		$("#lista").append(row);

	};
	$('#lista tbody tr :button').click(function(e){
			console.log("valor closest "+$(this).closest('tr').html());
		var id = $(this).closest('tr').find("#idwt").text();
		$(this).closest('tr').remove();

 				deleteWT(id);
	});
};

function deleteWT(wt){
	var transaction = database.transaction(["workingtime"], "readwrite");
     var wts = transaction.objectStore("workingtime");
    var request =  wts.delete(parseInt(wt));
	request.onsuccess = function(event) {
	};
	transaction.oncomplete = function (event ){
		getWTItems();
	}
};

  function doCheckout(employee) {
    var canvas = $("#cuadro")[0];
    canvas.width = video.getAttribute("width");
    canvas.height = video.getAttribute("height");
    canvas.getContext('2d').drawImage(video, 0, 0, video.getAttribute("width"), video.getAttribute("height"));
    var data = canvas.toDataURL('image/png');
    performCheckout(data,employee);

  }

function showErrMsg(msg){

		$("#info").text(msg);
		$("#info").removeClass("alert-info");
		$("#info").removeClass("alert-success");
		$("#info").addClass("alert-danger");
		$("#info").fadeIn("fast");
	setTimeout(function(){
		$("#info").fadeOut("slow");
	},5000);
}

function showSuccessMsg(msg){

			$("#info").text(msg);
		$("#info").removeClass("alert-info");
		$("#info").removeClass("alert-danger");
		$("#info").addClass("alert-success");
		$("#info").fadeIn("fast");
	setTimeout(function(){
		$("#info").fadeOut("slow");
	},5000);
}

function showInfoMsg(msg){
	console.log("entra aca");
			$("#info").text(msg);
		$("#info").removeClass("alert-success");
		$("#info").removeClass("alert-danger");
		$("#info").addClass("alert-info");
		$("#info").fadeIn("fast");
	setTimeout(function(){
		$("#info").fadeOut("slow");
	},5000);

}
