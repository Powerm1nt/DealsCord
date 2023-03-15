const { ConfigProvider } = require('./Common/ConfigProvider')
const { Client, GatewayIntentBits, Events } = require('discord.js')
// vinted.fetchCookie()
//    .then((data) => {
//       console.log(data)
//       vinted.search('https://www.vinted.fr/vetements?search_text=pokemon?page=2').then((data) => {
//          console.log(data)
//       })
//    })

const config = new ConfigProvider()
if (!config.has('token')) config.set('token', '<INSERT TOKEN HERE>') && config.save()

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
})
client.login(config.get('token'))

client.once(Events.ClientReady, () => {
  console.log('Ready!')
})
