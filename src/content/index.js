let shouldSkipIntro = true;
let shouldSkipEnding = true;

chrome.storage.sync.get(['skipIntro', 'skipEnding'], (result) => {
	if (result.skipIntro !== undefined) {
		shouldSkipIntro = result.skipIntro;
	}
	if (result.skipEnding !== undefined) {
		shouldSkipEnding = result.skipEnding;
	}
});

chrome.storage.onChanged.addListener((changes) => {
	if (changes.skipIntro !== undefined) {
		shouldSkipIntro = changes.skipIntro.newValue;
	}
	if (changes.skipEnding !== undefined) {
		shouldSkipEnding = changes.skipEnding.newValue;
	}
});

/**
 * Function to handle auto skip
 */
const handleVideoSkip = () => {
	if (!shouldSkipIntro && !shouldSkipEnding) {
		return;
	}

	/**
	 * @type {HTMLDivElement} The "Skip Intro" button
	 */
	const skipIntroButton = document.querySelector('.jw-skip.jw-skip-intro');
	if (!skipIntroButton || skipIntroButton.style.display === 'none') {
		return;
	}

	/**
	 * @type {HTMLVideoElement} The video element
	 */
	const videoElement = document.querySelector('.jw-video.jw-reset');
	if (!videoElement) {
		return;
	}

	const currentTime = videoElement.currentTime;
	const duration = videoElement.duration;

	// Check if it's the intro or ending based on your criteria
	const isIntro = currentTime < duration / 2; // Example: Halfway point

	if (isIntro) {
		// If it's the intro and skipping is enabled, perform the skip action
		shouldSkipIntro && skipIntroButton.click();
	} else {
		// If it's the ending and skipping is enabled, perform the skip action
		shouldSkipEnding && skipIntroButton.click();
	}
};

// Mutation observer to watch for changes in the "Skip Intro" button's style
const observer = new MutationObserver(handleVideoSkip);

observer.observe(document.body, {
	childList: true, // Watch for changes in child elements
	subtree: true, // Watch all descendants of the parent element
});
