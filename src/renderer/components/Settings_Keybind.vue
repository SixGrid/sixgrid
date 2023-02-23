<template>
    <div>
        <md-dialog :md-active.sync="showDialog">
            <md-dialog-title>Keybind Settings</md-dialog-title>
            <md-button @click="chordEditorOverlay('create')" class="md-primary">
                Add
            </md-button>

            <template v-if="getKeybinds().length < 1">
                <h4 style="text-align: center;">No keybinds registered</h4>
            </template>
            <template v-else>
                <table>
                    <template v-for="(keybind, index) in [].concat(activeBinds)">
                        <tr v-bind:key="`keybind-${index}`">
                            <th style="vertical-align: middle;">{{channelToPhrase(keybind.Channel)}}</th>
                            <td style="vertical-align: middle;">
                                <template v-for="(chord, cidx) in keybind.Chords">
                                    <div v-bind:key="`chord-${index}-${cidx}`">
                                        {{ chord.filter(v => getKeycodeEnumByValue(v) != null).map(c => getKeycodeEnumByValue(c)[0].replace(/^KEY/, '')).join('+').replace(/\+$/, '') }}
                                    </div>
                                </template>
                            </td>
                            <td>
                                <md-button class="md-dense md-raised md-accent" @click="removeKeybind(index)">
                                    Remove
                                </md-button>
                            </td>
                        </tr>
                    </template>
                </table>
            </template>

            <md-dialog-actions>
                <md-button @click="resetToDefault()">Reset</md-button>
                <md-button class="md-primary" @click="showDialog = false">Close</md-button>
                <md-button class="md-primary" @click="saveKeybinder()">Save</md-button>
            </md-dialog-actions>
        </md-dialog>
        <md-button class="md-primary md-raised" @click="showDialog = true">Show Dialog</md-button>
        <SettingsKeybindOverlay ref="chordEditor"/>
    </div>
</template>
<script>
import Vue from 'vue'
import * as kb from '../Keybinder/index'
import * as Channels from '../Keybinder/Channels'
import * as _kb_codes from '../Keybinder/enum.Keycode'
import { KeybindItem } from '../Keybinder/KeybindItem'
import SettingsKeybindOverlay from './SettingsKeybindOverlay.vue'
import * as ConfigInit from '../ConfigInit'
export default {
    name: 'SettingsKeybind',
    components: {SettingsKeybindOverlay},
    data() {
        return {
            showDialog: false,

            printdata: {},
            validChords: {},
            flags: {
                targetChordKeys: [],
                targetChannel: null
            },
            validTargetChannels: Object.entries(Channels.Data),
            activeBinds: []
        }
    },
    created () {
        this.validChords = _kb_codes
        this.activeBinds = this.getKeybinds()
    },
    methods: {
        resetToDefault() {
            ConfigInit.ResetItem('Keybind')
            AppData.CloudConfig.Keybind.write()
            AppData.Keybinder.Load()
            this.refreshBinds()
            setTimeout(() => {
                window.location = AppData.RootURI
            })
        },
        chordEditorOverlay (mode) {
            this.$refs.chordEditor.show()
            this.$refs.chordEditor.setMode(mode)
        },
        getTargetChannelOptions () {
            let data = [
                {
                    text: 'Pick an action',
                    value: null
                }
            ]
            for (let pair of this.validTargetChannels)
            {
                data.push({
                    text: pair[1],
                    value: pair[0]
                })
            }
            return data
        },
        createNewChord () {
            let dt = {
                selected: null
            }
            this.$data.flags.targetChordKeys.push(dt)
            this.refreshBinds()
        },
        removeChordKey (index) {
            let newTargetChordKeys = []
            let newArr = [].concat(this.$data.flags.targetChordKeys)
            for (let i = 0; i < newArr.length; i++) {
                let key = newArr[i]
                if (i !== index) {
                    newTargetChordKeys.push(key)
                }
            }
            this.$data.flags.targetChordKeys = newTargetChordKeys
            this.refreshBinds()
        },
        removeKeybind (index) {
            console.log(`[PrefrencesPageKeybinding->removeKeybind] index: ${index}`)
            AppData.Keybinder.removeBinding(index)
            this.refreshBinds()
        },
        registerKeybind() {
            if (this.flags.targetChannel == null)
                return alert(`Choose an action before registering.`)
            if (this.flags.targetChordKeys.length < 1)
                return alert(`Choose one or more keys in a chord before registering.`)
            let chords = []
            for (let i = 0; i < this.flags.targetChordKeys.length; i++) {
                chords.push(this.flags.targetChordKeys[i].value)
            }
            let item = new KeybindItem()
            item.Chords = [chords]
            item.Channel = this.flags.targetChannel
            item.Enable = true
            AppData.Keybinder.addBinding(item)
            this.resetFlags()
            this.refreshBinds()
            this.saveKeybinder()
        },
        resetFlags () {
            let dt = {
                targetChordKeys: [],
                targetChannel: null
            }
            this.flags = dt
            this.refreshBinds()
            return dt
        },
        channelToPhrase(channel)
        {
            for (let pair of this.validTargetChannels)
                if (pair[0] == channel)
                    return pair[1]
            return channel
        },
        refreshBinds () {
            let bds = []
            if (AppData.Keybinder.CurrentProfile != null)
                bds = AppData.Keybinder.CurrentProfile.Binds
            this.activeBinds = JSON.parse(JSON.stringify(bds))
        },
        saveKeybinder() {
            console.log(kb)
            this.refreshBinds()
            AppData.Keybinder.Save()
            vueJS.$toastr.success(``, 'Keybinds Saved')
        },
        getKeybinds(){
            if (AppData.Keybinder.CurrentProfile != null)
                return AppData.Keybinder.CurrentProfile.Binds
            return []
        },
        getKeycodeEnumByValue (value) {
            return AppData.Keybinder.getKeycodeEnumByValue(value)
        },
    }
}
</script>