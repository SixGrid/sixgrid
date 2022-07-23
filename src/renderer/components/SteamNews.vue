<template>
    <div>
        <template v-if="error != null">
            <h1>Failed to Fetch News</h1>
            <pre><code>{{ error.toString() }}</code></pre>
        </template>
        <template v-for="item in content.appnews.newsitems">
            <div v-bind:key="`item-${item.guid}`" class="md-elevation-10" style="margin: 2rem; padding: 1rem">
                <h1><a :href="item.url" openexternal>{{ item.title }}</a></h1>
                <h2>{{ item.feedlabel }}</h2>
                <div :ref="`content-${item.guid}`" />
            </div>
        </template>
    </div>
</template>
<style>
h1.steam {
    font-size: 20px;
    line-height: 23px;
    color: #5aa9d6;
    font-weight: normal;
    margin-bottom: 10px;
    clear: both;
}
.steam.spoiler {
    background-color: black;
    color: black;
}
.steam.spoiler:hover {
    background-color: black;
    color: white;
}
</style>
<script>
const axios = require('axios')
const BBCodeParser =  require('js-bbcode-parser/src/index').default
const codeparser = new BBCodeParser({
    '\\[list\\](.+?)\\[/list\\]]': '<ul>$1</ul>',
    '\\[br\\]': '<br>',
    '\\[\\*\\] (.+?)\\n': '<li>$1</li>\n',

    '\\[b\\](.+?)\\[/b\\]': '<strong>$1</strong>',
    '\\[i\\](.+?)\\[/i\\]': '<em>$1</em>',
    '\\[u\\](.+?)\\[/u\\]': '<u>$1</u>',

    '\\[h1\\](.+?)\\[/h1\\]': '<h1 class="steam">$1</h1>',
    '\\[h2\\](.+?)\\[/h2\\]': '<h2>$1</h2>',
    '\\[h3\\](.+?)\\[/h3\\]': '<h3>$1</h3>',
    '\\[h4\\](.+?)\\[/h4\\]': '<h4>$1</h4>',
    '\\[h5\\](.+?)\\[/h5\\]': '<h5>$1</h5>',
    '\\[h6\\](.+?)\\[/h6\\]': '<h6>$1</h6>',

    '\\[code\\](.+?)\\[/code\\]': '<pre class="code"><code>$1</code></pre>',

    '\\[table\\](.+?)\\[/table\\]': '<table class="steam">$1</table>',
    '\\[tr\\](.+?)\\[/tr\\]': '<tr class="steam">$1</tr>',
    '\\[td\\](.+?)\\[/td\\]': '<td class="steam">$1</td>',
    '\\[th\\](.+?)\\[/th\\]': '<th class="steam">$1</th>',

    '\\[hr\\](.+?)\\[/th\\]': '</hr>',
    '\\[noparse\\](.+?)\\[/noparse\\]': '',
    '\\[spoiler\\](.+?)\\[/spoiler\\]': '<span class="steam spoiler">$1</span>',

    '\\[p\\](.+?)\\[/p\\]': '<p>$1</p>',

    '\\[color=(.+?)\\](.+?)\\[/color\\]':  '<span style="color:$1">$2</span>',
    '\\[size=([0-9]+)\\](.+?)\\[/size\\]': '<span style="font-size:$1px">$2</span>',

    '\\[img\\](.+?)\\[/img\\]': '<img src="$1">',
    '\\[img=(.+?)\\]':          '<img src="$1">',

    '\\[email\\](.+?)\\[/email\\]':       '<a href="mailto:$1" openexternal>$1</a>',
    '\\[email=(.+?)\\](.+?)\\[/email\\]': '<a href="mailto:$1" openexternal>$2</a>',

    '\\[url\\](.+?)\\[/url\\]':                      '<a href="$1" openexternal>$1</a>',
    '\\[url=(.+?)\\|onclick\\](.+?)\\[/url\\]':      '<a onclick="$1" openexternal>$2</a>',
    '\\[url=(.+?)\\starget=(.+?)\\](.+?)\\[/url\\]': '<a href="$1" target="$2" openexternal>$3</a>',
    '\\[url=(.+?)\\](.+?)\\[/url\\]':                '<a href="$1" openexternal>$2</a>',

    '\\[a=(.+?)\\](.+?)\\[/a\\]': '<a href="$1" name="$1" openexternal>$2</a>',

    '\\[list\\](.+?)\\[/list\\]': '<ul>$1</ul>',
    '\\[\\*\\](.+?)\\[/\\*\\]':   '<li>$1</li>'
})
export default {
    name: 'SteamNews',
    data () {
        return {
            content: {
                appnews: {
                    appid: 1992810,
                    newsitems: [],
                    count: 0
                }
            },
            error: null
        }
    },
    mounted () {
        // Fetch latest app news
        this.fetchAndUpdateAppHistory()
    },
    methods: {
        async fetchAndUpdateAppHistory() {
            let axiosCrap = null
            try
            {
                axiosCrap = await axios({
                    url: `http://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/?appid=1992810`,
                    method: `GET`
                })
            }
            catch(err)
            {
                console.error(`[SteamNews->fetchAndUpdateAppHistory] Failed to get App News`, err)
                this.$set(this.$data, 'error', err)
            }
            console.log(axiosCrap)
            if (axiosCrap == null) return
            this.$set(this.$data, 'content', axiosCrap.data)

            setTimeout(() => {
            for (let item of this.$data.content.appnews.newsitems)
            {
                console.log(this.$refs[`content-${item.guid}`], codeparser.parse(item.contents))
                if (this.$refs[`content-${item.guid}`].length > 0)
                    this.$refs[`content-${item.guid}`][0].innerHTML = codeparser.parse(item.contents)
            }
            }, 200)
        },
        convertContents(content) {
            return content.replaceAll('\n', '<br>')
        }
    }
}
</script>