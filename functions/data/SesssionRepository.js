const { v4: uuidv4 } = require('uuid');

module.exports = (db) => {
    const modules = {}
    const sessionCollection = db.collection('sessions')

    const entryPointStep = 'eb728ac4-d21b-424b-ac08-0c74f676c1b2'
    
    /**
     * Create a new session
     * @param {String} _userId 
     */
    modules.createSession = (_userId) => {
        let sessionId = uuidv4()
        return sessionCollection.doc(sessionId)
            .set({
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
        return sessionCollection.doc(_sessionId)
            .get()
            .then( (doc) => {
                let session = doc.data()
                session.id = doc.id
                return Promise.resolve(session)
            })
    }

    return modules
}