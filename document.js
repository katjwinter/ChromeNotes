var document = (function() {
	
	function init() {
		bindEvents();
	}
	
	function bindEvents() {
		docEl.bind("SaveNote", store(e, data));
	}
	
	var store = function(e, data) {
		var title = data.title;
		var text = data.text;
	}

	return {
		init:init
	}
	
})();