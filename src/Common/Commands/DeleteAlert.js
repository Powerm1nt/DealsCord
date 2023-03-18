const { SlashCommandBuilder } = require('discord.js')

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

  }
}
