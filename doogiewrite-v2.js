
var Doogiewrite = {

    musicPref : 0,
    savePref: 1,

    init : function(){
      
        // Add event listener for tab workaround (tab key should produce several spaces, not change fields)
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

        // Check locally stored preferences
        this.checkPrefs();
    },

    clearTextArea: function(){
        var theDoc = document.getElementById("doc-body");
        theDoc.value = "";
    },

    checkPrefs : function(){
     
        // Load the locally stored autosave preference
        Doogiewrite.savePref = localStorage.getItem("savePref")
       
        // If the save preference hasn't been set, assume the visitor is new and load the welcome message.
        if(Doogiewrite.savePref==null){
            var theDoc = document.getElementById("doc-body");
            theDoc.value = "Welcome to DoogieWrite!\n\nDoogieWrite is a retro-inspired web-based text editor, just click on the screen and start typing to begin.\n\nIf you're running Chrome, you can hit command-shift-F to enter full-screen mode.\n\nThis message won't show the next time you load this page, but you can also hit refresh to clear this text.\n\nVERSION NOTES: After clicking SAVE, your .txt file will appear in another browser window where you can then save it to disk through File -> Save." ;
            // Autosave, by default, is off.
            Doogiewrite.savePref=0;
            localStorage.setItem("savePref", Doogiewrite.savePref);

        // If the save preference is set to off, load an empty document
        } else if (Doogiewrite.savePref==0){
    
            // If there's no autosave set, clear the text area.
            var autoSaveButton = document.getElementById("autosaveButton");
            autoSaveButton.innerHTML = "AUTOSAVE OFF"
            this.clearTextArea();
        }
     
        // If autosave box is set, load the text file from localStorage
        else if (Doogiewrite.savePref==1){
            var box = document.getElementById("box");
            box.classList.add('checked');

            var loadedText = localStorage.getItem("storedDoc")
            document.getElementById("doc-body").value = loadedText;
            
            // Add listener to save after every key stroke.
            document.addEventListener("keyup", this.saveLocal, false);
            var autoSaveButton = document.getElementById("autosaveButton");
            autoSaveButton.innerHTML = "AUTOSAVE ON"
        }

        // Add listeners for buttons
        
        var saveButton = document.getElementById("saveButton");
        saveButton.addEventListener("click", this.saveFile, false);

        var loadButton = document.getElementById("loadButton");
        loadButton.addEventListener("click", this.load, false);

        var box = document.getElementById("box");
        box.addEventListener("click", Doogiewrite.toggleCheck, false);

        var autoSaveButton = document.getElementById("autosaveButton");
        autoSaveButton.addEventListener("click", Doogiewrite.toggleCheck, false);

        var emailButton = document.getElementById("emailButton");
        emailButton.addEventListener("click", this.email, false);

        var musicBox = document.getElementById("musicbox");
        musicBox.addEventListener("click", Doogiewrite.toggleMusic, false);

        // set the browser focus to the main editor screen
        var documentArea = document.getElementById("doc-body");
        documentArea.focus();
    },

    saveFile: function(){
        var documentText = document.getElementById("doc-body").value;
        var data = {
            "txt" : documentText
        };
        // Javascript does not allow creating files on the clientside. Run a simple php script to return the document text as a text file.
        document.location.href = "save.php?txt=" + documentText;
    },

    toggleMusic: function(){

        if(Doogiewrite.musicPref==0){
            Doogiewrite.musicPref=1;
            var mbox = document.getElementById("musicbox");
            mbox.classList.add("checked");
        
            // Change the music button image
            $("#notePic").attr('src', "note1.png")
        
            var audioPlayer = document.getElementById("audioPl")
            audioPlayer.play();  
        } else if (Doogiewrite.musicPref==1){
            Doogiewrite.musicPref=0;
            var musicbox = document.getElementById("musicbox");
            musicbox.classList.remove('checked');
            var audioPlayer = document.getElementById("audioPl")
            $("#notePic").attr('src', "note2.png")
            audioPlayer.pause();  
        }
    },

    email: function(){
        //Concert the document text to html and send it via a mailto link.
        var currentDoc = document.getElementById("doc-body").value;
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
     
            var autosaveButton = document.getElementById("autosaveButton");
            autoSaveButton.innerHTML = "AUTOSAVE ON"
        }
        // Otherwise, uncheck it, turn off local storage listener and save preference off
        else if (this.classList.contains("checked")){
            Doogiewrite.savePref=0;
            var box = document.getElementById("box");
            this.classList.remove("checked");
            //Remove autosave keyup listener
            document.removeEventListener("keyup", Doogiewrite.saveLocal, false);
            localStorage.setItem("savePref", 0);
      
            var autoSaveButton = document.getElementById("autosaveButton");
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
            document.getElementById("doc-body").value = event.target.result;
        }
    },

    saveLocal : function(){
        var currentDoc = document.getElementById("doc-body").value;
        localStorage.setItem("storedDoc", currentDoc);
    }
};

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
