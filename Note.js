var title = (function() {

	function init() {
		this.title = $("#title");
		this.bindEvents();
	}
	
	function bindEvents() {
		this.title.click( editTitle ); // do we need to proxy it?
		this.title.blur( updateTitle );
	}
	
	editTitle: function() {
	},
	
	updateTitle: function() {
	}
	
	return {
		init:init
	}
	
})();