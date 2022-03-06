class CustomURL extends URL {
    get path() {
        return `${this.pathname}${this.search}`
    }
}
module.exports = CustomURL;