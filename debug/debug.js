/**
 * Escape HTML special characters.
 * @param {string} text - The HTML text to escape.
 * @return {string} The escaped HTML.
 */
const escapeHtml = (text) => {
	const map = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#039;',
	};
	return text.replace(/[&<>"']/g, (m) => map[m]);
};

/**
 * Create and display a centered dialog overlay with the given content.
 * @param {Array} info - The array of button attribute objects to display.
 */
const showDialog = (info) => {
	const dialog = document.createElement('div');
	dialog.style.position = 'fixed';
	dialog.style.left = '50%';
	dialog.style.top = '50%';
	dialog.style.transform = 'translate(-50%, -50%)';
	dialog.style.background = '#fff';
	dialog.style.border = '1px solid #ccc';
	dialog.style.padding = '20px';
	dialog.style.zIndex = '1000';
	dialog.style.width = '90%'; // Making it bigger
	dialog.style.height = '90%'; // Making it bigger
	dialog.style.overflow = 'auto'; // Adding scroll
	dialog.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';

	dialog.innerHTML = `
	  <pre>${escapeHtml(info)}</pre>
	  <button id="close-dialog">Close</button>
	`;

	// Add close functionality
	const closeButton = dialog.querySelector('#close-dialog');
	closeButton.addEventListener('click', () => {
		document.body.removeChild(dialog);
	});

	document.body.appendChild(dialog);
};

setTimeout(() => {
	showDialog(document.body.innerHTML);
}, 5000);

// You can stop observing when you no longer need it
// observer.disconnect();

// const observer = new MutationObserver((mutations) => {
// 	mutations.forEach((mutation) => {
// 		if (mutation.addedNodes && mutation.addedNodes.length > 0) {
// 			const fullscreenButton = document.querySelector(
// 				'.jw-icon-fullscreen.jw-fullscreen-ima',
// 			);
// 			if (fullscreenButton) {
// 				// Dispatch the event to the document
// 				document.dispatchEvent(event);
// 				// fullscreenButton
// 				// 	.querySelectorAll('*')
// 				// 	.forEach(triggerMouseEvents);
// 				// triggerMouseEvents(fullscreenButton);
// 				observer.disconnect(); // Stop observing
// 			}
// 		}
// 	});
// });

// Start observing
// observer.observe(document.body, { childList: true, subtree: true });

// Create a keyboard event for the "f" key
// const event = new KeyboardEvent('keydown', {
// 	key: 'f',
// 	code: 'KeyF',
// 	keyCode: 70, // Key code for the "f" key
// 	which: 70, // For older browsers
// 	altKey: false,
// 	ctrlKey: false,
// 	shiftKey: false,
// 	metaKey: false,
// 	bubbles: true,
// 	cancelable: true,
// 	composed: true,
// 	isTrusted: true,
// });

// Dispatch the event to the document
// document.dispatchEvent(event);
