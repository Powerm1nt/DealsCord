const {
  SlashCommandBuilder,
  StringSelectMenuOptionBuilder,
  StringSelectMenuBuilder,
  ActionRowBuilder
} = require('discord.js')
const { getAlertManager } = require('../AlertManager')

const createCommand = new SlashCommandBuilder()
  .setName('remove-filter')
  .setDescription('Delete a filter from an alert')
  .addStringOption(option => option
    .setName('name')
    .setDescription('Name of the alert')
    .setRequired(true)
    .setAutocomplete(true))

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
      .setPlaceholder('Select category to remove')
      .setMinValues(1)
      .setMaxValues(alert.data.excluded_types.length)
      .addOptions(alert.data.excluded_types.map((type) =>
        new StringSelectMenuOptionBuilder().setLabel(type).setValue(type)))

    const row = new ActionRowBuilder()
      .addComponents(select)

    if (alert.data.excluded_types.length === 0) {
      return await interaction.reply({
        content: `🛑 Alert ${alertName} has no excluded types`,
        ephemeral: true
      })
    }

    const response = await interaction.reply({
      content: 'Choose an excluded type to remove',
      components: [row],
      ephemeral: true
    })

    // eslint-disable-next-line no-self-compare
    const filter = (interaction) => interaction.customId === 'category' && interaction.user.id === interaction.user.id
    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      time: 15000
    })
    collector.on('collect', async (interaction) => {
      const selected = interaction.values
      console.log(selected)
      alert.data.excluded_types = alert.data.excluded_types.filter((type) => !selected.includes(type))
      getAlertManager().updateAlert(alert.id, { excluded_types: alert.data.excluded_types }).then(
        async () => {
          await interaction.update({
            content: `✅ Alert ${alertName} updated`,
            components: []
          })
        }).catch(async (error) => {
        return await interaction.reply({
          content: `🛑 Error updating alert ${alertName}: ${error.message}`,
          ephemeral: true
        })
      })
    })

    collector.on('end', async (collected) => {
      if (collected.size === 0) {
        await interaction.editReply({
          content: 'No selection made',
          components: []
        })
      }
    })
  },
  async autocomplete (interaction) {
    const focusedOption = interaction.options.getFocused(true)
    const alertName = interaction.options.getString('name')

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
  }
}
