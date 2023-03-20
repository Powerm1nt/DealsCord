const { SlashCommandBuilder } = require('discord.js')

const helpCommand = new SlashCommandBuilder()
  .setName('help')
  .setDescription('Display this help message')

const embed = {
  title: 'Help',
  description: '**List of all commands**',
  fields: [
    {
      name: '/help',
      value: 'Display this help message'
    },
    {
      name: '/search',
      value: 'Search for a product'
    },
    {
      name: '/create',
      value: 'Create a new alert'
    },
    {
      name: '/delete',
      value: 'Delete an alert'
    },
    {
      name: '/list',
      value: 'List all alerts'
    }
  ]
}

module.exports = {
  data: helpCommand,
  async execute (interaction) {
    interaction.reply({ embeds: [embed] }, { ephemeral: true })
  }
}
