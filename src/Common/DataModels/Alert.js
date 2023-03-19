const { Model, Sequelize } = require('sequelize')

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'data.db'
})

class Alert extends Model {
}

Alert.init({
  name: 'string',
  keywords: 'string',
  guildId: 'string',
  channelId: 'string',
  author: 'number',
  interval: 'number',
  price: 'number',
  size: 'string',
  reputation: 'number',
  page: 'number',
  filter: 'string'
}, { sequelize, modelName: 'alert' })

module.exports = Alert
