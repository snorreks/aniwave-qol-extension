let shouldSkipIntro = true;
let shouldSkipEnding = true;
let shouldInstantFullscreen = true;
let preferredQuality = 'auto';

const skipIntroButtonSelector = '.jw-skip.jw-skip-intro';
const videoElementSelector = '.jw-video.jw-reset';
const qualityButtonSelector = '.jw-settings-content-item[aria-label]';

chrome.storage.sync.get(
	['skipIntro', 'skipEnding', 'quality', 'lastTimeVideoEndedFullscreen'],
	(result) => {
		if (result.skipIntro !== undefined) {
			shouldSkipIntro = result.skipIntro;
		}
		if (result.skipEnding !== undefined) {
			shouldSkipEnding = result.skipEnding;
		}
		if (result.quality !== undefined) {
			preferredQuality = result.quality;
		}

		// Check the last time the video ended in fullscreen (within the 5 seconds)
		const lastTimeVideoEndedFullscreen =
			result.lastTimeVideoEndedFullscreen;
		const currentTime = Date.now();
		if (
			lastTimeVideoEndedFullscreen &&
			currentTime - lastTimeVideoEndedFullscreen <= 5000
		) {
			shouldInstantFullscreen = true;
		}
	},
);

chrome.storage.onChanged.addListener((changes) => {
	if (changes.skipIntro?.newValue !== undefined) {
		shouldSkipIntro = changes.skipIntro.newValue;
	}
	if (changes.skipEnding?.newValue !== undefined) {
		shouldSkipEnding = changes.skipEnding.newValue;
	}
	if (changes.quality?.newValue !== undefined) {
		preferredQuality = changes.quality.newValue;
	}
});

/**
 * Function to handle auto skip for intro and ending
 */
const autoSkipIntroAndEnding = () => {
	/**
	 * @type {HTMLDivElement} The "Skip Intro" button
	 */
	const skipIntroButton = document.querySelector(skipIntroButtonSelector);
	if (!skipIntroButton || skipIntroButton.style.display === 'none') {
		return;
	}

	/**
	 * @type {HTMLVideoElement} The video element
	 */
	const videoElement = document.querySelector(videoElementSelector);
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

let hasChangedQuality = false;

/**
 * Function to handle quality selection
 */
const autoSelectPreferredQuality = () => {
	if (hasChangedQuality) {
		return;
	}
	/**
	 * @type {NodeListOf<HTMLButtonElement>} The quality buttons
	 */
	const qualityButtons = document.querySelectorAll(qualityButtonSelector);
	const qualitySubMenu = document.getElementById(
		'jw-player-settings-submenu-quality',
	);
	for (const button of qualityButtons) {
		const quality = button.getAttribute('aria-label');
		const isChecked = button.getAttribute('aria-checked') === 'true';

		if (quality !== preferredQuality) {
			continue;
		}
		if (isChecked) {
			return;
		}
		hasChangedQuality = true;
		qualitySubMenu.setAttribute('aria-expanded', 'true'); // Expand the quality submenu
		button.click();
		qualitySubMenu.setAttribute('aria-expanded', 'false'); // Collapse the quality submenu again
	}
};

/**
 * Function to send a message to the background script to request fullscreen
 */
const requestFullscreenFromBackground = async () => {
	await chrome.runtime.sendMessage({ type: 'clickMouse' });
};

/**
 * Function to request fullscreen if the video recently ended
 */
const requestFullscreenIfVideoEnded = async () => {
	if (!shouldInstantFullscreen) {
		return;
	}
	/**
	 * @type {HTMLVideoElement} The video element
	 */
	const videoElement = document.querySelector(videoElementSelector);
	if (!videoElement) {
		return;
	}
	shouldInstantFullscreen = false;
	try {
		await requestFullscreenFromBackground();
		await Promise.all([
			videoElement.requestFullscreen(),
			videoElement.play(),
		]);
	} catch (error) {
		console.error(`Error requesting fullscreen: ${error.message}`);
	}
};

/**
 *  Whether the video end listener has started
 */
let hasStartedVideoEndListener = false;

/**
 * Function to store the end time of the video when it ends in fullscreen
 */
const startVideoEndedListener = () => {
	if (hasStartedVideoEndListener) {
		return;
	}
	/**
	 * @type {HTMLVideoElement} The video element
	 */
	const videoElement = document.querySelector(videoElementSelector);
	if (!videoElement) {
		return;
	}
	hasStartedVideoEndListener = true;

	// Listen for the 'ended' event
	videoElement.addEventListener('ended', () => {
		if (document.fullscreenElement) {
			chrome.storage.sync.set({
				lastTimeVideoEndedFullscreen: Date.now(),
			});
		}
	});
};

// Mutation observer to watch for changes in the "Skip Intro" button's style
const observer = new MutationObserver(() => {
	requestFullscreenIfVideoEnded();

	autoSkipIntroAndEnding();

	startVideoEndedListener();

	autoSelectPreferredQuality();
});

observer.observe(document.body, {
	childList: true, // Watch for changes in child elements
	subtree: true, // Watch all descendants of the parent element
});

/**
 * Function to click on the settings wheel button
 */
// const clickSettingsWheelButton = () => {
// 	const settingsWheelButton = document.querySelector(
// 		'.jw-icon.jw-icon-inline.jw-button-color.jw-reset.jw-icon-settings.jw-settings-submenu-button',
// 	);
// 	if (settingsWheelButton) {
// 		settingsWheelButton.click();
// 	}
// };
