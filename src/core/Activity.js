/*
 * This is a JavaScript Scratchpad.
 *
 * Enter some JavaScript, then Right Click or choose from the Execute Menu:
 * 1. Run to evaluate the selected text (Cmd-R),
 * 2. Inspect to bring up an Object Inspector on the result (Cmd-I), or,
 * 3. Display to insert the result in a comment after the selection. (Cmd-L)
 */

namespace("core.Activity", {
  preInitialize : function(){
    this.initialize();
    this.onCreate(arguments);
  },
  
  initialize : function(){
    alert("initialize")
  },
  
  onCreate : function(){
    alert("on create");
    this.onStart();
  },
  
  //enters the Started state, the system invokes this callback
  //activity visible to the user
  //app initializes the code that maintains the UI.
  //register a BroadcastReceiver - monitors changes in UI. 
  //onStart() method completes very quickly 
  //Once this callback finishes, the activity enters the Resumed state, and the system invokes the onResume() method.
  onStart : function(){
    alert("on start");
    this.onResume();
  },
  
  
  //system calls this method every time your activity comes into the foreground
  //also called when created for the first time
  //the state in which the app interacts with the user, until something happens to take focus away from the app
  //ex: receiving a phone call, the user’s navigating to another activity, or the device screen’s turning off. 
  //When an interruptive event occurs, the activity enters the Paused state, and the system invokes the onPause() callback.
  //returns to the Resumed state from the Paused state, the system once again calls onResume() method
  //onResume() initializes components that was released during onPause()
  onResume : function(){
    alert("on onResume");
    //this.onStart();
  },
  
  //system calls this method as the first indication that the user is leaving your activity --does not always mean the activity is being destroyed
  //Use the onPause() method to pause operations such animations and music playback
  //use the onPause() method to release system resources, such as broadcast receivers,
  //handles to sensors (like GPS), or any resources that may affect battery life while your activity is paused
  //onPause() execution is very brief, and does not necessarily afford enough time to perform save operations
  //you should not use onPause() to save application or user data, make network calls, or execute database transactions
  //Instead, you should perform heavy-load shutdown operations during onStop()
  //If the activity becomes completely invisible, the system calls onStop()
  onPause : function(){
    alert("on onPause");

  },
  
  //When activity is no longer visible to the user, it has entered the onStop is fired
  //ex: when a newly launched activity covers the entire screen
  //system may also call onStop() when the activity has finished running
  onStop : function(){
    alert("on onStop");

  }
});








