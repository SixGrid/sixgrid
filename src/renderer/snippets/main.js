import { ipcRenderer } from 'electron'
import './debugElementOutline'
import './openExternal'
import './metricHooks'

ipcRenderer.send('updateTitle', '')