const { SlashCommandBuilder } = require('discord.js')
const vinted = require('@powerm1nt/vinted-api')
const { VintedPost } = require('../Embeds/VintedPost')

const searchCommand = new SlashCommandBuilder()
  .setName('search')
  .setDescription('Search for a vinted post')
  .addStringOption(option =>
    option
      .setName('keywords')
      .setDescription('Keywords to search for')
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
  data: searchCommand,
  async execute (interaction) {
    await vinted.fetchCookie()
      .then(async (data) => {
        const searchUrl = `https://www.vinted.fr/vetements?search_text=${interaction.options.getString('keywords')}&price_from=${interaction.options.getString('price')}&size=${interaction.options.getString('size')}&reputation=${interaction.options.getString('reputation')}`

        await vinted.search(`https://www.vinted.fr/vetements?search_text=${interaction.options.getString('keywords')}?page=1`).then(async (data) => {
          await new VintedPost().makePost(interaction, data.items)
        })
      })
  }
}
