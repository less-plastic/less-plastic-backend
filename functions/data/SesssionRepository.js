const { v4: uuidv4 } = require('uuid');

module.exports = (db) => {
    const modules = {}
    const sessionCollection = db.collection('sessions')

    const entryPointStep = '94c6ef59-f447-4713-ae8c-1bad2f6afab8'
    
    /**
     * Create a new session
     * @param {String} _userId 
     */
    modules.createSession = (_userId) => {
        let sessionId = uuidv4()
        return sessionCollection.doc(sessionId).set({
            userId: _userId,
            currentStepId: entryPointStep
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
        return sessionCollection.doc(_sessionId).get().then( (doc) => {
            let session = doc.data()
            session.id = doc.id
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
            return sessionCollection.doc(_sessionId).update({
                currentStepId: _data.currentStepId || session.currentStepId
            })
        })
    }

    return modules
}