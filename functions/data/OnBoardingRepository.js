module.exports = (db) => {
    const modules = {}
    const STEP_COLLECTION = db.collection('steps')

    /**
     * Return requested step
     * @param {String} _stepId 
     */
    modules.getStep = (_stepId) => {
        return STEP_COLLECTION.doc(_stepId).get().then((doc) => {
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

                    default:
                        return Promise.resolve(dataStep)
                }
                
            } else {
                throw {err: 'step_id_not_found', message: 'Step with id {' + _stepId + '} not found'}
            }
        })
    }
    
    return modules
}