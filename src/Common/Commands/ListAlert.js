const { SlashCommandBuilder } = require('discord.js')
const { getAlertManager } = require('../AlertManager')

const listCommand = new SlashCommandBuilder()
  .setName('list')
  .setDescription('List all alerts')

module.exports = {
  data: listCommand,
  async execute (interaction) {
    return await getAlertManager().getAlerts().then(alerts => {
      // Display a list of alerts
      const alertList = alerts.map(alert => {
        return {
          name: alert.name,
          value: `Keywords: **${alert.data.keywords}** | Interval: **${alert.data.interval} seconds**`
        }
      })

      const embed = {
        title: 'Alerts',
        description: '**List of all alerts**',
        fields: alertList || [{ name: 'No alerts', value: 'No alerts found' }]
      }

      interaction.reply({ embeds: [embed] }, { ephemeral: true })
    })
  }
}
