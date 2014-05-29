var title = (function() {

	var defaultText = "Untitled";
	var titleEl = $("#title");
	var docEl = $(document);
	
	function init() {
		titleEl.text(defaultText);
		bindEvents();
	}
	
	function bindEvents() {
		titleEl.
			click( editTitle ).
			blur( updateTitle );
		// Register for custom events
		docEl.bind("NewNote", reset);
		docEl.bind("NoteChange", function() {
			titleEl.toggleClass("modified", true);
		});
		docEl.bind("SuccessfulSave", function() {
			titleEl.toggleClass("modified", false);
		});
	}
	
	var reset = function() {
		titleEl.
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