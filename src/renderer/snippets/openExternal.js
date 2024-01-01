import {shell} from 'electron'

document.body.addEventListener('click', event => {
    if (event.target.tagName.toLowerCase() == 'a' &&
        event.target.attributes.openExternal != undefined) {
            event.preventDefault()
            shell.openExternal(event.target.href)
        }
})