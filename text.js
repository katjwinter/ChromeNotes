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
	}
	
	var reset = function() {
		alert("resetting");
		textEl.text(defaultText);
	};
	
	var textChange = function() {
		docEl.trigger("NoteChange");
	}
	
	return {
		init:init
	}

});