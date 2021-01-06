module.exports = (db) => {
    let modules = {}
    const stepCollection = db.collection('steps')

    /**
     * Return requested step
     * @param {String} _stepId 
     */
    modules.getStep = (_stepId) => {
        return stepCollection.doc(_stepId)
            .get()
            .then((doc) => {
                if (doc.exists) {
                    let dataStep = doc.data()
                    dataStep.id = doc.id
                    switch (dataStep.type) {
                        case 'selection':
                            if (dataStep.options) {
                                return Promise.all(dataStep.options.map( ref => ref.get() )).then( (options) => {
                                    dataStep.options = options.map( (doc) => {
                                        let item = doc.data()
                                        item.id = doc.id
                                        return item
                                    })
                                    return Promise.resolve(dataStep)
                                })
                            } else {
                                return Promise.resolve(dataStep)
                            }
                            break
                        default:
                            return Promise.resolve(dataStep)
                            break
                    }
                    
                } else {
                    throw 'Step with id {' + _stepId + '} not found'
                }
            })
    }
    
    return modules
}