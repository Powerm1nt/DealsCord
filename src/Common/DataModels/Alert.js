const { Schema } = require('mongoose')

const Alert = new Schema({
  name: 'string',
  keywords: 'string',
  guildId: 'string',
  channelId: 'string',
  author: 'string',
  interval: 'number',
  price: 'number',
  size: 'string',
  reputation: 'number',
  page: 'number',
  filter: 'string',
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = Alert
