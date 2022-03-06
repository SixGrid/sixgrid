const Library = require('../Library')

let instance = new Library.Client({
    auth: {
        login: 'bjorkin',
        apikey: 'zY2vgYbMvzdE8gmZpM9UMMHJ',
        enable: true
    }
})
console.log(instance)
instance.Search({
    query: 'rating:safe',
    page: 1,
    limit: 5
}).then(console.log)