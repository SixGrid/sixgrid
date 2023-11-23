import { IKeybindProfile } from '../../shared/keybind'
import { KeybindItem } from './KeybindItem'


const toolbox = require('tinytoolbox')
export class KeybindProfile implements IKeybindProfile
{
    Id: string = toolbox.stringGen(8)
    Name: string = ''
    Binds: KeybindItem[] = []
}