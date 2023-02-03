<template>
    <md-dialog :md-active.sync="modalVisible">
        <md-button @click="createChordKey()" class="md-raised md-primary">Add Key</md-button>
        <table>
            <template v-for="(key, index) in flags.targetChordKeys">
                <tr v-bind:key="`chord-key-${index}`">
                    <th>
                        <md-button @click="removeChordKey(index)" class="md-raised md-secondary">Remove</md-button>
                    </th>
                    <td>
                        <select v-model="flags.targetChordKeys[index].value">
                            <template v-for="(item, index) in Object.entries(validChords).map((c) => {return { value: c[1], text: c[0]}})">
                                <option v-bind:key="`chord-key-${index}-item-${index}`" :value="item.value" v-bind:disabled="item.value == null">{{item.text}}</option>
                            </template>
                        </select>
                    </td>
                </tr>
            </template>
        </table>
        <h3>Action</h3>
        <select v-model="flags.targetChannel">
            <template v-for="(item, index) in validTargetChannels">
                <option v-bind:key="`target-channel-${index}`" :value="item.value" v-bind:disabled="item.value == null">{{item.text}}</option>
            </template>
        </select>
        <md-dialog-actions>
            <md-button class="md-primary" @click="actionCancel()">Cancel</md-button>
            <md-button class="md-primary" @click="actionSubmit()">Save</md-button>
        </md-dialog-actions>
    </md-dialog>
</template>
<script>
import Vue from 'vue'
import * as enumKeycode from '../Keybinder/enum.Keycode'
import { KeybindItem } from '../Keybinder/KeybindItem'
export default {
    name: 'SettingsKeybindOverlay',
    data () {
        return {
            flags: {
                targetChordKeys: [],
                targetChannel: null
            },
            validChords: {},
            validTargetChannels: [],
            editorMode: 'create',
            modalVisible: false
        }
    },
    methods: {
        show () {
            this.resetFlags()
            this.modalVisible = true
            this.$parent.showDialog = false
        },
        hide () {
            this.resetFlags()
            this.modalVisible = false
            this.$parent.showDialog = true
        },

        resetFlags () {
            this.$set(this.$data.flags, 'targetChordKeys', [])
            this.$set(this.$data.flags, 'targetChannel', null)
            this.$set(this.$data, 'validTargetChannels', this.$parent.getTargetChannelOptions())
            this.$set(this.$data, 'validChords', enumKeycode)
            this.setMode('create')
        },
        setMode (mode='create') {
            this.editorMode = mode
        },

        createChordKey (dt) {
            if (dt == undefined || dt == null || typeof dt != 'object')
                dt = {}
            Object.assign(dt, {
                selected: null
            })
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
            this.flags.targetChordKeys = newTargetChordKeys
        },

        refreshBinds () {
            this.$parent.refreshBinds()
        },

        actionSubmit () {
            if (this.flags.targetChannel == null)
                return alert(`Choose an action before registering.`)
            if (this.flags.targetChordKeys.length < 1)
                return alert(`Choose one or more keys in a chord before registering.`)

            let chords = []
            for (let item of this.flags.targetChordKeys)
            {
                chords.push(item.value)
            }

            let item = new KeybindItem()
            item.Chords = [chords]
            item.Channel = this.flags.targetChannel
            item.Enable = true
            AppData.Keybinder.addBinding(item)
            this.$parent.saveKeybinder()
            this.hide()
        },
        actionCancel () {
            this.hide()
        }
    }
}
</script>