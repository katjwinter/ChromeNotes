$(document).ready(function() {

	setup();
	title.init();
	text.init();
	menu.init();
	
	// Open a new file
	$("#new").click(function() {
		$(document).trigger("NewNote");
	});
	
	// Save text and title
	$("#save").click(function() {
		// Sanitize user input
		var title = sanitize( $("#title").text() );
		var text = sanitize( $("#text").val() );
		
		if (docModule.save(title, text, false)) {
			$(document).trigger("SuccessfulSave");
			diagModule.showSuccess(title + " saved successfully");
		}
		else {
			diagModule.showError("Could not save " + title);
		}
	});
	
	// Delete all saved files
	$("#delAll").click(function() {
		if (docModule.removeAll()) {
			diagModule.showSuccess("All files deleted");
		}
		else {
			diagModule.showError("Could not delete files");
		}
	});
	
	$(document).bind("LoadComplete", function(e, note) {
		if (note.text) {
			if (note.title != "autosave") {
				$(document).trigger("LoadNote", { title:note.title, text:note.text });
			}
			else {
				$(document).trigger("LoadAutoSave", { title:note.title, text:note.text });
			}
		}
		else {
			diagModule.showError("Could not locate text associated with this title");
		}
	});
	
	$(document).bind("RemoveComplete", function(e, note) {
		if (note.title) {
			diagModule.showSuccess(note.title + " deleted");
		}
		else {
			diagModule.showError("Could not delete file");
		}
	});	
	
	$(document).bind("NoteChange", function() {
		// Sanitize user input
		currentText = sanitize( $("#text").val() );
		if (currentText) {
			throttled_autoSave( currentText );
		}
	});
});

function setup() {
	docModule.load("autosave", function(note) {
		$(document).trigger("LoadAutoSave", { title:note.title, text:note.text });
	});
}

// Throttle autosave so we don't autosave constantly
var throttled_autoSave = _.throttle(function(text) { return autoSave(text); }, 20000);

function autoSave(text) {
	if (docModule.save("autosave", text, true)) {
		$(document).trigger("SuccessfulSave");
	}
};

function sanitize(text) {
    var cleanText = text.replace(/[^a-zA-Z0-9\d\s]/g, "");
    return cleanText;
}

