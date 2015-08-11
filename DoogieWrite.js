
var Doogiewrite = {

    musicPref : 0,
    savePref: 1,

    init : function(){
      
        // Add event listener for tab workaround (tab key should produce several spaces, not change fields)
        var theDoc = document.getElementById("user-document");
        theDoc.addEventListener('keydown', function(e){
        
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

        // Check locally stored preferences
        this.checkPrefs();
    },

    clearTextArea: function(){
        var theDoc = document.getElementById("user-document");
        theDoc.value = "";
    },

    checkPrefs : function(){
     
        // Load the locally stored autosave preference
        this.savePref = localStorage.getItem("savePref")
       
        // If the save preference hasn't been set, assume the visitor is new and load the welcome message.
        if(this.savePref==null){
            var theDoc = document.getElementById("user-document");
            theDoc.value = "Welcome to DoogieWrite!\n\nthis is a retro-inspired web-based text editor, just click on the screen and start typing to begin.\n\nIf you're running Chrome, you can hit command-shift-F to enter full-screen mode.\n\nThis message won't show the next time you load this page, but you can also hit refresh to clear this text.\n\nVERSION NOTES: After clicking SAVE, your .txt file will appear in another browser window where you can then save it to disk through File -> Save." ;
            // Autosave, by default, is off.
            this.savePref=0;
            localStorage.setItem("savePref", this.savePref);

        // If the save preference is set to off, load an empty document
        } else if (this.savePref==0){
    
            // If there's no autosave set, clear the text area.
            var autoSaveButton = document.getElementById("autosave-button");
            autoSaveButton.innerHTML = "AUTOSAVE OFF"
            this.clearTextArea();
        }
     
        // If autosave box is set, load the text file from localStorage
        else if (this.savePref==1){
            this.addCheckbox("autosave-toggle-box");

            var loadedText = localStorage.getItem("storedDoc")
            document.getElementById("user-document").value = loadedText;
            
            // Add listener to save after every key stroke.
            document.addEventListener("keyup", this.saveLocal, false);
            var autoSaveButton = document.getElementById("autosave-button");
            autoSaveButton.innerHTML = "AUTOSAVE ON"
        }

        // Add listeners for buttons
        
        var saveButton = document.getElementById("save-button");
        saveButton.addEventListener("click", this.saveFile, false);

        var box = document.getElementById("autosave-toggle-box");
        box.addEventListener("click", this.toggleCheck, false);

        var autoSaveButton = document.getElementById("autosave-button");
        autoSaveButton.addEventListener("click", this.toggleCheck, false);

        var emailButton = document.getElementById("email-button");
        emailButton.addEventListener("click", this.email, false);

        var musicBox = document.getElementById("music-toggle");
        musicBox.addEventListener("click", this.toggleMusic, false);

        // set the browser focus to the main editor screen
        var documentArea = document.getElementById("user-document");
        documentArea.focus();
    },

    saveFile: function(){
        var documentText = document.getElementById("user-document").value;
      
        // Javascript does not allow creating files on the clientside. Run a simple php script to return the document text as a text file.
        document.location.href = "save.php?txt=" + documentText;
    },

    toggleMusic: function(){

        if(Doogiewrite.musicPref==0){
            Doogiewrite.musicPref=1;
            Doogiewrite.addCheckbox("music-toggle")
        
            var audioPlayer = document.getElementById("audio-player")
            audioPlayer.play();  
        } else if (Doogiewrite.musicPref==1){
            Doogiewrite.musicPref=0;
            // var musicbox = document.getElementById("music-toggle");
            // musicbox.classList.remove('checked');
            Doogiewrite.removeCheckbox("music-toggle");
            var audioPlayer = document.getElementById("audio-player")
            
            // Reset the audio player to the beginning.
            audioPlayer.pause();  
            audioPlayer.currentTime = 0;
        }
    },

    removeCheckbox : function(element){
        var theElement = document.getElementById(element);
        theElement.classList.remove('checked');
    },

    addCheckbox : function(element){
        var theElement = document.getElementById(element);
        theElement.classList.add('checked');
    },

    email: function(){
        //Concert the document text to html and send it via a mailto link.
        var currentDoc = document.getElementById("user-document").value;
        var addy = prompt("Enter your email address.");

        // Replace linebreaks with <br> tags.
        var regEx = /\n/g
        var tempDoc = currentDoc.replace (regEx, "<br>");

        // Enter your mobile phone's 'mail' program.
        location.href = "mailto:" + addy + "?subject=Your Text Document&body=" + tempDoc;
    },

    toggleCheck: function(){
        //if unchecked, check it and turn on local storage listener and save preference on
        if (!this.classList.contains("checked")){
            Doogiewrite.savePref=1;
            this.classList.add("checked");
            //turn on autosave keyup listener and save
            Doogiewrite.saveLocal();
            document.addEventListener("keyup", Doogiewrite.saveLocal, false);
            //set save document pref to on
            localStorage.setItem("savePref", Doogiewrite.savePref);
     
            var autosaveButton = document.getElementById("autosave-button");
            autoSaveButton.innerHTML = "AUTOSAVE ON"
        }
        // Otherwise, uncheck it, turn off local storage listener and save preference off
        else if (this.classList.contains("checked")){
            Doogiewrite.savePref=0;
            Doogiewrite.removeCheckbox("autosave-toggle-box");
            //Remove autosave keyup listener
            document.removeEventListener("keyup", Doogiewrite.saveLocal, false);
            localStorage.setItem("savePref", 0);
      
            var autoSaveButton = document.getElementById("autosave-button");
            autoSaveButton.innerHTML = "AUTOSAVE OFF";
        }
    },

    fileImport : function(files) {
        confirm("Are you sure you want to load the selected file? This will overwrite any unsaved text that you are working on.");
        var file = files[0];
        
        // Use the FileReader API to load a text file's contents
        var fileReader = new FileReader();
        fileReader.readAsText(file);
    
        fileReader.onload = function(evt) {
            document.getElementById("user-document").value = evt.target.result;
        }
    },

    saveLocal : function(){
        var currentDoc = document.getElementById("user-document").value;
        localStorage.setItem("storedDoc", currentDoc);
    }
};

function init(){
    Doogiewrite.init();
}

window.addEventListener("load", init, false);
