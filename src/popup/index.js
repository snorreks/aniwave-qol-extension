/**
 * @type {HTMLInputElement} The "Skip Intro" checkbox
 */
const skipIntroCheckbox = document.getElementById('skipIntroCheckbox');

/**
 * @type {HTMLInputElement} The "Skip Ending" checkbox
 */
const skipEndingCheckbox = document.getElementById('skipEndingCheckbox');

// Load the settings from storage and update the checkboxes
chrome.storage.sync.get(['skipIntro', 'skipEnding'], (result) => {
	skipIntroCheckbox.checked = result.skipIntro ?? true;
	skipEndingCheckbox.checked = result.skipEnding ?? true;
});

// Add event listeners to update the storage when checkboxes change
skipIntroCheckbox.addEventListener('change', () => {
	const skipIntro = skipIntroCheckbox.checked;
	chrome.storage.sync.set({ skipIntro });
});

skipEndingCheckbox.addEventListener('change', () => {
	const skipEnding = skipEndingCheckbox.checked;
	chrome.storage.sync.set({ skipEnding });
});
