const { SlashCommandBuilder } = require('discord.js')

const removeCommand = new SlashCommandBuilder()
  .setName('remove')
  .setDescription('Remove a vinted post alert')

module.exports = {
  data: removeCommand,
  async execute (interaction) {
    await interaction.reply('Pong!')
  }
}
