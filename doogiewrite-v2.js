
var Doogiewrite = {

    musiccheck : 0,
    check: 0,
    testvar : 0,


    init : function(){
        console.log("Doogie write initialized!")

        // Add event listeners
        $('#doc-body').keydown(function (e) {
        
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

        this.checkPrefs();
    },

    checkPrefs : function(){
        console.log ("check prefs running")
        console.log(this.check)
        this.check = localStorage.getItem("savePref")
         console.log(this.check)
        // If the save preference hasn't been set, assume the visitor is new

        if(this.check==null){
            var theDoc = document.getElementById("doc-body");
            theDoc.value = "Welcome to DoogieWrite!\n\nDoogieWrite is a retro-inspired web-based text editor, just click on the screen and start typing to begin.\n\nIf you're running Chrome, you can hit command-shift-F to enter full-screen mode.\n\nThis message won't show the next time you load this page, but you can also hit refresh to clear this text.\n\nVERSION NOTES: After clicking SAVE, your .txt file will appear in another browser window where you can then save it to disk through File -> Save." ;
            // Autosave, by default, is off.
            check=0;
            localStorage.setItem("savePref", check);

        } else if (this.check==0){
    
            // If there's no autosave set, clear the text area.
            var box = document.getElementById("box");
            box.className = "box_unchecked";
        
        
            var aS = document.getElementById("autosaveButton");
            aS.innerHTML = "AUTOSAVE OFF"
            var theDoc = document.getElementById("doc-body");
            theDoc.value = "";
        }
     
        // If autosave box is set, load the text file from localStorage
        else if (this.check==1){
            var box = document.getElementById("box");
            box.className = "box_checked";
            var loadPrevText = localStorage.getItem("storedDoc")
            document.getElementById("doc-body").value = loadPrevText;
            // Add listener to save every key stroke.
            document.addEventListener("keyup", this.saveLocal, false);
            var aS = document.getElementById("autosaveButton");
            aS.innerHTML = "AUTOSAVE ON"
        }

        // Add listeners for buttons
        
        var sB = document.getElementById("saveButton");
        sB.addEventListener("click", this.saveFile, false);

        var lB = document.getElementById("loadButton");
        lB.addEventListener("click", this.load, false);

        var box = document.getElementById("box");
        box.addEventListener("click", Doogiewrite.toggleCheck, false);

        var aS = document.getElementById("autosaveButton");
        aS.addEventListener("click", Doogiewrite.toggleCheck, false);

        var eB = document.getElementById("emailButton");
        eB.addEventListener("click", this.email, false);

        var mB = document.getElementById("musicbox");
        mB.addEventListener("click", this.toggleMusic, false);

        // set the browser focus to the main editor screen
        var documentArea = document.getElementById("doc-body");
        documentArea.focus();
    },

    addSource : function(elem, path) {  
        $('<source>').attr('src', path).appendTo(elem);  
    },

    loaded: function(evt){
        var fileString = evt.target.result;
        console.log(fileString);
    },
    saveFile: function(){
        var documentArea = document.getElementById("doc-body").value;
        parsedText = documentArea;
        var data = {
            "txt" : parsedText
        };
        document.location.href = "save.php?txt=" + parsedText;
    },


    toggleMusic: function(){
        if(this.musiccheck==0){
            this.musiccheck=1;
            var mbox = document.getElementById("musicbox");
            mbox.className = "musicbox_checked";
        
            // Change the music button
            $("#notePic").attr('src', "note1.png")
        
            var ad = document.getElementById("audioPl")
            ad.play();  
        }
        else if (this.musiccheck==1){
            this.musiccheck=0;
            var musicbox = document.getElementById("musicbox");
            musicbox.className = "musicbox_unchecked";
            var ad = document.getElementById("audioPl")
            $("#notePic").attr('src', "note2.png")
            ad.pause();  
        }
    },

    email: function(){
        var currentDoc = document.getElementById("doc-body").value;
        var addy = prompt("Enter your email address.");

        // Replace linebreaks with <br> tags.
        var reg = /\n/g
        var tempDoc = currentDoc.replace (reg, "<br>");

        // Enter your mobile phone's 'mail' program.
        location.href = "mailto:" + addy + "?subject=Your Text Document&body=" + tempDoc;
    },

    toggleCheck: function(){

        //if unchecked, check it and turn on local storage listener and save preference on
        console.log("check clicked")
        console.log(Doogiewrite.check);
        console.log("what is this?  " + this)
        console.log(this);
        if (!$(this).hasClass("checked")){
            this.check=1;
            
            $(this).addClass("checked");
            //turn on listener and save
            Doogiewrite.saveLocal();
            document.addEventListener("keyup", Doogiewrite.saveLocal, false);
            //set save pref to on
            localStorage.setItem("savePref", Doogiewrite.check);
     
            var aS = document.getElementById("autosaveButton");
            aS.innerHTML = "AUTOSAVE ON"
        }
        // Otherwise, uncheck it, turn off local storage listener and save preference off
        else if ($(this).hasClass("checked")){
            this.check=0;
            var box = document.getElementById("box");
            $(this).removeClass("checked");
            document.removeEventListener("keyup", Doogiewrite.saveLocal, false);
            localStorage.setItem("savePref", 0);
      
            var aS = document.getElementById("autosaveButton");
            aS.innerHTML = "AUTOSAVE OFF";
        }

    },


    fileImport : function(files) {

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
            document.getElementById("doc-body").value = event.target.result;
        }
   
        var loadBox = document.getElementById("fU")
        loadBox.className = "fileUpload";
    },

    saveLocal : function(){
        var currentDoc = document.getElementById("doc-body").value;
        localStorage.setItem("storedDoc", currentDoc);

        var v = localStorage.getItem("storedDoc")
        console.log(v);
    },

    load : function(){
        var loadBox = document.getElementById("fU");
    }
};










// var this.musiccheck;
  
// var addToHomeConfig = {
// animationIn: 'bubble',
// animationOut: 'drop',
// lifespan:10000,
// expire:0,
// touchIcon:true,
// message:'Did you know you can add DoogieWrite to your home screen and use it offline? Just click `%icon`'
// };



function init(){
    Doogiewrite.init();
}

window.addEventListener("load", init, false);
