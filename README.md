# AniWave Quality of Life Extension

## Features

-   Auto skip intro and ending on AniWave videos.

## Installation

You can install the AniWave Quality of Life Extension from the [Chrome Web Store](https://chrome.google.com/webstore/detail/meefjliobkgnafkfoogkbnfbpakakppp).

## Development

## Load unpacked extensions

[Getting Started Tutorial](https://developer.chrome.com/docs/extensions/mv3/getstarted/)

1. Open the Extension Management page by navigating to `chrome://extensions`.
2. Enable Developer Mode by clicking the toggle switch next to `Developer mode`.
3. Click the `LOAD UNPACKED` button and select the `/dist` directory.

![Example](https://wd.imgix.net/image/BhuKGJaIeLNPW9ehns59NfwqKxF2/vOu7iPbaapkALed96rzN.png?auto=format&w=571)

### NOTES

-   This is only supported for vidplay videos, i have not looked into other video players.
-   Auto enter fullscreen does not work since it requires user interaction. I tried to make it work, see commented code regarding fullscreen in `debug/debug.js`

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
