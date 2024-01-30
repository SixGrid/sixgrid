import * as electron from '@electron/remote'
const nativeTheme = electron.nativeTheme

nativeTheme.themeSource = AppData.CloudConfig['User'].get('darkMode', true) ? 'dark' : 'light'

// import dark mode css when enabled
if (nativeTheme.shouldUseDarkColors) {
    require('vue-material/dist/theme/default-dark.css')
} else {
    require('vue-material/dist/theme/default.css')
}
require('./theme.css')