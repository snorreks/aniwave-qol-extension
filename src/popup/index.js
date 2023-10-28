/**
 * @type {HTMLInputElement} The "Skip Intro" checkbox
 */
const skipIntroCheckbox = document.getElementById('skipIntroCheckbox');

/**
 * @type {HTMLInputElement} The "Skip Ending" checkbox
 */
const skipEndingCheckbox = document.getElementById('skipEndingCheckbox');

/**
 * @type {HTMLSelectElement} The "Quality" select
 */
const selectedQuality = document.getElementById('qualitySelect');

// Load the settings from storage and update the checkboxes and select
chrome.storage.sync.get(['skipIntro', 'skipEnding', 'quality'], (result) => {
	skipIntroCheckbox.checked = result.skipIntro ?? true;
	skipEndingCheckbox.checked = result.skipEnding ?? true;
	selectedQuality.value = result.quality ?? 'auto';
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

selectedQuality.addEventListener('change', () => {
	const quality = selectedQuality.value;
	chrome.storage.sync.set({ quality });
});
