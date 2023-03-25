const AlertModel = require('./DataModels/AlertModel')
const parse = require('parse-duration')
const vinted = require('@powerm1nt/vinted-api')
const { generateEmbed } = require('./Embeds/VintedCollections')
const { ToadScheduler, SimpleIntervalJob, AsyncTask } = require('toad-scheduler')
const mongoose = require('mongoose')
const Alert = mongoose.model('Alert', AlertModel)
const { v4: uuidv4 } = require('uuid')

class AlertManager {
  scheduler = new ToadScheduler()

  constructor () {
    this.alerts = []
  }

  async syncAlerts (interaction) {
    return await Alert.find({})
      .then(async (data) => {
        for (const alert of data) {
          console.log(alert)
          const priceFrom = alert.price_from
          const priceTo = alert.price_to
          const size = alert.size
          const reputation = alert.reputation
          const page = alert.page
          const order = alert.order

          const searchUrl = `https://www.vinted.fr/vetements?search_text=${alert.keywords}${priceFrom ? `&price_from=${priceFrom}` : ''}${priceTo ? `&price_to=${priceTo}` : ''}${size ? `&size=${size}` : ''}${reputation ? `&reputation=${reputation}` : ''}${order ? `&order=${order}` : ''}${page ? `&page=${page}` : ''}`

          console.log(searchUrl)

          // Fetch the cookie and search for the posts
          vinted.fetchCookie().then((data) => {
            vinted.search(searchUrl).then((data) => {
              alert.cache = data.items
            })
          })

          const task = new AsyncTask(alert.id, async () => {
            console.log('Checking for new posts...')
            await vinted.fetchCookie()
              .then(async (data) => {
                await vinted.search(searchUrl).then(async (data) => {
                  interaction.client.channels.fetch(alert.channelId).then(async (channel) => {
                    if (!channel) {
                      console.log('Channel not found, removing alert...')
                      await this.removeAlert(alert.name)
                      return
                    }

                    if (data.items.length !== 0) {
                      for (const item of data.items) {
                        //  Check if the post is already in the cache
                        if (!alert.cache.find(c => c.id === item.id)) {
                          //  If not, send the embed and add it to the cache
                          await channel.send({
                            content: '✨ **Nouveau Post trouvé !**', embeds: [generateEmbed(item, null)]
                          }).catch((err) => {
                            console.log(err.status)
                            console.log(err)
                          })

                          alert.cache.push(item)
                        }
                      }
                    }
                  })
                })
              })
          }, (err) => {
            console.log(err)
          })
          if (!this.scheduler.existsById(alert.id)) this.scheduler.addSimpleIntervalJob(new SimpleIntervalJob({ seconds: alert.interval }, task, { id: alert.id }))

          if (!this.alerts.find(a => a.id === alert.id)) {
            this.alerts.push({
              name: alert.name, id: alert.id, data: alert
            })
          }
        }
      })
  }

  async addAlert (alert, interaction) {
    alert.id = uuidv4().split('-')[0]
    if (!alert.name) throw new Error('Name is required')
    if (!alert.id) throw new Error('ID is required')

    const _date = parse(alert.interval.toString(), 'second')
    if (!_date || _date < 60) throw new Error('Interval must be at least 1 minute, format example: 1h 30m 10s')
    alert.interval = _date
    // check if the alert already exists on the database
    await Alert.findOne({ id: alert.id }).then(async (data) => {
      if (data) throw new Error('Alert already exists')
    })

    return await Alert.create(alert).then(async () => {
      console.log('Alert created successfully ' + alert.name + ' ' + alert.id)
      this.syncAlerts(interaction).then(() => {
        interaction.channel.send(`<@${interaction.user.id}> ✅ **Alerte créée avec succès !**`)
      })

      return alert
    })
  }

  async removeAlert (name, guildId) {
    if (!name) throw new Error('Name is required')
    if (!guildId) throw new Error('Guild ID is required')

    return await Alert.findOne({ name, guildId }).then(async alert => {
      if (!this.alerts.find(a => a.id === alert.id)) throw new Error('Alert does not exist')
      // Cancel the job and delete the element from the array
      this.scheduler.stopById(alert.id)
      this.scheduler.removeById(alert.id)

      // Remove the alert in memory
      this.alerts.forEach(a => {
        if (a.id === alert.id) {
          this.alerts.splice(this.alerts.indexOf(a), 1)
        }
      })
      // Remove the alert from the database
      await Alert.findOneAndRemove({ id: alert.id })
    })
  }

  async getAlerts (guildId) {
    const _alerts = []

    this.alerts.forEach(a => {
      if (guildId === a.data.guildId) _alerts.push(a.data)
    })

    return _alerts
  }
}

function getAlertManager () {
  if (getAlertManager.instance == null) {
    getAlertManager.instance = new AlertManager()
  }

  return getAlertManager.instance
}

module.exports = { getAlertManager }
