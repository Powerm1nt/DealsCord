const { SlashCommandBuilder } = require('discord.js')
const vinted = require('@powerm1nt/vinted-api')
const { VintedPost } = require('../Embeds/VintedCollections')

const createCommand = new SlashCommandBuilder()
  .setName('create')
  .setDescription('Create a new vinted post alert')
  .addStringOption(option =>
    option
      .setName('keywords')
      .setDescription('Keywords to search for')
      .setRequired(true)
  )
  .addChannelOption(option =>
    option
      .setName('channel')
      .setDescription('Channel to send the alert to')
      .setRequired(true)
  )
  .addStringOption(option =>
    option
      .setName('interval')
      .setDescription('Interval to check for new posts')
      .setRequired(true)
  )
  .addStringOption(option =>
    option
      .setName('price')
      .setDescription('Price to search for')
      .setRequired(false)
  )
  .addStringOption(option =>
    option
      .setName('size')
      .setDescription('Size to search for')
      .setRequired(false)
  )
  .addStringOption(option =>
    option
      .setName('reputation')
      .setDescription('Reputation to search for')
      .setRequired(false)
  )

module.exports = {
  data: createCommand,
  async execute (interaction) {
    await vinted.fetchCookie()
      .then(async (data) => {
        const searchUrl = `https://www.vinted.fr/vetements?search_text=${interaction.options.getString('keywords')}&price_from=${interaction.options.getString('price')}&size=${interaction.options.getString('size')}&reputation=${interaction.options.getString('reputation')}`

        await vinted.search(searchUrl).then(async (data) => {
          await new VintedPost().makePost(interaction, data.items)
        })
      })
  }
}
