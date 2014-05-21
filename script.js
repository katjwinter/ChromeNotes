$(document).ready(function() {
	
	// Set save flag to indicate an unchanged document
	$("#saveFlag").text(saved);
	
	// Hide the load menu until it's called for
	//$("#loadMenu").hide();
	
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
	
	// Restore auto-saved title if there is one
	chrome.storage.sync.get('savedTitle', function(storedTitle) {
		if (storedTitle.savedTitle) {
			$("#title").text(storedTitle.savedTitle);
		}
		else {
			$("#title").text("Untitled");
		}
	});
	
	$("#title").click(function(){	
		// When user clicks on the title, change to a text input so the user can change the title
		var currentTitle = $("#title").text();
		$(this).replaceWith("<form id=\'newTitleForm\'><input type=\'text\' id=\'newTitle\' value=\'" + currentTitle + "\'><input type=\'submit\' value=\'OK\'>");
		
		// After the user has clicked OK for the new title, change back to the (new) title text and save the new title
		$("#newTitleForm").submit(function( event ) {
			event.preventDefault();
			event.stopPropagation();
			var newTitle = $("#newTitle").val();
			var newHtml = "<div id=\'title\'>" + newTitle + "</div>";
			$(this).replaceWith(newHtml);
			// Display the save flag because the title (and thus the note as a whole) has been changed
			$("#saveFlag").text(unsaved);
			// We change the html back to the original, but despite the id being the same, it is no longer bound to this click function.
			// As a workaround, we will call out to a function outside of document.ready. 
			// Didn't move this whole function beyond document.ready because during initial page load, the id might not be present.
			rebindClickFunction();
			// Now save the new title
			chrome.storage.sync.set( {"savedTitle": newTitle} );
			return false;
		});
	});
	
	/* When the user clicks on New:
	 * - Clear text area
	 * - Reset title to Untitled
	 * - Clear any autosaved text 
	 * - Set save flag because document is new and thus unchanged */
	$("#new").click(function() {
		$("#text").val("");
		$("#title").text("Untitled");
		$("#saveFlag").text(saved);
		chrome.storage.sync.remove("autosave");
	});
	
	// Clear saved flag upon change to text. Also
	// call autosave (depending on debounce)
	var textArea = document.getElementById("text");
	textArea.oninput = function() {
		// clear saved flag
		$("#saveFlag").text(unsaved);
		var currentText = $("#text").val();
		if (currentText) {
			debounced_autoSave();
		}
	};
	
	// Save text and title
	$("#save").click(function() {
		var title = $("#title").text();
		// Check that there is not a title conflict
		chrome.storage.sync.get(title, function(newTitle) {
			if (newTitle.title) {
				// There is already a note saved with this title
				// - prompt to overwrite or to cancel
				alert("title already exists");
			}
			else {
				// no conflict, so proceed with save
				chrome.storage.sync.set({title: text});
				// set save flag
				$("#saveFlag").text(saved);
			}
		});
	});
	
	// Load text and title
	$("#load").click(function() {
		// get all saved items
		chrome.storage.sync.get(null, function(allSaves) {
			var titles = Object.keys(allSaves);
			// If there is at least one saved note, so present them in a list
			if (titles) {
				var html = $("#loadMenu").html();
				for (title in titles) {
					var savedTitle = title;
					var savedText = allSaves.title;
					html = html + "<option>" + title + "</option>";
				}
				$("#loadMenu").html(html);
				
				// Bind to function so whichever one is selected, load that title and text
				$("#loadMenu").change(function() {
					var title = $(this).val();
					var text = titles[text];
					$("#text").val(text);
					$("#title").text(title);
					// reset save flag because this is newly loaded so no changes have been made
					$("#saveFlag").text(unsaved);
					// hide the load menu
					$("#loadMenu").hide();
				});
				
				// Make the load menu visible
				$("#loadMenu").show();
			}
			else {
				alert("No saved files to load");
			}
		});
	});
});

// Save Flag
var unsaved = "Notes*";
var saved = "Notes";

// Make Autosave only occur at most every second using debounce
var debounced_autoSave = _.debounce(autoSave, 1000, true);

function rebindClickFunction() {
	$("#title").click(function(){
		// Remove the save flag temporarily so it doesn't interfere with the form
		$("#saveFlag").hide();
		
		// When user clicks on the title, change to a text input so the user can change the title
		var currentTitle = $("#title").text();
		$(this).replaceWith("<form id=\'newTitleForm\'><input type=\'text\' id=\'newTitle\' value=\'" + currentTitle + "\'><input type=\'submit\' value=\'OK\'>");
		
		// After the user has clicked OK for the new title, change back to the (new) title text and save the new title
		$("#newTitleForm").submit(function( event ) {
			alert("clicked to submit form");
			event.preventDefault();
			event.stopPropagation();
			var newTitle = $("#newTitle").val();
			var newHtml = "<div id=\'title\'>" + newTitle + "</div>";
			$(this).replaceWith(newHtml);
			// Display the save flag because the title (and thus the note as a whole) has been changed
			$("#saveFlag").show();
			// Rebind the click function since we have changed the id (even though it has the same name, it's no longer bound)
			rebindClickFunction();
			// Now save the new title
			chrome.storage.sync.set( {"savedTitle": newTitle} );
			return false;
		});
	});
};

/* This could go in document.ready, but because it will only
* be called if the DOM is ready, we don't really need to worry about
* whether or not #text has been loaded. It's a precondition that it's been loaded.
*/
function autoSave() {
	// Save to Chrome storage (synced)
	var currentText = $("#text").val();
	chrome.storage.sync.set( {"autosave": currentText} );
	// Set saved flag
	$("#saveFlag").show();
};

/* TODO:
* 1. Make it so if you click New, then the autosaved information is cleared.
* 2. Make it so that Save button actually saves the note. Do we want to save to sync or to Google Drive?
* 3. Make a Load button that will present a list of the notes to load and load the selected note.
* 4: Consider refactoring with Backbone.js
*/

