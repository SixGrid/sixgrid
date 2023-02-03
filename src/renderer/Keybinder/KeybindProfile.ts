import {KeybindItem} from './KeybindItem'

const toolbox = require('tinytoolbox')
export interface IKeybindProfile
{
    Id: string
    Name: string
}
export class KeybindProfile implements IKeybindProfile
{
    Id: string = toolbox.stringGen(8)
    Name: string = ''
    Binds: KeybindItem[] = []
}