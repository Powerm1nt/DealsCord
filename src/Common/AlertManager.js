const AlertModel = require('./DataModels/AlertModel')
const parse = require('parse-duration')
const vinted = require('@powerm1nt/vinted-api')
const { generateEmbed } = require('./Embeds/VintedCollections')
const { ToadScheduler, SimpleIntervalJob, AsyncTask } = require('toad-scheduler')
const mongoose = require('mongoose')
const Alert = mongoose.model('Alert', AlertModel)

class AlertManager {
  scheduler = new ToadScheduler()

  constructor () {
    this.alerts = []
  }

  async syncAlerts (interaction) {
    return await Alert.find({})
      .then(async (data) => {
        for (const alert of data) {
          const searchUrl = `https://www.vinted.fr/vetements?search_text=${alert.keywords}&price_from=${alert.price}&size=${alert.size}&reputation=${alert.reputation}&order=${alert.filter}&page=${alert.page}`

          // Fetch the cookie and search for the posts
          vinted.fetchCookie().then((data) => {
            vinted.search(searchUrl).then((data) => {
              alert.cache = data.items
            })
          })

          const task = new AsyncTask(`alert_${alert.name}`, async () => {
            console.log('Checking for new posts...')
            await vinted.fetchCookie()
              .then(async (data) => {
                await vinted.search(searchUrl).then(async (data) => {
                  interaction.client.channels.fetch(alert.channelId).then(async (channel) => {
                    for (const item of data.items) {
                      //  Check if the post is already in the cache
                      if (!alert.cache.find(c => c.id === item.id)) {
                        //  If not, send the embed and add it to the cache
                        await channel.send({
                          content: '✨ **Nouveau Post trouvé !**', embeds: [generateEmbed(item, null)]
                        })

                        alert.cache.push(item)
                      }
                    }
                  })
                })
              })
          }, (err) => {
            console.log(err)
          })

          this.scheduler.addSimpleIntervalJob(new SimpleIntervalJob({ seconds: alert.interval }, task, { id: alert.name }))
          this.alerts.push({
            name: alert.name, data: alert
          })
        }
      })
  }

  async addAlert (alert, interaction) {
    const _date = parse(alert.interval.toString(), 'second')
    if (!_date || _date < 60) throw new Error('Interval must be at least 1 minute, format example: 1h 30m 10s')
    alert.interval = _date
    // check if the alert already exists on the database
    await Alert.findOne({ name: alert.name }).then(async (data) => {
      if (data) throw new Error('Alert already exists')
    })

    return await Alert.create(alert).then(async () => {
      this.syncAlerts(interaction).then(() => {
        interaction.channel.send(`<@${interaction.user.id}> ✅ **Alerte créée avec succès !**`)
      })

      return alert
    })
  }

  async removeAlert (name) {
    return await Alert.findOne({ where: { name } }).then(async alert => {
      if (!this.alerts.find(a => a.name === name)) throw new Error('Alert does not exist')
      // Cancel the job and delete the element from the array
      this.scheduler.stopById(name)
      this.scheduler.removeById(name)
      this.alerts = this.alerts.filter(a => a !== alert)
      await Alert.findOneAndRemove({ name })
    })
  }

  getAlerts () {
    return this.alerts
  }
}

function getAlertManager () {
  if (getAlertManager.instance == null) {
    getAlertManager.instance = new AlertManager()
  }

  return getAlertManager.instance
}

module.exports = { getAlertManager }
