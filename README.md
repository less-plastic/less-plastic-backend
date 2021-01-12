# Less Plastic Backend
![Build and Deploy](https://github.com/less-plastic/less-plastic-backend/workflows/Build%20and%20Deploy/badge.svg)

Non-profit project to create a mobile app to avoid the plastic wasting.

## The purpose
The purpose of this project is to create a server-less backend used by mobile apps. The goals is to allow the mobile application to orchestrate an onboarding flow.

## API
The APIs are three:
- POST ```/flow``` to create an onboarding session
- GET ```/flow/:sessionId``` to fetch the current session status
- PATCH ```/flow/:sessionId``` to update the current onboarding
```
{
  "currentStepId": "uuid",   // Mandatory
  "optionSelected": "uuid",  // Optional
  "data": "plain-text"       // Optional
}
```

## Flow
The onboarding flow uses a graph schema, each step has one or more children, and each step has a specific type:
- ```selection```: in this case the PATCH api expects an user's selection if the current flow exposes an array of options, in the case the options are null the GET will automatically return the step linked in the ```nextStepId```of the previous one.
- ```number```: in this scenario the PATH api expects a ```data```value with the valid number. If it will be provided it will redirect the user to the ```nextStepId```

![Flow](https://github.com/less-plastic/less-plastic-backend/blob/main/doc/flow.png?raw=true)

## Tracking
TBD

## CI/CD
Each commit/merge on ```main``` branch triggers the workflow to deploy the backend on the [Firebase Cloud Functions](https://firebase.google.com/docs/functions).
