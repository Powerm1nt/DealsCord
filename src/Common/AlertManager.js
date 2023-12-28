const AlertModel = require('./DataModels/AlertModel')
const parse = require('parse-duration')
const vinted = require('@powerm1nt/vinted-api')
const { generateEmbed } = require('./Embeds/VintedCollections')
const {
  ToadScheduler,
  SimpleIntervalJob,
  AsyncTask,
  Task
} = require('toad-scheduler')
const mongoose = require('mongoose')
const Alert = mongoose.model('Alert', AlertModel)
const { v4: uuidv4 } = require('uuid')
const chalk = require('chalk')
const {
  excludeCategory,
  categories
} = require('./Filters')

class AlertManager {
  scheduler = new ToadScheduler()

  constructor (client) {
    this._clearCookieId = uuidv4().split('-')[0]
    this.alerts = []
    this.client = client

    const clearCookiesTask = new Task(this._clearCookieId,
      () => {
        console.log('Clearing Cookies Task Started')
        vinted.clearCookies()
      }, err => {
        console.error(err)
      })

    const job = new SimpleIntervalJob({ seconds: 30 * 60 }, clearCookiesTask)
    this.scheduler.addSimpleIntervalJob(job)
  }

  async updateAlert (alertId, alertData) {
    return Alert.findOneAndUpdate({ id: alertId }, alertData)
  }

  async syncAlerts (interaction) {
    return await Alert.find({})
      .then(async (data) => {
        for (const alert of data) {
          if (process.env.DEBUG === 'true') console.log(alert)
          const priceFrom = alert.price_from
          const priceTo = alert.price_to
          const size = alert.size
          const reputation = alert.reputation
          const page = alert.page
          const order = alert.order
          const brand = alert.brand_id
          const excluded_types = alert.excluded_types && Object.values(alert.excluded_types).map((value) => value)
          alert.cache = [] // Define alert.cache as an array of items
          console.log('Excluded types: ', excluded_types)

          let url = `https://www.vinted.fr/vetements?search_text=${alert.keywords}${priceFrom ? `&price_from=${priceFrom}` : ''}${priceTo ? `&price_to=${priceTo}` : ''}${reputation ? `&rating=${reputation}` : ''}${order ? `&order=${order}` : ''}${page ? `&page=${page}` : ''}${brand ? `&brand_id[]=${brand}` : ''}`

          // size && size.forEach((_size, index) => {
          //   if (size.length >= 1 && _size !== 'null') {
          //     // add '&' character to separate query parameters
          //     if (url.split('?').length - 1) {
          //       url += '&'
          //     } else {
          //       url += '?'
          //     }

          //     url += `size=${_size}`
          //   }
          // })

          const searchUrl = new URL(url)
          console.log(searchUrl.href)

          // Fetch the cookie and search for the posts
          await vinted.fetchCookie()
            .then(() => {
              return vinted.search(searchUrl)
            })
            .then((searchData) => {
              try {
                const items = Array.from(searchData.items)
                for (const item of items) {
                  alert.cache.push(item)
                }
              } catch (error) {
                // Handle any errors that occur during the fetchCookie or search operations
                console.error('An error occurred:', error)
                console.error('Alert ID: ' + alert.id)
                console.error('Alert Name: ' + alert.name)
                console.error(`Excluded types: ${excluded_types > 0 ? excluded_types : '(Nothing)'}`)
                console.error('Channel ID: ' + alert.channelId)
                console.error('Guild ID: ' + alert.guildId)
              }
            })
            .catch((error) => {
              // Handle any errors that occur during the fetchCookie or search operations
              console.error('An error occurred:', error)
              console.error('Alert ID: ' + alert.id)
              console.error('Alert Name: ' + alert.name)
              console.error(`Excluded types: ${excluded_types > 0 ? excluded_types : '(Nothing)'}`)
              console.error('Channel ID: ' + alert.channelId)
              console.error('Guild ID: ' + alert.guildId)
            })

          const task = new AsyncTask(alert.id, async () => {
            console.log('Checking for new posts...')

            await vinted.fetchCookie()
              .then(async () => {
                await vinted.search(searchUrl).then(async (data) => {
                  interaction.client.channels.fetch(alert.channelId).then(async (channel) => {
                    if (data?.items?.length > 0) {
                      for (const item of data.items) {
                        //  Check if the post is already in the cache
                        if (!alert.cache?.find(c => c.id === item.id)) {
                          // Check if the post is in the excluded types
                          if (!excludeCategory(item.url, excluded_types || 'maison', 'accessoires', 'divertissement')) {
                            console.log('Excluding post ' + item.id + ' ' + item.title)
                            break
                          }

                          if (item.rating < alert.reputation) {
                            console.log('Excluding post ' + item.id + ' ' + item.title)
                            break
                          }

                          //  If not, send the embed and add it to the cache
                          console.log('New post found, sending it to the channel... ' + item.id + ' ' + item.title)

                          // if (alert.reputation < item.rating)

                          await channel.send({
                            content: '✨ **Nouveau Post trouvé !**',
                            embeds: [generateEmbed(item, null)]
                          }).catch((err) => {
                            throw err
                          })

                          // Add it to cache
                          alert.cache.push(item)
                        }
                      }
                    }
                  }).catch((err) => {
                    console.error('-------- [ERROR] --------')
                    console.error(err)
                    console.error('Alert ID: ' + alert.id)
                    console.error('Alert Name: ' + alert.name)
                    console.error(`Excluded types: ${excluded_types > 0 ? excluded_types : '(Nothing)'}`)
                    console.error('Channel ID: ' + alert.channelId)
                    console.error('Guild ID: ' + alert.guildId)
                    console.error('-------- [ERROR] --------')

                    const reportError = (alert) => {
                      console.log('Channel not found, removing alert...')
                      if (process.env.DEBUG === 'true') console.log(alert)
                      this.removeAlert(alert.name, alert.guildId)
                        .then(() => {
                          this.client.users.fetch(alert.author).then((user) => {
                            user.send(`⚠️ Une erreur est survenue lors de la vérification des alertes **(alerte ${alert.name} dans l'un de vos serveurs)**, \nveuillez vérifier que le bot a bien les permissions nécessaires dans le salon où vous avez créé l'alerte.\n\nVeuillez noter que l'alerte se supprime automatiquement si cette erreur se produit.`)
                              .catch(err => console.error('Failed to send message to user ' + err))
                          })
                        })
                        .catch((err) => {
                          console.log(err)
                        })
                    }

                    interaction.client.channels.fetch(alert.channelId).catch(e => {
                      reportError(alert)
                    })

                    if (err.status === 403) {
                      reportError(alert)
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
              name: alert.name,
              id: alert.id,
              data: alert
            })
          }
        }
      })
  }

  getAlert (guildId, name) {
    return this.alerts.find(a => a.name === name && a.data.guildId === guildId)
  }

  async validateAlert (alert) {
    // eslint-disable-next-line no-undef
    return await new Promise((resolve, reject) => {
      alert.id = uuidv4().split('-')[0]
      // Make the size an array
      alert.size = alert.size !== null ? String(alert.size).split(/[ ;,]+/) : []
      if (!alert.name) reject(new Error('Name is required'))
      if (!alert.id) reject(new Error('ID is required'))

      const _date = parse(alert.interval.toString(), 'second')
      if (!_date || _date < 60) reject(new Error('Interval must be at least 1 minute, format example: 1h 30m 10s'))
      alert.interval = _date
      resolve(alert)
    })
  }

  async addAlert (alert, interaction) {
    return await this.validateAlert(alert).then(async (alert) => {
      // check if the alert already exists on the database
      await Alert.findOne({
        name: alert.name,
        guildId: interaction.guildId
      }).then(async (data) => {
        if (data) throw new Error('Alert already exists')
      })

      return await Alert.create(alert).then(async () => {
        console.log('Alert created successfully ' + alert.name + ' ' + alert.id)
        await this.syncAlerts(interaction)
        return alert
      })
    })
  }

  async removeAlert (name, guildId) {
    if (!name) throw new Error('Name is required')
    if (!guildId) throw new Error('Guild ID is required')

    return await Alert.findOne({
      name,
      guildId
    }).then(async alert => {
      if (!alert || !this.alerts.find(a => a.id === alert.id)) throw new Error('Alert does not exist')
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

function getAlertManager (client) {
  if (getAlertManager.instance == null) {
    getAlertManager.instance = new AlertManager(client)
  }

  return getAlertManager.instance
}

module.exports = { getAlertManager }
