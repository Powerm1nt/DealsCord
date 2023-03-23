const { SlashCommandBuilder } = require('discord.js')
const { getAlertManager } = require('../AlertManager')

const createCommand = new SlashCommandBuilder()
  .setName('create')
  .setDescription('Create a new vinted post alert')
  .addStringOption(option =>
    option
      .setName('name')
      .setDescription('Name of the alert')
      .setRequired(true)
  )
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
  data: createCommand,
  async execute (interaction) {
    await getAlertManager().addAlert({
      name: interaction.options.getString('name'),
      keywords: interaction.options.getString('keywords'),
      guildId: interaction.guild.id,
      channelId: interaction.options.getChannel('channel').id,
      interval: interaction.options.getString('interval'),
      author: interaction.user.id,
      price_from: interaction.options.getString('price-from'),
      price_to: interaction.options.getString('price-to'),
      size: interaction.options.getString('size'),
      reputation: interaction.options.getString('reputation'),
      page: interaction.options.getNumber('page'),
      order: interaction.options.getString('filter')
    }, interaction)
      .then(async (alert) => {
        await interaction.reply({
          content: `ℹ️ L'alerte **${alert.name}** a été envoyé avec succès !`,
          ephemeral: true
        })
      })
      .catch(async (error) => {
        await interaction.reply({ content: `🛑 **${error.message}**`, ephemeral: true })
        console.error(error)
      })
  }
}
