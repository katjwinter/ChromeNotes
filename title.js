var title = (function() {

	var defaultText = "Untitled";
	
	function init() {
		$("#title").text(defaultText);
		bindEvents();
	}
	
	function bindEvents() {
		$("#title").
			click( editTitle ).
			blur( updateTitle );
		// Register for custom events
		$(document).bind("NewNote LoadAutoSave", reset);
		$(document).bind("NoteChange", function() {
			$("#title").toggleClass("modified", true);
		});
		$(document).bind("SuccessfulSave", function() {
			$("#title").toggleClass("modified", false);
		});
		$(document).bind("LoadNote", function(data) {
			$("#title").
				text(data.title).
				toggleClass("modified", false);
		});
	}
	
	var reset = function() {
		$("#title").
			text(defaultText).
			toggleClass("modified", false);
	};
	
	var editTitle = function() {
		// When user clicks on the title, allow them to edit.
		$(this).
			prop("contenteditable", true).
			focus();
	};
	
	var updateTitle = function() {
		$(this).
			toggleClass("modified", true).
			prop("contenteditable", false);
	};
	
	return {
		init:init,
	};
	
})();