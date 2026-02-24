<p style="margin: auto; max-width: 256px;" align="center" width="100%">

<img width="256" height="256" src="assets/images/splash-icon.png">

</p>

<h1 align="center">Paramita</h1>

> [!WARNING]
> This app was basically 100% written by AI using spec-driven development. In other words, it was vibe-coded, and comes with all the potential jank that implies. YMMV.

## Installation

Paramita is not distributed on the Google Play Store. To install it, you need to manually download and install the `.apk` file from the [latest release](https://github.com/luketurner/paramita/releases/latest).

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
