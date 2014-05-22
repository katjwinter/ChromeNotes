$(document).ready(function() {
	
	// Set save flag to indicate an unchanged document
	$("#saveFlag").text(saved);
	
	// Set load menu to default and hide until it's called for
	resetLoadMenu();
	$("#loadMenu").hide();
	
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
	
	// Set title to default
	resetTitle();
	
	$("#title").click(function(){	
		// When user clicks on the title, change to a text input so the user can change the title
		var currentTitle = $("#title").text();
		$(this).replaceWith("<form id=\'newTitleForm\'><input type=\'text\' id=\'newTitle\' value=\'" + currentTitle + "\'><input type=\'submit\' value=\'OK\'>");
		
		// After the user has clicked OK for the new title, change back to the (new) title text
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
			rebindClickFunction();
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
		var text = $("#text").val();
		// Check that there is not a title conflict
		chrome.storage.sync.get(title, function(newTitle) {
			if (newTitle[title]) {
				// There is already a note saved with this title
				// - prompt to overwrite or to cancel
				alert("Error: A note with this file already exists");
			}
			else {
				// no conflict, so proceed with save
				var pair = {};
				pair[title] = text; // necessary to save the key as a variable
				chrome.storage.sync.set(pair);
				// set save flag
				$("#saveFlag").text(saved);
				alert(title + " saved successfully");
			}
		});
	});
	
	// Load text and title
	$("#load").click(function() {
		// don't load the menu if it's already open
		var unopened = $("#loadMenu").is(":hidden");
		if (unopened) {
			// get all saved items
			chrome.storage.sync.get(null, function(allSaves) {
				var titles = Object.getOwnPropertyNames(allSaves);
				// If there is at least one saved note, present them in a dropdown list
				if (titles) {
					var html = $("#loadMenu").html();
					for (titlekey in titles) {
						var title = titles[titlekey];
						html = html + "<option>" + title + "</option>";
					}
					$("#loadMenu").html(html);
					
					// Bind to function so whichever one is selected, load that title and text
					$("#loadMenu").change(function() {
						var title = $(this).val();
						chrome.storage.sync.get(title, function(text) {
							var restore = text[title];
							if (restore) {
								$("#text").val(restore);
								if (title != "autosave") {
									$("#title").text(title);
								}
								else {
									resetTitle();
								}
								// reset save flag because this is newly loaded so no changes have been made
								$("#saveFlag").text(saved);
								// hide the load menu
								$("#loadMenu").hide();
								// reset load menu text
								resetLoadMenu();
							}
							else {
								alert("No text associated with this title");
							}
						});
					});
					
					// Make the load menu visible
					$("#loadMenu").show();
				}
				else {
					alert("No saved files to load");
				}
			});
		}
	});
});

// Save Flag
var unsaved = "Notes*";
var saved = "Notes";

// Load menu default
function resetLoadMenu() {
	$("#loadMenu").html("<option>Select a file to load</option>");
}

// Title default
function resetTitle() {
	$("#title").text("Untitled");
}

// Make Autosave only occur at most every second using debounce
var debounced_autoSave = _.debounce(autoSave, 1000, true);

function rebindClickFunction() {
	$("#title").click(function(){	
		// When user clicks on the title, change to a text input so the user can change the title
		var currentTitle = $("#title").text();
		$(this).replaceWith("<form id=\'newTitleForm\'><input type=\'text\' id=\'newTitle\' value=\'" + currentTitle + "\'><input type=\'submit\' value=\'OK\'>");
		
		// After the user has clicked OK for the new title, change to the (new) title text
		$("#newTitleForm").submit(function( event ) {
			alert("clicked to submit form");
			event.preventDefault();
			event.stopPropagation();
			var newTitle = $("#newTitle").val();
			var newHtml = "<div id=\'title\'>" + newTitle + "</div>";
			$(this).replaceWith(newHtml);
			// set the save flag to unsaved because the title (and thus the note as a whole) has been changed
			$("#saveFlag").text(unsaved);
			// Rebind the click function since we have changed the id (even though it has the same name, it's no longer bound)
			rebindClickFunction();
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
	$("#saveFlag").text(saved);
};

/* TODO:
* 1. Do we want to save to Google Drive instead of chrome.storage.sync?
* 2: Consider refactoring with Backbone.js not that it's necessary
*/

