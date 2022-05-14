const Library = require('../Library')

let instance = new Library.Client({
    auth: require('./secrets.json')
})
instance.Search({
    query: 'rating:safe',
    page: 1,
    limit: 5
}).then((posts) => {
    console.log(posts.length)
})