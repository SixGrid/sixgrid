const Library = require('../Library')

let instance = new Library.Client({
    auth: require('./secrets.json')
})
console.log(instance)
instance.Search({
    query: 'rating:safe',
    page: 1,
    limit: 5
}).then(console.log)