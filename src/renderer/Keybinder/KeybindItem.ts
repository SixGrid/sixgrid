import { IKeybindItem, KeybindChord } from '../../shared/keybind'
const toolbox = require('tinytoolbox')

export class KeybindItem implements IKeybindItem
{
    public Id: string = toolbox.stringGen(8)
    public Chords: KeybindChord[] = []
    public Enable: boolean = false
    public Channel: string = ''
}