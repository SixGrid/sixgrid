import type {KeybindChord, KeybindChannel} from './index'
const toolbox = require('tinytoolbox')

export class KeybindItem
{
    public Id: string = toolbox.stringGen(8)
    public Chords: KeybindChord[] = []
    public Enable: boolean = false
    public Channel: string = ''
}