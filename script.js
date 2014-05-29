$(document).ready(function() {
	
	// Hide load menu until it's called for
	$("#loadMenu").hide();
	
	// Hide delete menu until it's called for
	$("#delMenu").hide();
	
	// Restore any auto-saved text and if there isn't any,
	// display the default text.
	docModule.load(null, initialize);
	
	function initialize(text) {
		$("#text").val(text);
	}
	
	// Set title to default
	resetTitle();
	
	$("#title").click(function() {	
		// When user clicks on the title, allow them to edit.
		$(this).prop("contenteditable", true);
		$(this).focus();
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
		resetTitle();
		$("#title").toggleClass("modified", false);
	});
	
	// Clear saved flag upon change to text. Also
	// call autosave (depending on throttle)
	$("#text").keydown(function() {
		$("#title").toggleClass("modified", true);
		var currentText = $("#text").val();
		currentText = sanitize(currentText); // Be good and sanitize user input
		if (currentText) {
			throttled_autoSave();
		}
	});
	
	// Save text and title
	$("#save").click(function() {
		var title = $("#title").text();
		var text = $("#text").val();
		
		// Be good and sanitize user input
		title = sanitize(title);
		text = sanitize(text);
		
		if (docModule.save(title, text, false)) {
			$("#title").toggleClass("modified", false);
			diagModule.showSuccess(title + " was saved");
		}
		else {
			diagModule.showError("Error saving");
		}
	});
	
	// Load text and title
	$("#load").click(function() {
		// get all saved items
		docModule.getTitles( buildLoadMenu );
	});
	
	function buildLoadMenu(titles) {
		// If there is at least one saved note, present them in a dropdown list
		if (titles.length > 0) {
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
			diagModule.showError("No saved files to load");
		}
	}
	
	// When a title is selected from the load menu, load that title and text
	$("#loadMenu").change(function() {
		var title = $(this).val();
		docModule.load(title, updateText);
	});
	
	function updateText(text) {
		if (text) {
			var title = $("#loadMenu").val();
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
			diagModule.showError("Could not locate text associated with this title");
		}
	}
	
	// Delete a saved file
	$("#delete").click(function() {
		// get all saved items
		var titles = docModule.getTitles(buildDeleteMenu);
	});
	
	function buildDeleteMenu(titles) {
		// If there is at least one saved note, present them in a dropdown list
		if (titles.length > 0) {
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
			diagModule.showError("No saved files to delete");
		}
	}
	
	// Whichever file is selected from delete menu dropdown is deleted
	$("#delMenu").change(function() {
		var title = $(this).val();
		if (docModule.remove(title)) {
			diagModule.showSuccess("File deleted");
			// Hide delete menu
			$("#delMenu").hide();
		}
		else {
			diagModule.showError("Error deleting file");
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
* be called if #text has been modified, we don't really need to worry about
* whether or not #text has been loaded.
*/
function autoSave() {
	var currentText = $("#text").val();
	currentText = sanitize(currentText);
	if (docModule.save("autosave", currentText, true)) {
		$("#title").toggleClass("modified", false);
	}
};

function sanitize(text) {
    var cleanText = text.replace(/[^a-zA-Z0-9\d\s]/g, "");
    return cleanText;
}

