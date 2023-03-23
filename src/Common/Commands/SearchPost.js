const { SlashCommandBuilder } = require('discord.js')
const vinted = require('@powerm1nt/vinted-api')
const { VintedPost } = require('../Embeds/VintedCollections')

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
      .setName('filter')
      .setDescription('Filter to search for')
      .addChoices(
        { name: 'Newest', value: 'newest_first' },
        { name: 'Pertinence', value: 'pertinence' },
        { name: 'Price: Low to High', value: 'price_low_to_high' },
        { name: 'Price: High to Low', value: 'price_high_to_low' }
      )
  )
  .addNumberOption(option =>
    option
      .setName('page')
      .setDescription('Page to search for')
  )
  .addStringOption(option =>
    option
      .setName('price-from')
      .setDescription('Price to start searching for')
      .setRequired(false)
  )
  .addStringOption(option =>
    option
      .setName('price-to')
      .setDescription('Price to stop searching for')
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
        const searchUrl = `https://www.vinted.fr/vetements?search_text=${interaction.options.getString('keywords')}&price_from=${interaction.options.getString('price-from')}&price_to=${interaction.options.getString('price-to')}&size=${interaction.options.getString('size')}&reputation=${interaction.options.getString('reputation')}&order=${interaction.options.getString('filter')}`

        await vinted.search(searchUrl).then(async (data) => {
          await new VintedPost().makePost(interaction, data.items)
        })
      })
  }
}
