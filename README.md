# SafeHer Pro Structured

A structured Expo project for Android APK builds and web preview.

## Included
- Live GPS refresh + auto tracking
- SOS flow: opens call for primary contact, then opens SMS app with message
- Trusted contacts with digits-only validation
- Safety tips redesigned UI
- Live status card
- AsyncStorage history for events and locations
- Fake call screen

## Important limitation
On Android and iOS, normal apps generally cannot silently place a call and send an SMS completely in the background without opening the system dialer/messages app. This project opens the dialer for calling and then opens the messaging app with the danger text prefilled.

## Install
```bash
npm install
npx expo install --fix
npm run web
```

## Android APK build
```bash
npm install -g eas-cli
npx eas login
npx eas build -p android --profile preview
```
