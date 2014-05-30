var menu = (function() {

	var loadMenuSettings;
	var remMenuSettings;
	
	function init() {
		loadMenuSettings = {
			heading: "Select a file to load",
			error: "No saved files to load",
			element: $("#loadMenu")
		}
		remMenuSettings = {
			heading: "Select a file to DELETE",
			error: "No saved files to delete",
			element: $("#delMenu")
		}
		
		// Hide menus until called for
		$("#loadMenu").hide();
		$("#delMenu").hide();
		
		bindEvents();
	}
	
	function bindEvents() {
		$("#load").click(function() {
			// get all saved items
			docModule.getTitles( loadMenuSettings, buildMenu );
		});
		$("#delete").click(function() {
			docModule.getTitles( remMenuSettings, buildMenu );
		});
	}
	
	var buildMenu = function(settings, titles) {
		// If there is at least one saved note, present them in a dropdown list
		if (titles.length > 0) {
			var titleList = [];
			titleList.push(settings.heading);
			for (titlekey in titles) {
				titleList.push(titles[titlekey]);
			}			
			// Update the menu via underscore.js templates
			var menuTemplate = $("#menuTemplate").html();
			$(settings.element).html(_.template(menuTemplate, {titleList:titleList}));
			
			// Make the delete menu visible
			$(settings.element).show();
		}
		else {
			diagModule.showError(settings.error);
		}
	}

})();