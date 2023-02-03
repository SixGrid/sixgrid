import { EventEmitter } from 'events'
import { KeybindChord, Keystate } from './index'
import { KeybindItem } from './KeybindItem'
import { KeybindProfile } from './KeybindProfile'
const enumKeycode: {[key: string]: number} = require('./enum.Keycode.js')
const toolbox = require('tinytoolbox')

export class KeybindManager extends EventEmitter {
    constructor() {
        super()
        this.on('save', () => this.Save())
        this.InitializeEvents()
    }

    public Load(): void
    {
        let data: KeybindProfile = global.AppData.CloudConfig.Keybind.get('currentProfileData')
        if (data == undefined)
            data = new KeybindProfile()
        this.CurrentProfile = data
        this.emit('internal.reloadBinding')
    }
    public Save(): void
    {
        global.AppData.CloudConfig.Keybind.set('currentProfileData', this.CurrentProfile)
    }
    public addBinding(bind: KeybindItem)
    {
        if (this.CurrentProfile != null)
            this.CurrentProfile.Binds.push(bind)
        this.emit('internal.reloadBinding')
        this.emit('save')
    }
    public removeBinding(index: number)
    {
        let newBinds = []
        let binds: KeybindItem[] = []
        if (this.CurrentProfile != null)
            binds = this.CurrentProfile.Binds
        for (let i = 0; i < binds.length; i++)
        {
            if (i != index)
            {
                newBinds[i] = binds[i]
            }
        }
        if (this.CurrentProfile != null)
            this.CurrentProfile.Binds = newBinds
        this.emit('internal.reloadBinding')
        this.emit('save')
    }
    private event_bindingsReload()
    {
        this.GenerateKeyStates()
        this.GenerateLookupTable()

        this.emit('internal.initElementListeners')
    }
    private event_initElementListeners(): void
    {
        let uid = toolbox.stringGen(13)
        this.uid = uid
        let events: (keyof GlobalEventHandlersEventMap)[] = [
            'keydown',
            'keyup'
        ]

        var self = this
        for (let item of events)
        {
            console.debug(`[KeybindManager->event_initElementListeners] ${uid} ${item}`)
            let itype = item as 'keydown' | 'keyup'
            window.addEventListener(itype, function (event: KeyboardEvent): void
            {
                self.event_handleElementEvent(uid, item, event);
            });
        }
    }
    private uid: string = ''
    private event_handleElementEvent(uid: string, eventName: string, event: KeyboardEvent)
    {
        if (uid != this.uid)
        {
            return;
        }

        if (event != undefined && event.target != undefined && (event.target as any).tagName == "INPUT") return
    
        let typemap: {[key: string]: Keystate} = {
            'keydown': Keystate.Down,
            'keyup': Keystate.Up
        }
        let targetEnum = typemap[eventName.toLowerCase()]

        let keyEnum = this.getKeycodeEnumByKey(event.code)
        if (keyEnum == null)
        {
            return;
        }
        console.debug(`[KeybindManager->${this.uid}->jqevent_key->${uid}->${eventName}] Key: ${keyEnum}, Target: ${targetEnum}`, event)

        this.setKeycodeState(keyEnum[1], targetEnum)
    
        let events = this.chordChecker()
        let events_obj = Object.entries(events)
        for (let i = 0; i < events_obj.length; i++) {
            let entry = events_obj[i]
            // console.log(targetEnum, keyEnum)
            if (targetEnum == Keystate.Down) {
                this.emit(...entry, targetEnum, event)
                this.emit(`down:${entry[0]}`, entry[1], targetEnum, event)
            } else {
                this.emit(`up:${entry[0]}`, entry[1], targetEnum, event)
            }
        }
    }
    private chordChecker() {
        let table_entries = Object.entries(this.LookupTable)
        let eventsToEmit: {[key: string]: KeybindChord[]} = {}
        for (let i = 0; i < table_entries.length; i++) {
            let entry = table_entries[i]

            if (eventsToEmit[entry[0]] != undefined) continue

            if (eventsToEmit[entry[0]] == undefined)
                eventsToEmit[entry[0]] = []

            let chords = entry[1]
            if (chords == undefined) continue
            for (let x = 0; x < chords.length; x++) {
                let chordKeys = chords[x]
                let keyMatches = []
                for (let z = 0; z < chordKeys.length; z++) {
                    let chordKey = chordKeys[z]
                    let enm = this.getKeycodeEnumByValue(chordKey)
                    if (enm != null)
                    {
                        if (this.KeyStates[enm[0]] == Keystate.Down)
                        {
                            keyMatches.push(enm)
                        }
                        // console.log(enm[0], this.KeyStates[enm[0]], this.KeyStatesPrevious[enm[0]])
                    }
                }
                if (keyMatches.length == chordKeys.length && keyMatches.filter(v => chordKeys.includes(v[1])).length == chordKeys.length)
                    eventsToEmit[entry[0]].push(chordKeys)
            }
        }
        return eventsToEmit
    }
    public getKeycodeEnumByValue(value: number) {
        let entries  = Object.entries(enumKeycode)
        for (let i = 0; i < entries.length; i++) {
            if (entries[i][1] == value)
                return entries[i]
        }
        return null
    }
    private getKeycodeEnumByKey(code: string): [string, number]|null
    {
        let entries = Object.entries(enumKeycode)
        for (let i = 0; i < entries.length; i++) {
            if (entries[i][0].toUpperCase() == code.toUpperCase()) {
                return entries[i]
            }
        }
        return null
    }
    private setKeycodeState(code: number, state: Keystate): void
    {
        let matches = []
        let entries = Object.entries(enumKeycode)
        for (let i = 0; i < entries.length; i++) {
            let entry = entries[i]
            if (entry[1] == code)
                matches.push(entry[0])
        }

        for (let i = 0; i < matches.length; i++) {
            this.KeyStatesPrevious[matches[i]] = this.KeyStates[matches[i]]
            this.KeyStates[matches[i]] = state
        }
    }
    private InitializeEvents(): void
    {
        this.on('update.profileCurrent', () => this.GenerateLookupTable())
        this.on('internal.reloadBinding', this.event_bindingsReload)
        this.on('internal.initElementListeners', this.event_initElementListeners)
    }

    public CurrentProfile: KeybindProfile|null = null
    public AvailableProfiles: KeybindProfile[] = []

    GetProfile(id: string): KeybindProfile|null
    {
        for (let item of this.AvailableProfiles)
        {
            if (item.Id == id)
            {
                return item;
            }
        }
        return null;
    }
    GetProfileByName(name: string): KeybindProfile|null
    {
        for (let item of this.AvailableProfiles)
        {
            if (item.Name == name)
            {
                return item;
            }
        }
        return null;
    }

    SetCurrentProfile(profile: KeybindProfile): void
    {
        // Check if profile exists, if it does then we replace it
        let profileIndex = this.AvailableProfiles.length;
        let existingProfile = this.GetProfile(profile.Id);
        if (existingProfile != null)
        {
            profileIndex = this.AvailableProfiles.indexOf(existingProfile);
        }

        // Replace/Add profile to available profiles
        this.AvailableProfiles[profileIndex] = profile;

        this.CurrentProfile = profile;
        this.emit('update.profileCurrent')
        this.emit('update.profileAvailable')
    }

    private GenerateLookupTable(): void
    {
        let data: LookupTableData = {}
        let binds: KeybindItem[] = []
        if (this.CurrentProfile != null)
        {
            binds = this.CurrentProfile.Binds
            this.CurrentProfile.Binds = this.CurrentProfile.Binds.filter(v => v != null && v != undefined)
        }

        for (let item of binds)
        {
            if (item == null)
            continue
            if (data[item.Channel] == undefined)
            {
                data[item.Channel] = [] as KeybindChord[]
            }
            data[item.Channel] = data[item.Channel].concat(item.Chords)
        }
        this.LookupTable = data
        this.emit('update.lookupTable')
    }
    private GenerateKeyStates(): void
    {
        let entries = Object.entries(enumKeycode) as [string, number][]
        let data: KeyStateData = {}
        for (let pair of entries)
        {
            data[pair[0]] = Keystate.Up
        }
        this.KeyStatesPrevious = JSON.parse(JSON.stringify(data))
        this.KeyStates = data
    }

    public LookupTable: LookupTableData = {}
    public KeyStates: KeyStateData = {}
    public KeyStatesPrevious: KeyStateData = {}
}
export type LookupTableData = {[key: string]: KeybindChord[]}
export type KeyStateData = {[key: string]: Keystate}