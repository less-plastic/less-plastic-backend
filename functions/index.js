const functions = require('firebase-functions')
const admin = require('firebase-admin')
const express = require('express')
const cors = require('cors')

admin.initializeApp()
const db = admin.firestore()

const sessionRepository = require('./data/SesssionRepository')(db)
const onBoardingRepository = require('./data/OnBoardingRepository')(db)

const onboardingApp = express()
onboardingApp.use(cors({ origin: true }))


// API Onboarding
onboardingApp.post('/', (req, res) => {
    // pass user id
    var fetchedSession = {}
    sessionRepository.createSession('session')
        .then( (session) => {
            fetchedSession = session
            return onBoardingRepository.getStep(session.currentStepId)
        }).then( (step) => {
            fetchedSession.step = step
            res.json(fetchedSession)
        }).catch( (e) => {
            res.json(e)
        })

})

onboardingApp.get('/:id', (req, res) => {
    var fetchedSession = {}
    sessionRepository.findSession(req.params.id)
        .then( (session) => {
            fetchedSession = session
            return onBoardingRepository.getStep(session.currentStepId)
        })
        .then( (step) => {
            fetchedSession.step = step
            res.json(fetchedSession)
        })
        .catch( (e) => {
            res.json(e)
        })
});

onboardingApp.patch('/onboarding/:id', (req, res) => {

});


const profileApp = express();
profileApp.use(cors({ origin: true }));

// API Profile
profileApp.get('/', (req, res) => res.send(Widgets.create()));

// Expose Express API as a single Cloud Function:
exports.onboarding = functions.https.onRequest(onboardingApp);
exports.profileAPI = functions.https.onRequest(profileApp);