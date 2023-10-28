const baseListenersPath = 'background/listeners/';

/**
 * Injects a script into a frame.
 * @param {string} tabId The tab id.
 * @param {string} frameId The frame id.
 * @param {string} scriptPath The path to the script.
 */
const injectScriptIntoFrame = (tabId, frameId, scriptPath) => {
	chrome.scripting.executeScript(
		{
			files: [scriptPath],
			target: { tabId, frameIds: [frameId] },
		},
		() => {
			if (chrome.runtime.lastError) {
				console.log(
					'Script injection failed:',
					chrome.runtime.lastError,
				);
			} else {
				console.log('Script injected');
			}
		},
	);
};

// Listen for navigation events
chrome.webNavigation.onCommitted.addListener(
	(details) => {
		const tabId = details.tabId;
		// Get all frames in the current tab
		chrome.webNavigation.getAllFrames({ tabId }, (frames) => {
			for (const frame of frames) {
				if (frame.url.includes('vidplay.site')) {
					return injectScriptIntoFrame(
						tabId,
						frame.frameId,
						`${baseListenersPath}/vidplay.js`,
					);
				}
			}
		});
	},
	{ url: [{ hostSuffix: 'aniwave.to' }, { hostSuffix: 'vidplay.site' }] },
);

/**
 * Function to handle requests for fullscreen.
 * @param {string} key - The key to click.
 */
const clickKey = async (key) => {
	try {
		const response = await sendNativeMessage({
			type: 'key_click',
			payload: key,
		});
		console.log('clickKey:response', response);
	} catch (error) {
		console.error('handleRequestFullscreen', error);
	}
};

/**
 * Function to handle requests for fullscreen.
 * @param {object} [coordinates] - The key to click.
 * @param {number} [coordinates.x] - The x coordinate.
 * @param {number} [coordinates.y] - The y coordinate.
 */
const clickMouse = async (coordinates) => {
	try {
		const response = await sendNativeMessage({
			type: 'mouse_click',
			payload: coordinates ?? {},
		});
		console.log('clickMouse:response', response);
	} catch (error) {
		console.error('handleRequestFullscreen', error);
	}
};

/**
 * Function to handle requests for fullscreen.
 * @param {object} message - The message to send.
 * @param {string} message.type - The type of message.
 * @param {string | Record<string,unknown>} message.payload - The payload of the type.
 * @return {Promise} - The promise from the native app.
 */
const sendNativeMessage = async (message) => {
	console.log('sendNativeMessage:message', message);

	return new Promise((resolve, reject) => {
		// Set a timeout for the native app response (5 seconds)
		const timeoutMs = 5000;

		// Create a timer to handle the timeout
		const timer = setTimeout(() => {
			reject(new Error('Native app took too long to respond'));
		}, timeoutMs);

		// Send the message to the native app
		chrome.runtime.sendNativeMessage(
			'com.snorreks.input_bot',
			message,
			(response) => {
				// Clear the timeout
				clearTimeout(timer);

				// Check for errors in the response
				if (chrome.runtime.lastError) {
					reject(
						new Error(
							`Native app error: ${chrome.runtime.lastError.message}`,
						),
					);
				} else {
					resolve(response);
				}
			},
		);
	});
};

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message) => {
	switch (message.type) {
		case 'fullscreen':
			return clickKey('f');
		case 'togglePlay':
			return clickKey('space');
		case 'toggleMute':
			return clickKey('m');
		case 'clickMouse':
			return clickMouse(message.payload);
		default:
			return console.error('Unknown message', message);
	}
});
