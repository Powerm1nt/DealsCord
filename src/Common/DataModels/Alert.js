const { Model, Sequelize } = require('sequelize')
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'data.db'
})

class Alert extends Model {
}

Alert.init({
  keywords: 'string',
  channel: 'string',
  interval: 'string',
  price: 'string',
  size: 'string',
  reputation: 'string',
  lastPost: 'string'
}, { sequelize, modelName: 'alert' })

module.exports = Alert
