const { SlashCommandBuilder } = require('discord.js')
const { getAlertManager } = require('../AlertManager')
const vinted = require('@powerm1nt/vinted-api')

const editAlertCommand = new SlashCommandBuilder()
  .setName('edit')
  .setDescription('Edit an existing vinted post alert')
  .addStringOption(option => option
    .setName('name')
    .setDescription('Name of the alert')
    .setAutocomplete(true)
    .setRequired(true))
  .addStringOption(option => option
    .setName('keywords')
    .setDescription('Keywords to search for'))
  .addChannelOption(option => option
    .setName('channel')
    .setDescription('Channel to send the alert to'))
  .addStringOption(option => option
    .setName('interval')
    .setDescription('Interval to check for new posts'))
  .addStringOption(option => option
    .setName('brand')
    .setDescription('Brand to search for')
    .setAutocomplete(true))
  .addStringOption(option => option
    .setName('filter')
    .setDescription('Filter to search for')
    .addChoices({ name: 'Newest', value: 'newest_first' }, {
      name: 'Pertinence',
      value: 'pertinence'
    }, { name: 'Price: Low to High', value: 'price_low_to_high' }, {
      name: 'Price: High to Low',
      value: 'price_high_to_low'
    }))
  .addNumberOption(option => option
    .setName('page')
    .setDescription('Page to search for'))
  .addStringOption(option => option
    .setName('price-from')
    .setDescription('Price to start searching for'))
  .addStringOption(option => option
    .setName('price-to')
    .setDescription('Price to stop searching for'))
  .addStringOption(option => option
    .setName('size')
    .setDescription('Size to search for (separate with space or semicolon)'))
  .addStringOption(option => option
    .setName('reputation')
    .setDescription('Reputation to search for'))

module.exports = {
  data: editAlertCommand,
  async execute (interaction) {
    await getAlertManager().getAlerts(interaction.guild.id).then(async (alerts) => {
      const alert = alerts.find(alert => alert.name === interaction.options.getString('name'))

      const name = interaction.options.getString('name')
      const keywords = interaction.options.getString('keywords') !== undefined ? interaction.options.getString('keywords') : alert.keywords
      const guildId = interaction.guild.id
      const channelId = interaction.options.getChannel('channel') !== undefined ? interaction.options.getChannel('channel') : alert.channelId
      const interval = interaction.options.getString('interval') !== undefined ? interaction.options.getString('interval') : alert.interval
      const author = interaction.user.id
      const priceFrom = interaction.options.getString('price-from') !== undefined ? interaction.options.getString('price-from') : alert.priceFrom
      const priceTo = interaction.options.getString('price-to') !== undefined ? interaction.options.getString('price-to') : alert.priceTo
      const size = interaction.options.getString('size') !== undefined ? interaction.options.getString('size') : alert.size
      const reputation = interaction.options.getString('reputation') !== undefined ? interaction.options.getString('reputation') : alert.reputation
      const page = interaction.options.getNumber('page') !== undefined ? interaction.options.getNumber('page') : alert.page
      const order = interaction.options.getString('filter') !== undefined ? interaction.options.getString('filter') : alert.order
      const brand = interaction.options.getString('brand') !== undefined ? interaction.options.getString('brand') : alert.brand

      await getAlertManager().editAlert({
        name,
        keywords,
        guildId,
        channelId,
        interval,
        author,
        priceFrom,
        priceTo,
        size,
        reputation,
        page,
        order,
        brand
      }, interaction)
        .then(data => {
          interaction.reply({
            content: `Alert **${data.name}** edited successfully`,
            ephemeral: true
          })
        })
        .catch((err) => {
          interaction.reply({
            content: `🛑 **Error editing alert ${interaction.options.getString('name')}:** ${err.message}`,
            ephemeral: true
          })
        })
    })
  },
  async autocomplete (interaction) {
    const focusedOption = interaction.options.getFocused(true)
    if (focusedOption.name === 'name') {
      const alertManager = getAlertManager()
      const alertNames = await alertManager.getAlerts(interaction.guild.id)
      const alertNamesFiltered = alertNames.filter((alertName) => alertName.name.includes(focusedOption.value))

      return await interaction.respond(
        alertNamesFiltered.map((alertName) => ({
          name: alertName.name,
          value: alertName.name
        })))
    }

    if (focusedOption.name === 'brand') {
      await vinted.fetchCookie()
        .then(async () => {
          await vinted.fetchBrands(interaction.options.getString('brand')).then(async (data) => {
            await interaction.respond(data.brands.map((option) => ({
              name: option.title,
              value: option.id.toString()
            })))
          })
        })
        .catch((err) => {
          throw err
        })

        .catch((err) => {
          console.error('Err on SearchPost ' + err)
        })
    }
  }
}
