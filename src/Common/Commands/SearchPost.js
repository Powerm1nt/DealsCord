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
      .setDescription('Size to search for (separate with space or semicolon)')
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
        const priceFrom = interaction.options.getString('price-from')
        const priceTo = interaction.options.getString('price-to')
        const size = interaction.options.getString('size')
        const reputation = interaction.options.getString('reputation')
        const page = interaction.options.getString('page')
        const order = interaction.options.getString('filter')

        // TODO DUPLICATE CODE
        const sizeArray = String(size).split(/[ ;,]+/)
        let url = `https://www.vinted.fr/vetements?search_text=${interaction.options.getString('keywords')}${priceFrom ? `&price_from=${priceFrom}` : ''}${priceTo ? `&price_to=${priceTo}` : ''}${reputation ? `&reputation=${reputation}` : ''}${order ? `&order=${order}` : ''}${page ? `&page=${page}` : ''}`

        sizeArray.forEach((size, index) => {
          if (sizeArray.length >= 1 && size !== 'null') {
            // add '&' character to separate query parameters
            if (url.split('?').length - 1) {
              url += '&'
            } else {
              url += '?'
            }

            url += `size=${size}`
          }
        })

        const searchUrl = new URL(url)
        console.log(searchUrl.href)
        await vinted.search(searchUrl).then(async (data) => {
          await new VintedPost().makePost(interaction, data.items)
        })
          .catch((err) => {
            throw err
          })
      })
      .catch((err) => {
        console.log('Err on SearchPost ' + err)
      })
  }
}
