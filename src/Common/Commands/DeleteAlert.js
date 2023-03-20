const { SlashCommandBuilder } = require('discord.js')
const { getAlertManager } = require('../AlertManager')

const removeCommand = new SlashCommandBuilder()
  .setName('remove')
  .setDescription('Remove a vinted post alert')
  .addStringOption(option =>
    option
      .setName('name')
      .setDescription('Name of the alert')
      .setRequired(true)
  )

module.exports = {
  data: removeCommand,
  async execute (interaction) {
    return await getAlertManager().removeAlert(interaction.options.getString('name'))
      .then(() => {
        interaction.reply('✅ **Alerte supprimée avec succès !**')
      })
      .catch(async error => {
        await interaction.reply({ content: `🛑 **${error.message}**`, ephemeral: true })
        console.error(error)
      })
  }
}
