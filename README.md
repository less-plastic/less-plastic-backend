# Less Plastic Backend
![Build and Deploy](https://github.com/less-plastic/less-plastic-backend/workflows/Build%20and%20Deploy/badge.svg)

Non-profit project to create a mobile app to avoid the plastic wasting.

## The purpose
The purpose of this project is to create a server-less backend used by mobile apps. The goals is to allow the mobile application to orchestrate an onboarding flow.

## API
The APIs are three:
- POST ```/onboarding``` to create an onboarding session
- GET ```/onboarding/:sessionId``` to fetch the current session status
- PATCH ```/onboarding/:sessionId``` to update the current onboarding

## Tracking
TBD

## CI/CD
Each commit/merge on ```main``` branch triggers the workflow to deploy the backend on the [Firebase Cloud Functions](https://firebase.google.com/docs/functions).
