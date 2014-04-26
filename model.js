
var database ;

$( document ).ready( function(){
	initDatabase();

});


var initDatabase = function () {
var request = window.indexedDB.open('test-webcam', 1);
request.onerror = function(event) {
	showErrMsg("El navegador no soporta IndexedDB :/ "+JSON.stringify(event));
};
request.onsuccess = function(event) {

	database = request.result;
  getWTItems();
request.onerror = function ( event ){
	showErrMsg("Database error! "+event.target.errorCode);

};


};


request.onupgradeneeded = function (event){

	  var db = event.target.result;

  var usuarios = db.createObjectStore("workingtime", { autoIncrement: true });
  usuarios.createIndex("idwt", "idwt", { unique: false });  
  usuarios.createIndex("captcheckin", "captcheckin", { unique: false });
    usuarios.createIndex("checkin", "checkin", { unique: false });
    usuarios.createIndex("captcheckout", "captcheckout", { unique: false });
    usuarios.createIndex("checkout", "checkout", { unique: false });

};

};

function WorkingTime(){
  this.idwt=1;
  this.captcheckin = new Blob();
  this.checkin = new Date();
  this.captcheckout = null;
  this.checkout = null;
}

function saveToDB(data){

    if(data) {

        var checkin = new WorkingTime();
  checkin.captcheckin = data;
        var transac = database.transaction(["workingtime"],"readwrite");
      var checkins = transac.objectStore("workingtime");

    var request = checkins.add(checkin);
    transac.oncomplete = function (event) {

      console.log("Exito! WT agregado ");
    };      
    transac.onerror = function(event){
      console.log("Error de IndexedDB al agregar un nuevo WT");
    }
    request.onsuccess = function(event){
          console.log("result del add "+JSON.stringify(event.target.result));
        updateObjectKey(event.target.result);
}

  }else {
    console.log("data es nulo");
   }

}


function updateObjectKey(key){
    //get the object with that key
    var transac  = database.transaction(["workingtime"],"readwrite");
    var wts = transac.objectStore("workingtime");
    var request = wts.get(key);
    request.onsuccess = function(event){
      updateObjectID(request.result,transac,key);

    };
    request.onerror = function (event){
      console.log("error en updateKey");
    };

}


function updateObjectID(wt, transaction,key){
  wt.idwt = key;
  var wts = transaction.objectStore("workingtime");
  console.log("Valor del wt "+JSON.stringify(wt)+"     valor del key "+key);
  var request = wts.put(wt,key);
  request.onsuccess = function (event){

  }
  request.onerror = function(event){
    console.log("error en updateObjectID");
  }
  transaction.oncomplete = function(event){
        getWTItems();

  };
}