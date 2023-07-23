const { SlashCommandBuilder } = require('discord.js')
const { getAlertManager } = require('../AlertManager')
const parse = require('parse-duration')

const listCommand = new SlashCommandBuilder()
  .setName('list')
  .setDescription('List all alerts')

module.exports = {
  data: listCommand,
  async execute (interaction) {
    return await getAlertManager().getAlerts(interaction.guildId).then(alerts => {
      // Display a list of alerts

      const alertList = alerts.map(alert => {
        const excludedTypesString = alert.excluded_types?.join(', ')

        return {
          name: alert.name,
          value: `> Keywords: **${alert.keywords}**\n` +
            `> Interval: **${parse(alert.interval)}**\n` +
            `> ${alert.excluded_types?.length >= 1 ? `Excluded Types: ${excludedTypesString}` : 'No Excluded Types'}\n` +
            `> Channel: <#${alert.channelId}>`
        }
      })

      const embed = {
        title: 'Alerts',
        description: '**List of all alerts**',
        fields: alertList.length >= 1
          ? alertList
          : [{
              name: 'No alerts',
              value: 'No alerts found'
            }]
      }

      interaction.reply({
        embeds: [embed],
        ephemeral: true
      })
    })
  }
}
