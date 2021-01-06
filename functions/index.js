const functions = require('firebase-functions')
const admin = require('firebase-admin')
const express = require('express')
//const cors = require('cors')

admin.initializeApp()
const db = admin.firestore()

const sessionRepository = require('./data/SesssionRepository')(db)
const onBoardingRepository = require('./data/OnBoardingRepository')(db)

const onboardingApp = express()
//onboardingApp.use(cors({ origin: true }))


// API Onboarding

/**
 * Create a new onboarding session
 */
onboardingApp.post('/', (req, res) => {
    // pass user id
    var fetchedSession = {}
    sessionRepository.createSession('session').then( (session) => {
        fetchedSession = session
        return onBoardingRepository.getStep(session.currentStepId)
    }).then( (step) => {
        fetchedSession.step = step
        res.json(fetchedSession)
    }).catch( (e) => {
        res.json(e)
    })

})

/**
 * Get session by id
 */
onboardingApp.get('/:id', (req, res) => {
    var fetchedSession = {}
    sessionRepository.findSession(req.params.id).then( (session) => {
        fetchedSession = session
        return onBoardingRepository.getStep(session.currentStepId)
    }).then( (step) => {
        fetchedSession.step = step
        res.json(fetchedSession)
    }).catch( (e) => {
        res.status(500).json({
            err: JSON.stringify(e)
        })
    })
});

/**
 * Update session
 */
onboardingApp.patch('/:id', (req, res) => {
    /**
     * {
     *  "questionStepId": "uuid",
     *  "answerStepId": "uuid",
     *  "data": "plain-text"
     * }
     */
    let body = req.body
    let sessionId = req.params.id
    sessionRepository.findSession(sessionId).then( (session) => {
        onBoardingRepository.getStep(body.answerStepId).then( (step) => {
            //TODO emit event
            sessionRepository.updateSession(sessionId, {
                currentStepId: step.id
            }).then( () => {
                res.status(204).send()
            }).catch( (e) => {
                console.log(e)
                res.status(500).send({
                    err: 'Error on update your choose'
                })
            })
        }).catch( (e) => {
            console.log(e)
            res.status(400).json({
                err: 'Step id not valid'
            })        
        })
    }).catch( (e) => {
        console.log(e)
        res.status(400).json({
            err: 'Invalid data'
        })
    })
});

// Expose Express API as a single Cloud Function:
exports.wizard = functions.https.onRequest(onboardingApp);