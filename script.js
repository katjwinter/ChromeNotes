$(document).ready(function() {

	setup();
	title.init();
	text.init();
	
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
			$("#loadMenu").
				html(_.template(menuTemplate, {titleList:titleList})).
				show();
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
	
	function updateText(note) {
		if (note.text) {
			if (note.title != "autosave") 
				$(document).trigger("LoadNote", {title:title, text:text});
			}
			else {
				$(document).trigger("LoadAutoSave", {text:text});
			}
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
	
	// **************************** General GUI interaction
	// If user clicks somewhere other than a drop-down menu, make sure the dropdowns close
	$(document).click(function(event) { 
		if ($(event.target).closest("#menuOptions").length == 0) {
			$("#loadMenu").hide();
			$("#delMenu").hide();
		}        
	});
	
	$(document).bind("NoteChange") {
		// Sanitize user input
		currentText = sanitize( $("#text").val() ); 
		if (currentText) {
			throttled_autoSave();
		}
	});

function setup() {
	// Hide load menu until it's called for
	$("#loadMenu").hide();
	
	// Hide delete menu until it's called for
	$("#delMenu").hide();
	
	// Restore any auto-saved text
	docModule.load("autosave", initialize);
	
	function initialize(text) {
		$("#text").val(text);
	}
}

// Throttle autosave so we don't autosave constantly
var throttled_autoSave = _.throttle(autoSave, 20000);

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

