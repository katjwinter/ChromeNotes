var text = (function() {

	var defaultText = "";
	var textEl = $("#text");
	var docEl = $(document);
	
	function init() {
		reset;
		bindEvents();
	}
	
	function bindEvents() {
		textEl.keydown(textChange);
		// Register for custom events
		docEl.bind("NewNote", reset);
		docEl.bind("LoadAutoSave", function(note) {
			if (note.text) {
				textEl.text(note.text);
			}
		}
	}
	
	var reset = function() {
		textEl.text(defaultText);
	};
	
	var textChange = function() {
		docEl.trigger("NoteChange");
	}
	
	return {
		init:init
	}

});