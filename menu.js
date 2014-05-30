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
		// When a title is selected from the load menu, load that title and text
		$("#loadMenu").change(function() {
			var title = $(this).val();
			docModule.load(title, loadComplete);
		});
		// When a title is selected from the delete menu, delete that title and text
		$("#delMenu").change(function() {
			var title = $(this).val();
			if (docModule.remove( title )) {
				$(document).trigger("RemoveComplete", { title:title });
				$("#delMenu").hide();
			}
			else {
				$(document).trigger("RemoveComplete", null);
			}
		});
		// If user clicks somewhere other than a drop-down menu, make sure the dropdowns close
		$(document).click(function(e) { 
			if ($(e.target).closest("#menuOptions").length == 0) {
				$("#loadMenu").hide();
				$("#delMenu").hide();
			}        
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
	};
	
	// Load completed so hide menu and notify listeners
	var loadComplete = function(note) {
		$("#loadMenu").hide();
		$(document).trigger("LoadComplete", { title:note.title, text:note.text });
	};
	
	return {
		init:init
	};

})();