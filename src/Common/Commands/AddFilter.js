const {
  SlashCommandBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ActionRowBuilder
} = require('discord.js')
const { getAlertManager } = require('../AlertManager')

const createCommand = new SlashCommandBuilder()
  .setName('add-filter')
  .setDescription('Add a filter to an alert')
  .addStringOption(option => option
    .setName('name')
    .setDescription('Name of the alert')
    .setRequired(true)
    .setAutocomplete(true))
  .addStringOption(option => option
    .setName('type')
    .setDescription('Include a specified type')
    .setRequired(true)
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
    },
    {
      name: 'Parfums',
      value: 'parfums'
    }
    ))

module.exports = {
  data: createCommand,
  async execute (interaction) {
    const alertName = interaction.options.getString('name')
    const excluded_types = interaction.options.getString('excluded-types')
    const alert = await getAlertManager().getAlert(interaction.guild.id, alertName)

    if (!alert) {
      return await interaction.reply({
        content: `🛑 No alert found with name ${alertName}`,
        ephemeral: true
      })
    }

    const select = new StringSelectMenuBuilder()
      .setCustomId('category')
      .setPlaceholder('Select category to add')
      .setMinValues(1)
      .setMaxValues(alert.data.excluded_types.length)
      .addOptions(alert.data.excluded_types.map((type) =>
        new StringSelectMenuOptionBuilder().setLabel(type).setValue(type)))

    new ActionRowBuilder()
      .addComponents(select)

    if (excluded_types && alert.data.excluded_types.filter((type) => type === excluded_types).length >= 1) {
      return await interaction.reply({
        content: `🛑 Alert ${alertName} already contains ${excluded_types}`,
        ephemeral: true
      })
    } else if (alert.data.excluded_types) {
      alert.data.excluded_types.push(excluded_types)
    } else {
      alert.data.excluded_types = [excluded_types]
    }

    return getAlertManager().updateAlert(alert.id, { excluded_types: alert.data.excluded_types })
      .then(async () => {
        return await interaction.reply({
          content: `✅ Alert ${alertName} updated`,
          ephemeral: true
        })
      })
      .catch(async (error) => {
        return await interaction.reply({
          content: `🛑 Error updating alert ${alertName}: ${error.message}`,
          ephemeral: true
        })
      })
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
