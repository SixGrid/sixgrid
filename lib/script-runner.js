const vm = require('vm')

module.exports = (script, data, options, contextAdditions) =>
{
    if (data == undefined || typeof data != 'object') data = {}
    if (options == undefined || typeof options != 'object') options = {}
    if (contextAdditions == undefined || typeof contextAdditions != 'object') contextAdditions = []
    
    let scriptInstance = new vm.Script(script, Object.assign({}, options))

    let context = Object.assign({}, data, {
        log (...p) {
            console.log(...p)
        }
    })

    contextAdditions = contextAdditions.concat([
        Object,
        String,
        Number,
        Math
    ])

    Object.assign(context, ...contextAdditions)

    scriptInstance.runInNewContext(context)
    scriptInstance.createCachedData()
    console.log(context)

    let returnContext = {}

    let entries = Object.entries(context)
    for (let i = 0; i < entries.length; i++)
    {
        if (data[entries[i][0]] != undefined)
        {
            returnContext[entries[i][0]] = entries[i][1]
        }
    }

    return JSON.parse(JSON.stringify(returnContext))
}