var docModule = (function() {
	
	function save(title, text) {
		// Check that there is not a title conflict
		chrome.storage.sync.get(title, function(document) {
			if (document[title]) {
				// There is already a note saved with this title
				return false;
			}
			else {
				// no conflict, so proceed with save
				var newDocument = {};
				newDocument[title] = text; // necessary step in order to save the key as a variable
				chrome.storage.sync.set(newDocument, function() {
					if (chrome.runtime.lastError) {
						return false;
					}
				});
				return true;
			}
		});
	}
	
	function remove(title) {
		chrome.storage.sync.remove(title, function() {
			// Problem deleting the file
			if (chrome.runtime.lastError) {
				return false;
			}
		});
		return true;
	}
	
	function removeAll() {
		chrome.storage.sync.clear(function() {
			if (chrome.runtime.lastError) {
				return false;
			}
		});
		return true;
	}
	
	function load(title) {
		var text;
		chrome.storage.sync.get(title, function(document) {
			text = document[title];
		});
		return text;
	}
	
	function getTitles() {
		var titles;
		chrome.storage.sync.get(null, function(allSaves) {
			titles = Object.getOwnPropertyNames(allSaves);
		});
		return titles;
	}
	
	return {
		save:save,
		remove:remove,
		removeAll:removeAll,
		load:load,
		getTitles:getTitles
	};
	
}());