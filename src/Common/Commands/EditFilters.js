const { SlashCommandBuilder } = require('discord.js')
const { getAlertManager } = require('../AlertManager')

const createCommand = new SlashCommandBuilder()
  .setName('edit-filters')
  .setDescription('Edit the filters of a vinted post alert')
  .addStringOption(option => option
    .setName('name')
    .setDescription('Name of the alert')
    .setRequired(true)
    .setAutocomplete(true))
  .addStringOption(option => option
    .setName('excluded-types')
    .setDescription('Excluded types to search for')
    .setRequired(false)
    .addChoices({
      name: 'Accessoires',
      value: 'accessoires'
    }, {
      name: 'Divertissement',
      value: 'divertissement'
    }, {
      name: 'Maison',
      value: 'maison'
    }, {
      name: 'Hommes',
      value: 'hommes'
    },
    {
      name: 'Femmes',
      value: 'femmes'
    }
    ))

module.exports = {
  data: createCommand,
  async execute (interaction) {
    const alertManager = getAlertManager()
    const alertName = interaction.options.getString('name')
    const excludedTypes = interaction.options.getString('excluded-types')
    const alert = alertManager.getAlert(alertName)
    if (!alert) {
      await interaction.reply(`No alert found with name ${alertName}`)
      return
    }
    if (excludedTypes) {
      alert.excludedTypes = excludedTypes
    }
    await interaction.reply(`Alert ${alertName} updated`)
  },
  async autocomplete (interaction) {
    const focusedOption = interaction.options.getFocused(true)
    const alertManager = getAlertManager()
    const alertNames = await alertManager.getAlerts(interaction.guild.id)
    const alertNamesFiltered = alertNames.filter((alertName) => alertName.name.includes(focusedOption.value))

    return await interaction.respond(
      alertNamesFiltered.map((alertName) => ({
        name: alertName.name,
        value: alertName.name
      })))
  }
}
