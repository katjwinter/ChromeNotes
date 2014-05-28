var docModule = (function() {
	
	var autosave = "autosave";
	
	function save(title, text) {
		if ( !title ) {
			title = autosave;
		}
		else {
			// Check that there is not a title conflict
			chrome.storage.sync.get(title, function(document) {
				if (document[title]) {
					// There is already a note saved with this title
					return false;
				}
			});
		}
		// Proceed with save
		var newDocument = {};
		newDocument[title] = text; // necessary step in order to save the key as a variable
		chrome.storage.sync.set(newDocument, function() {
			if (chrome.runtime.lastError) {
				return false;
			}
		});
		return true;
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
	
	// chrome.storage.sync.get() is asynchronous so we need to call a callback function
	// instead of trying to return a result, even from within the callback we send to .get() in the first place
	function load(title, callback) {
		if ( !title ) {
			title = autosave;
		}
		chrome.storage.sync.get(title, function(document) {
			callback(document[title]);
		});
	}
	
	// chrome.storage.sync.get() is asynchronous so we need to call a callback function
	// instead of trying to return a result, even from within the callback we send to .get() in the first place
	function getTitles(callback) {
		chrome.storage.sync.get(null, function(allSaves) {
			callback(Object.getOwnPropertyNames(allSaves));
		});
	}
	
	return {
		save: save,
		remove: remove,
		removeAll: removeAll,
		load: load,
		getTitles: getTitles
	};
	
})();