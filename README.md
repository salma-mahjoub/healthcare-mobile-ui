# Healthcare Mobile UI

A mobile healthcare interface built with Expo and React Native.
This project focuses on clean UI, smooth UX, readable code, and a lightweight architecture .

## Overview

The app simulates the main flow of a healthcare professional:

- animated splash screen
- login screen
- sign-up screen
- main dashboard
- tab-based navigation
- secondary screens intentionally kept as `Coming soon`

The project currently runs without a backend. Displayed data is local on purpose so the interface stays fast and easy to evolve.

## Tech Stack

- Expo
- React Native
- Expo Router
- TypeScript
- Animated API
- Expo Linear Gradient
- React Native Safe Area Context
- Expo Vector Icons
- AsyncStorage for local session persistence

## Highlights

- clean and consistent visual direction
- short, native-driven animations with `useNativeDriver`
- reusable UI components for overview cards and quick actions
- system-based light and dark mode support
- persistent local session without a backend
- simple logout flow from the profile screen
- lint-clean codebase ready to push to GitHub

## Project Structure

```text
app/
  _layout.tsx
  index.tsx
  login.tsx
  signup.tsx
  (tabs)/
    _layout.tsx
    index.tsx
    schedule.tsx
    patients.tsx
    profile.tsx

components/
  AppButton.tsx
  AppInput.tsx
  HeartbeatLine.tsx
  LogoBox.tsx
  OverviewCard.tsx
  QuickActionButton.tsx

constants/
  colors.ts
  typography.ts

hooks/
  use-app-theme.ts

lib/
  auth-storage.ts
```

## Installation

```bash
npm install
```

## Run the Project

```bash
npm run start
```

Then open the app on:

- iOS Simulator
- Android Emulator
- Expo Go
- Web with `w`

## Available Scripts

```bash
npm run start
npm run android
npm run ios
npm run web
npm run lint
```

## User Flow

1. Animated splash screen
2. Login or sign up
3. Redirect to the main tab layout
4. Browse the dashboard
5. Stay signed in across app restarts
6. Log out from the profile screen to return to `login`

## Technical Choices

- Quick actions and overview cards are extracted into dedicated components to reduce duplication.
- The home screen uses configuration arrays outside the render body to keep the component cleaner.
- Some presentational components use `memo` to avoid unnecessary rerenders.
- Light and dark mode follow the device system theme.
- Local authentication state is stored with AsyncStorage to improve UX without introducing a backend.
- `Schedule`, `Patients`, and `Profile` started as intentionally lightweight screens to keep the scope focused.

## Quality Check

The project was verified with:

```bash
npm run lint
```

## Possible Next Steps

- connect the app to a real backend
- add token-based authentication
- introduce global state with Zustand or Redux Toolkit if the project grows
- add unit tests and end-to-end tests
- build real appointment and patient management flows

## Author

Prepared as a UI/UX and frontend engineering portfolio project.
