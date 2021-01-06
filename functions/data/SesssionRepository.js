const { v4: uuidv4 } = require('uuid');
const admin = require('firebase-admin');

module.exports = (db) => {
    const modules = {}
    const SESSION_COLLECTION = db.collection('sessions')

    const ENTRY_POINT_STEP_ID = 'c09528b8-4ece-4bd8-a925-df956cc987b0'
    
    /**
     * Create a new session
     * @param {String} _userId 
     */
    modules.createSession = (_userId) => {
        let sessionId = uuidv4()
        return SESSION_COLLECTION.doc(sessionId).set({
            userId: _userId,
            currentStepId: ENTRY_POINT_STEP_ID,
            updatedAt: Date(),
            createdAt: Date()
        }).then( () => {
            return modules.findSession(sessionId)
        }).then( (session) => {
            return Promise.resolve(session)
        })
    }

    /**
     * Search an existing session
     * @param {String} _sessionId 
     */
    modules.findSession = (_sessionId) => {
        return SESSION_COLLECTION.doc(_sessionId).get().then( (doc) => {
            let session = doc.data()
            session.sessionId = doc.id
            return Promise.resolve(session)
        })
    }

    /**
     * Update data of an existing session
     * @param {String} _sessionId 
     * @param {Object} _data 
     */
    modules.updateSession = (_sessionId, _data) => {
        return modules.findSession(_sessionId).then( (session) => {
            return SESSION_COLLECTION.doc(_sessionId).update({
                currentStepId: _data.currentStepId || session.currentStepId,
                updatedAt: Date()
            })
        })
    }

     /**
     * Track an user's answer
     * @param {String} _sessionId 
     * @param {String} _questionId 
     * @param {String} _answerId 
     * @param {String} _data 
     */
    modules.trackAnswer = (_sessionId, _questionId, _answerId, _data) => {
        let event = {
            questionId: _questionId,
            answerId: _answerId,
            data: _data || "",
            eventDate: Date()
        }

        return SESSION_COLLECTION.doc(_sessionId).update({ 
            answers: admin.firestore.FieldValue.arrayUnion(event),
            updatedAt: Date()
        })
    }

    return modules
}