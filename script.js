$(document).ready(function() {
	
	// Hide load menu until it's called for
	$("#loadMenu").hide();
	
	// Hide delete menu until it's called for
	$("#delMenu").hide();
	
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
	
	$("#title").click(function() {	
		// When user clicks on the title, allow them to edit.
		$(this).prop("contenteditable", true);
	});
	
	$("#title").blur(function() {
		$(this).toggleClass("modified", true);
		$(this).prop("contenteditable", false);
	});
	
	/* When the user clicks on New:
	 * - Clear text area
	 * - Reset title to Untitled
	 * - Clear any autosaved text 
	 * - Set save flag because document is new and thus unchanged */
	$("#new").click(function() {
		$("#text").val("");
		$("#title").text("Untitled");
		$("#title").toggleClass("modified", false);
		chrome.storage.sync.remove("autosave");
	});
	
	// Clear saved flag upon change to text. Also
	// call autosave (depending on debounce)
	var textArea = document.getElementById("text");
	textArea.oninput = function() {
		// clear saved flag
		$("#title").toggleClass("modified", true);
		var currentText = $("#text").val();
		if (currentText) {
			throttled_autoSave();
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
				$("#title").toggleClass("modified", false);
				alert(title + " saved successfully");
			}
		});
	});
	
	// Load text and title
	$("#load").click(function() {
		// get all saved items
		chrome.storage.sync.get(null, function(allSaves) {
			var titles = Object.getOwnPropertyNames(allSaves);
			// If there is at least one saved note, present them in a dropdown list
			if (titles) {
				var titleList = [];
				titleList.push("Select a file to load");
				for (titlekey in titles) {
					titleList.push(titles[titlekey]);
				}
				// Update the menu via underscore.js templates
				var menuTemplate = $("#menuTemplate").html();
				$("#loadMenu").html(_.template(menuTemplate, {titleList:titleList}));
				
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
							$("#title").toggleClass("modified", false);
							// hide the load menu
							$("#loadMenu").hide();
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
	});
	
	// Delete a saved file
	$("#delete").click(function() {
		// get all saved items
		chrome.storage.sync.get(null, function(allSaves) {
			var titles = Object.getOwnPropertyNames(allSaves);
			// If there is at least one saved note, present them in a dropdown list
			if (titles) {
				var titleList = [];
				titleList.push("Select a file to DELETE");
				for (titlekey in titles) {
					titleList.push(titles[titlekey]);
				}
				// Update the menu via underscore.js templates
				var menuTemplate = $("#menuTemplate").html();
				$("#delMenu").html(_.template(menuTemplate, {titleList:titleList}));
				
				// Bind to function so whichever one is selected is deleted
				$("#delMenu").change(function() {
					var title = $(this).val();
					chrome.storage.sync.remove(title, function() {
						if (chrome.runtime.lastError) {
							alert("Error: Could not delete file");
						}
						else {
							alert("File successfully deleted");
						}
					});
					// Hide delete menu
					$("#delMenu").hide();
				});
				
				// Make the delete menu visible
				$("#delMenu").show();
			}
			else {
				alert("No saved files to delete");
			}
		});
	});
	
	// Delete all saved files
	$("#delAll").click(function() {
		chrome.storage.sync.clear(function() {
			if (chrome.runtime.lastError) {
				alert("Error: Could not delete files");
			}
			else {
				alert("All files successfully deleted");
			}
		});
	});
	
	// If a dropdown menu is open and the user clicks elsewhere, close the dropdown
	$(document).click(function(event) { 
		if ($(event.target).closest("#loadMenu").length == 0) {
			$("#loadMenu").hide()
		}        
	});
	$(document).click(function(event) {
		if ($(event.target).closest("#delMenu").length == 0) {
			$("#delMenu").hide();
		}
	});
});

// Title default
function resetTitle() {
	$("#title").text("Untitled");
}

// Throttle autosave so we don't autosave constantly
var throttled_autoSave = _.throttle(autoSave, 20000);

/* This could go in document.ready, but because it will only
* be called if the DOM is ready, we don't really need to worry about
* whether or not #text has been loaded. It's a precondition that it's been loaded.
*/
function autoSave() {
	// Save to Chrome storage (synced)
	var currentText = $("#text").val();
	chrome.storage.sync.set( {"autosave": currentText} );
	// Set saved flag
	$("#title").toggleClass("modified", false);
};

/* TODO:
* 1. SANITIZE TITLE INPUT
* 2. Style
* 3. Do we want to save to Google Drive instead of chrome.storage.sync?
*/

