const Library = require('../Library')

let instance = new Library.Client({
<<<<<<< HEAD
    auth: {
        login: 'bjorkin',
        apikey: 'zY2vgYbMvzdE8gmZpM9UMMHJ',
        enable: true
    }
=======
    auth: require('./secrets.json')
>>>>>>> vue-port
})
console.log(instance)
instance.Search({
    query: 'rating:safe',
    page: 1,
    limit: 5
}).then(console.log)