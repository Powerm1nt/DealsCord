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
  channel: 'string',
  author: 'string',
  interval: 'string',
  price: 'string',
  size: 'string',
  reputation: 'string',
  page: 'number',
  filter: 'string'
}, { sequelize, modelName: 'alert' })

module.exports = Alert
