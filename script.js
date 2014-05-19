var restored_text = localStorage.getItem("user_data");

$(document).ready(function() {
	
	// Restore any auto-saved text and if there isn't any,
	// display the default text.
	chrome.storage.sync.get('autosave', function(stored_value) {
		if (stored_value.autosave) {
			$("#text").val(stored_value.autosave);
		}
		else {
			$("#text").val("Enter notes here...");
		}
	});
	
	// Clear the textarea when the user clicks the New button
	$("#new").click(function() {
		$("#text").val("");
	});
	
	// If there's been a change to the textarea, save it.
	var textArea = document.getElementById("text");
	textArea.oninput = function() {
		var currentText = $("#text").val();
		if (currentText) {
			debounced_autoSave();
		}
	};
});

// Make Autosave only occur at most every second using debounce
var debounced_autoSave = _.debounce(autoSave, 1000, true);

/* This could go in document.ready, but because it will only
* be called if the DOM is ready, we don't really need to worry about
* whether or not #text has been loaded. It's a precondition that it's been loaded.
*/
function autoSave() {
	// Save to Chrome storage (synced)
	var currentText = $("#text").val();
	chrome.storage.sync.set( {"autosave": currentText} );
};

/* TODO:
* 1. Make it so if you click New, then the autosaved information is cleared.
* 2. Make it so that Save button actually saves the note. Do we want to save to sync or to Google Drive?
* 3. Make a Load button that will present a list of the notes to load and load the selected note.
* 4: Consider refactoring with Backbone.js
*/

