


  'use strict';

  var ENTER_KEY = 13;

  // EDITING STARTS HERE (you dont need to edit anything above this line)
var db ;
  var remoteCouch ;
function createDatabase(){
   db = new PouchDB("workingtime");
    remoteCouch = 'http://li707-122.members.linode.com:5984/workingtime';

  db.info(function(err,info){
    db.changes({
      since: info.update_seq,
      live: true
    }).on("change", getWTItems());

  });
   
}


function WorkingTime(){
  this.employee = 0;
  this.captcheckin = new Blob();
  this.checkin = new Date();
  this.captcheckout = null;
  this.checkout = null;
}


  // We have to create a new todo document and enter it in the database
  /*
  function addTodo(text) {
    var todo = {
        _id: new Date().toISOString(),
        title: text,
        completed: false
    };
    db.put(todo, function callback(err,result){
      if(err){
        console.log("Exito! todo cargado");
      }
    });

  }

  // Show the current list of todos by reading them from the database
  function showTodos() {
    db.allDocs({
      include_docs: true, descending:true}, function (err,doc){
        //redrawTodosUI(doc.rows);
    });
  }
*/
/*
  function checkboxChanged(todo, event) {
    todo.completed = event.target.checked;
    db.put(todo);
  }
*/
  // User pressed the delete button for a todo, delete it
  /*
  function deleteButtonPressed(todo) {
    db.remove(todo);
  }
*/
  // The input box when editing a todo has blurred, we should save
  // the new title or delete the todo if the title is empty
  /*
  function todoBlurred(todo, event) {
    var trimmedText = event.target.value.trim();
    if(!trimmedText){
      db.remove(todo);
    }else{
      todo.title = trimmedText;
      db.put(todo);
    }
  }
*/
  // Initialise a sync with the remote server
  function sync() {
   showInfoMsg("syncing");
   console.log("entra a sync");
    var opts = {live: true};
    db.replicate.to(remoteCouch,opts,showErrMsg);
    db.replicate.from(remoteCouch,opts,showErrMsg).on("complete", getWTItems);

  }


  // EDITING STARTS HERE (you dont need to edit anything below this line)

  // There was some form or error syncing
/*
  function syncError() {
    syncDom.setAttribute('data-sync-state', 'error');
  }
*/
  // User has double clicked a todo, display an input so they can edit the title
  /*
  function todoDblClicked(todo) {
    var div = document.getElementById('li_' + todo._id);
    var inputEditTodo = document.getElementById('input_' + todo._id);
    div.className = 'editing';
    inputEditTodo.focus();
  }

  // If they press enter while editing an entry, blur it to trigger save
  // (or delete)
  function todoKeyPressed(todo, event) {
    if (event.keyCode === ENTER_KEY) {
      var inputEditTodo = document.getElementById('input_' + todo._id);
      inputEditTodo.blur();
    }
  }
*/
  // Given an object representing a todo, this will create a list item
  // to display it.

/*
  addEventListeners();
  showTodos();

  if (remoteCouch) {
    sync();
  }
*/
