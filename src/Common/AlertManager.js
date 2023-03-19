const Alert = require('./DataModels/Alert')
const parse = require('parse-duration')
const vinted = require('@powerm1nt/vinted-api')
const { generateEmbed } = require('./Embeds/VintedCollections')
const { ToadScheduler, SimpleIntervalJob, AsyncTask } = require('toad-scheduler')

class AlertManager {
  scheduler = new ToadScheduler()

  constructor () {
    this.alerts = []
  }

  async syncAlerts (interaction) {
    return await Alert.findAll()
      .then(async (data) => {
        console.log(data)
        for (const alert of data) {
          console.log('Channel NAME : ' + alert.channelId)
          const searchUrl = `https://www.vinted.fr/vetements?search_text=${alert.keywords}&price_from=${alert.price}&size=${alert.size}&reputation=${alert.reputation}&order=${alert.filter}&page=${alert.page}`

          await vinted.fetchCookie().then(async (data) => {
            await vinted.search(searchUrl).then(async (data) => {
              alert.cache = data.items
            })
          })

          const task = new AsyncTask(`alert_${alert.name}`, async () => {
            console.log('Checking for new posts...')
            await vinted.fetchCookie()
              .then(async (data) => {
                await vinted.search(searchUrl).then(async (data) => {
                  console.log('CHANNEL ID : ' + alert.channelId)
                  interaction.client.channels.fetch(alert.channelId).then(async (channel) => {
                    for (const item of data.items) {
                      //  Check if the post is already in the cache
                      if (!alert.cache.find(c => c.id === item.id)) {
                        //  If not, send the embed and add it to the cache
                        await channel.send({
                          content: '✨ **Nouveau Post trouvé !**',
                          embeds: [generateEmbed(item, null)]
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

          this.alerts.push({
            name: alert.name,
            data: alert
          })

          console.log(this.alerts)

          this.scheduler.addSimpleIntervalJob(new SimpleIntervalJob({ seconds: alert.interval }, task))
        }
      })
  }

  async addAlert (alert, interaction) {
    console.log(alert)
    const _date = parse(alert.interval.toString(), 'second')
    if (!_date || _date < 60) throw new Error('Interval must be at least 1 minute')
    alert.interval = _date
    // check if the alert already exists on the database
    await Alert.findOne({ where: { name: alert.name } }).then(async (data) => {
      if (data) throw new Error('Alert already exists')
    })

    await Alert.create(alert).then(async () => {
      await this.syncAlerts(interaction)
    })

    return alert
  }

  async removeAlert (name) {
    return await Alert.findOne({ where: { name } }).then(async () => {
      // Cancel the job and delete the element from the array
      this.alerts.find(a => a.name === name).job.cancelJob()
      this.alerts = this.alerts.filter(a => a !== alert)
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
