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
	 * - Set save flag because document is new and thus unchanged */
	$("#new").click(function() {
		$("#text").val("");
		$("#title").text("Untitled");
		$("#title").toggleClass("modified", false);
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
		
		if (docModule.save(title, text)) {
			// set save flag
			$("#title").toggleClass("modified", false);
			alert(title + " saved successfully");
		}
		else {
			alert("Error saving");
		}
	});
	
	// Load text and title
	$("#load").click(function() {
		// get all saved items
		var titles = docModule.getTitles();
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
			
			// Make the load menu visible
			$("#loadMenu").show();
		}
		else {
			alert("No saved files to load");
		}
	});
	
	// When a title is selected from the load menu, load that title and text
	$("#loadMenu").change(function() {
		var title = $(this).val();
		text = docModule.load(title);
		if (text) {
			$("#text").val(text);
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
			alert("Error: Could not locate text associated with this title");
		}
	});
	
	// Delete a saved file
	$("#delete").click(function() {
		// get all saved items
		var titles = docModule.getTitles();
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
			
			// Make the delete menu visible
			$("#delMenu").show();
		}
		else {
			alert("No saved files to delete");
		}
	});
	
	// Whichever file is selected from delete menu dropdown is deleted
	$("#delMenu").change(function() {
		var title = $(this).val();
		if (docModule.remove(title)) {
			alert("File deleted");
			// Hide delete menu
			$("#delMenu").hide();
		}
		else {
			alert("Error deleting file");
		}
	});
	
	// Delete all saved files
	$("#delAll").click(function() {
		if (docModule.removeAll()) {
			alert("All files deleted");
		}
		else {
				alert("Error: Could not delete files");
		}
	});
	
	// If user clicks somewhere other than a drop-down menu, make sure the dropdowns close
	$(document).click(function(event) { 
		if ($(event.target).closest("#menuOptions").length == 0) {
			$("#loadMenu").hide();
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
	var currentText = $("#text").val();
	if (docModule.save("autosave", currentText)) {
		$("#title").toggleClass("modified", false);
	}
};

/* TODO:
* 1. SANITIZE TITLE INPUT
* 2. Style
* 3. Do we want to save to Google Drive instead of chrome.storage.sync?
*/

