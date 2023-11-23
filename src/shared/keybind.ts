export interface IKeybindProfile
{
    Id: string
    Name: string
    Binds: IKeybindItem[]
}
export interface IKeybindItem {
    Id: string
    Chords: KeybindChord[]
    Enable: boolean
    Channel: string
}
export declare type KeybindChord = number[]
export declare type KeybindChannel =
    'unknown' |
    'item:next' |
    'item:previous' |
    'view:close'
export enum Keystate
{
    Up,
    Down
}