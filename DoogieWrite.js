var musiccheck;
  
var addToHomeConfig = {
animationIn: 'bubble',
animationOut: 'drop',
lifespan:10000,
expire:0,
touchIcon:true,
message:'Did you know you can add DoogieWrite to your home screen and use it offline? Just click `%icon`'
};

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-21955731-1']);
_gaq.push(['_trackPageview']);
    (function() {
        var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
        ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
    })();

function init(){
    console.log("init");
    musiccheck = 0;
    
    // Check for a 'tab' and if so, perform a hacky 'tab' substitute.
    $('#docBody').keydown(function (e) {
        
        if (e.keyCode == 9) {
            var myValue = "\t";
            var startPos = this.selectionStart;
            var endPos = this.selectionEnd;
            var scrollTop = this.scrollTop;
            this.value = this.value.substring(0, startPos) + myValue + this.value.substring(endPos,this.value.length);
            this.focus();
            this.selectionStart = startPos + myValue.length;
            this.selectionEnd = startPos + myValue.length;
            this.scrollTop = scrollTop;

            e.preventDefault();
        }
    }); 

    check = localStorage.getItem("savePref")
    // If the save preference hasn't been set, assume the visitor is new
    if(check==null){
        var theDoc = document.getElementById("docBody");
        theDoc.value = "Welcome to DoogieWrite!\n\nDoogieWrite is a retro-inspired web-based text editor, just click on the screen and start typing to begin.\n\nIf you're running Chrome, you can hit command-shift-F to enter full-screen mode.\n\nThis message won't show the next time you load this page, but you can also hit refresh to clear this text.\n\nVERSION NOTES: After clicking SAVE, your .txt file will appear in another browser window where you can then save it to disk through File -> Save." ;
        // Autosave, by default, is off.
        check=0;
        localStorage.setItem("savePref", check);

    } else if (check==0){
    
        // If there's no autosave set, clear the text area.
        var box = document.getElementById("box");
        box.className = "box_unchecked";
        
        
        var aS = document.getElementById("autosaveButton");
        aS.innerHTML = "AUTOSAVE OFF"
        var theDoc = document.getElementById("docBody");
        theDoc.value = "";
     }
     
     // If autosave box is set, load the text file from localStorage
     else if (check==1){
        var box = document.getElementById("box");
        box.className = "box_checked";
        var loadPrevText = localStorage.getItem("storedDoc")
        document.getElementById("docBody").value = loadPrevText;
        // Add listener to save every key stroke.
        document.addEventListener("keyup", saveLocal, false);
        var aS = document.getElementById("autosaveButton");
        aS.innerHTML = "AUTOSAVE ON"
    }

    // Add listeners for buttons
    
    var sB = document.getElementById("saveButton");
    sB.addEventListener("click", saveFile, false);

    var lB = document.getElementById("loadButton");
    lB.addEventListener("click", load, false);

    var box = document.getElementById("box");
    box.addEventListener("click", toggleCheck, false);

    var aS = document.getElementById("autosaveButton");
    aS.addEventListener("click", toggleCheck, false);

    var eB = document.getElementById("emailButton");
    eB.addEventListener("click", email, false);

    var mB = document.getElementById("musicbox");
    mB.addEventListener("click", toggleMusic, false);

    // set the browser focus to the main editor screen
    var documentArea = document.getElementById("docBody");
    documentArea.focus();
}

function addSource(elem, path) {  
      $('<source>').attr('src', path).appendTo(elem);  
}  

function loaded(evt){
    var fileString = evt.target.result;
    console.log(fileString);
}
    
function saveFile() {
    var documentArea = document.getElementById("docBody").value;
    parsedText = documentArea;
    var data = {
        "txt" : parsedText
    };
    
    // Save to server briefly to then be retrieved as text. This is really stupid and needs to change.
    $.post("save.php", data, function(data) {
	    // Go to the newly posted text file.
	    location.href=data;
	});
}

function toggleMusic(){
    if(musiccheck==0){
        musiccheck=1;
        var mbox = document.getElementById("musicbox");
        mbox.className = "musicbox_checked";
        
        // Change the music button
        $("#notePic").attr('src', "note1.png")
        
        
        var ad = document.getElementById("audioPl")
        ad.play();  
     
     }
     else if (musiccheck==1){
        musiccheck=0;
        var musicbox = document.getElementById("musicbox");
        musicbox.className = "musicbox_unchecked";
        var ad = document.getElementById("audioPl")
        $("#notePic").attr('src', "note2.png")
        ad.pause();  
     }
}

function email(){
    var currentDoc = document.getElementById("docBody").value;
    var addy = prompt("Enter your email address.");

    // Replace linebreaks with <br> tags.
    var reg = /\n/g
    var tempDoc = currentDoc.replace (reg, "<br>");

    // Enter your mobile phone's 'mail' program.
    location.href = "mailto:" + addy + "?subject=Your Text Document&body=" + tempDoc;
}

function toggleCheck(){

    //if unchecked, check it and turn on local storage listener and save preference on
    
    if(check==0){
        check=1;
        var box = document.getElementById("box");
        box.className = "box_checked";
        //turn on listener and save
        saveLocal();
        document.addEventListener("keyup", saveLocal, false);
        //set save pref to on
        localStorage.setItem("savePref", check);
     
        var aS = document.getElementById("autosaveButton");
        aS.innerHTML = "AUTOSAVE ON"
    }
    // Otherwise, uncheck it, turn off local storage listener and save preference off
    else if (check==1){
        check=0;
        var box = document.getElementById("box");
        box.className = "box_unchecked";
        document.removeEventListener("keyup", saveLocal, false);
        localStorage.setItem("savePref", check);
      
        var aS = document.getElementById("autosaveButton");
        aS.innerHTML = "AUTOSAVE OFF";
    }

}

function fileImport( files) {

    confirm("Are you sure you want to load the selected file? This will overwrite any unsaved text that you are working on.");
    var file = files[0];
    console.log(file);
    var fileReader = new FileReader();
    fileReader.readAsText(file);
    fileReader.onerror = function (evt) {  
        console.log("error occured");
    }  
    fileReader.onload = function(evt) {
        console.log(evt.target.result); 
        document.getElementById("docBody").value = event.target.result;
    }
   
    var loadBox = document.getElementById("fU")
    loadBox.className = "fileUpload";
};



function saveLocal(){
    
    var currentDoc = document.getElementById("docBody").value;
    localStorage.setItem("storedDoc", currentDoc);

    var v = localStorage.getItem("storedDoc")
    console.log(v);
}

function load(){

    var loadBox = document.getElementById("fU");

}

window.addEventListener("load", init, false);
