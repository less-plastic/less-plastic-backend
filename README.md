# less-plastic-backend
Non-profit project to create a mobile app to avoid the plastic wasting

## The purpose
The purpose of this project is to create a server-less backend used by mobile apps. The goals is to allow the mobile application to orchestrate an onboarding flow.

## API
The APIs are three:
- POST ```/onboarding``` to create an onboarding session
- GET ```/onboarding/:sessionId``` to fetch the current session status
- PATCH ```/onboarding/:sessionId``` to update the current onboarding

## Tracking
TODO
