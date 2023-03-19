const Alert = require('./DataModels/Alert')
const parse = require('parse-duration')
const vinted = require('@powerm1nt/vinted-api')
const { generateEmbed } = require('./Embeds/VintedCollections')
const { getClient } = require('../index')
const { ToadScheduler, SimpleIntervalJob, Task, AsyncTask } = require('toad-scheduler')

class AlertManager {
  scheduler = new ToadScheduler()

  constructor () {
    this.alerts = []
  }

  async addAlert (alert, interaction) {
    const _date = parse(alert.interval.toString(), 'second')
    if (!_date || _date < 60) throw new Error('Interval must be at least 1 minute')
    alert.interval = _date
    console.log(alert)
    const searchUrl = `https://www.vinted.fr/vetements?search_text=${alert.keywords}&price_from=${alert.price}&size=${alert.size}&reputation=${alert.reputation}&order=${alert.filter}&page=${alert.page}`
    // check if the alert already exists on the database
    const exists = await Alert.findOne({ where: { name: alert.name } })
    if (exists || this.alerts.find(f => f.name === alert.name)) throw new Error('Alert already exists')

    const item = Alert.build(alert)
    await Alert.sync()
    await vinted.fetchCookie().then(async (data) => {
      await vinted.search(searchUrl).then(async (data) => {
        alert.cache = data.items
      })
    })

    return await item.save().then(async () => {
      const task = new AsyncTask(`alert_${alert.name}`, async () => {
        console.log('Checking for new posts...')
        await vinted.fetchCookie()
          .then(async (data) => {
            await vinted.search(searchUrl).then(async (data) => {
              interaction.client.channels.fetch(alert.channel).then(async (channel) => {
                for (const item of data.items) {
                  //  Check if the post is already in the cache
                  if (!alert.cache.find(c => c.id === item.id)) {
                    alert.cache.push(item)

                    //  If not, send the embed and add it to the cache
                    await channel.send({
                      content: '✨ **Nouveau Post trouvé !**',
                      embeds: [generateEmbed(item, null)]
                    })
                  }
                }
              })
            })
          })
      }, (err) => {
        console.log(err)
      })

      this.scheduler.addSimpleIntervalJob(new SimpleIntervalJob({ seconds: alert.interval }, task))
      this.alerts.push({
        name: alert.name,
        data: alert,
        cache: []
      })

      return alert
    })
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
