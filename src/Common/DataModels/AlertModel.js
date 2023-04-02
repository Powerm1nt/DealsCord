const { Schema } = require('mongoose')

const AlertModel = new Schema({
  name: 'string',
  id: 'string',
  keywords: 'string',
  guildId: 'string',
  channelId: 'string',
  author: 'string',
  interval: 'number',
  price_from: 'number',
  price_to: 'number',
  size: 'array',
  brand_id: 'string',
  reputation: 'number',
  page: 'number',
  order: 'string',
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = AlertModel
