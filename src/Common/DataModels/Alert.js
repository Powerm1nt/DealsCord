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
  channel: 'string',
  interval: 'string',
  price: 'string',
  size: 'string',
  reputation: 'string',
  lastPost: 'string'
}, { sequelize, modelName: 'alert' })

module.exports = Alert
