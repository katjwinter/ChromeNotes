var text = (function() {

	var defaultText = "";
	
	function init() {
		reset;
		bindEvents();
	}
	
	function bindEvents() {
		$("#text").keydown(textChange);
		// Register for custom events
		$(document).bind("NewNote", reset);
		$(document).bind("LoadAutoSave LoadNote", function(e, note) {
			if (note.text) {
				$("#text").text(note.text);
			}
		});
	}
	
	var reset = function() {
		$("#text").text(defaultText);
	};
	
	var textChange = function() {
		$(document).trigger("NoteChange");
	}
	
	return {
		init:init
	};

})();