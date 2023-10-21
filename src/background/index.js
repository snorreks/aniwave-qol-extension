chrome.webNavigation.onCommitted.addListener(
	(details) => {
		const tabId = details.tabId;
		chrome.webNavigation.getAllFrames({ tabId }, (frames) => {
			frames.forEach((frame) => {
				if (frame.url.includes('vidplay.site')) {
					chrome.scripting.executeScript(
						{
							files: ['content/index.js'],
							target: { tabId, frameIds: [frame.frameId] },
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
				}
			});
		});
	},
	{ url: [{ hostSuffix: 'aniwave.to' }, { hostSuffix: 'vidplay.site' }] },
);
