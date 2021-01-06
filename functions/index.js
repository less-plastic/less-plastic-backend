const functions = require('firebase-functions')
const admin = require('firebase-admin')
const express = require('express')
const cors = require('cors')

admin.initializeApp()
const db = admin.firestore()

const sessionRepository = require('./data/SesssionRepository')(db)
const onBoardingRepository = require('./data/OnBoardingRepository')(db)

const flowApiApp = express()
flowApiApp.use(cors({ origin: true }))


// API Onboarding

/**
 * Create a new onboarding session
 */
flowApiApp.post('/', (req, res) => {
    // pass user id
    var fetchedSession = {}
    sessionRepository.createSession('fake-user-id').then( (session) => {
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
flowApiApp.get('/:id', (req, res) => {
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
flowApiApp.patch('/:id', (req, res) => {
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
            sessionRepository.updateSession(sessionId, {
                currentStepId: step.id
            }).then( () => {
                sessionRepository.trackAnswer(
                    sessionId,
                    body.questionStepId,
                    body.answerStepId,
                    body.data
                ).then( () => {
                    res.status(204).send()
                }).catch( (e) => {
                    console.log(e)
                    res.status(204).send()
                })
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
exports.flow = functions.region('europe-west2').https.onRequest(flowApiApp);