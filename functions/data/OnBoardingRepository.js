const { parse } = require("uuid")

module.exports = (db) => {
    const modules = {}
    const STEP_COLLECTION = db.collection('steps')

    const remapStep = (step) => {
        let data = {
            id: step.id,
            text: step.text,
            type: step.type
        }
        if (step.options && step.options.length > 0) {
            data.options = step.options.map((option) => remapStep(option))
        }

        return data
    }

    const parseDocument = (doc) => {
        let step = doc.data()
        step.id = doc.id
        return step
    }

    /**
     * Return requested step
     * @param {String} _stepId 
     */
    modules.getStep = (_stepId) => {
        return STEP_COLLECTION.doc(_stepId).get().then((doc) => {
            if (doc.exists) {
                return Promise.resolve(parseDocument(doc))
            } else {
                throw {err: 'step_id_not_found', message: 'Step with id {' + _stepId + '} not found'}
            }
        }).then( (step) => {
            switch (step.type) {
                case 'selection':
                    if (step.options) {
                        return Promise.all(step.options.map( ref => ref.get() )).then((options) => {
                            step.options = options.map( (doc) => {
                                return parseDocument(doc)
                            })
                            return Promise.resolve(step)
                        })
                    }

                default:
                    return Promise.resolve(step)
            }
        }).then( (step) => {
            return Promise.resolve(remapStep(step))
        })
    }


    /**
     * Get next step base on this reponse format {currentStepId, optionSelected, data}
     * @param {Object} _response 
     * @param {String} _sessionId 
     */
    modules.getNextStep = (_response, _sessionId) => {
        return STEP_COLLECTION.doc(_response.currentStepId).get().then((doc) => {
            if (doc.exists) {
                return Promise.resolve(parseDocument(doc))
            } else {
                throw {err: 'step_id_not_found', message: 'Step with id {' + _response.currentStepId + '} not found'}
            }
        }).then( (step) => {
            switch (step.type) {
                case 'selection':
                    // Use option selected
                    return STEP_COLLECTION.doc(_response.optionSelected).get().then((doc) => {
                        if (doc.exists) {
                            return Promise.resolve(parseDocument(doc))
                        } else {
                            throw {err: 'step_id_not_found', message: 'Step with id {' + _response.optionSelected + '} not found'}
                        }
                    })

                case 'number':
                    // If data is empty the response is missing, throw an error
                    if (_response.data === undefined) {
                        throw {err: 'the value in data is missing'}
                    }

                default:
                    return Promise.resolve(step)
            }
        }).then( (step) => {
            if (step.nextStepId) {
                return step.nextStepId.get().then((doc) => {
                    if (doc.exists) {
                        return Promise.resolve(parseDocument(doc))
                    } else {
                        throw {err: 'step_id_not_found', message: 'Step with id {' + step.nextStepId.ref + '} not found'}
                    }
                })
            } else {
                return Promise.resolve(step)
            }
        }).then( (step) => {
            return Promise.resolve(remapStep(step))
        })
    }
    
    return modules
}