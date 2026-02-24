<p style="margin: auto; max-width: 256px;" align="center" width="100%">

<img width="256" height="256" src="assets/images/splash-icon.png">

</p>

<h1 align="center">Paramita</h1>

> [!WARNING]
> This app was written to be as simple as possible for my use case. It may not work as well on other devices or contexts.

Paramita is a semi-static dashboard for use with the Boox Max Lumi2.

- 📅 Date and time
- 🌤 Regional weather (uses Open-Meteo API)
- 💬 Quotes to set the vibe

## Installation

Paramita is not distributed on the Google Play Store. To install it, you need to manually download and install the `.apk` file from the [latest release](https://github.com/luketurner/paramita/releases/latest).

## Usage

1. Install the app on your eInk device.
2. Disable all other screen UX (navigation bar, NavOrb)
3. Disable Auto Sleep and Power-Off Timeout.
4. Launch the app and put your device in landscape mode (I use the case as a stand).
5. Ideally, plug it in. Otherwise you'll need to regularly recharge it.

## Development

Paramita is written using [React Native](https://reactnative.dev/) and [Expo](https://expo.dev).

```bash

# Run dev server
npm run start

# Development Android build on EAS
eas login
eas build --platform android --profile development

# Build an APK
eas build --platform android --profile preview
```
