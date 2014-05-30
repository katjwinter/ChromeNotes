// Module to create error and success dialogs using jQuery UI
var diagModule = (function() {

	function show(title, message)  {
		$("#dialog").
			text(message).
			dialog( {
				modal: true,
				draggable: true,
				resizable: false,
				position: ['center'],
				width: 300,
				title: title,
				buttons: {
					"OK": function() {
						$("#dialog").dialog("close");
					}
				}
			});
	}
	
	function showError(message) {
		show("Error", message);
	}
	
	function showSuccess(message) {
		show("Success", message);
	}
	
	return {
		showError:showError,
		showSuccess:showSuccess
	};
	
})();