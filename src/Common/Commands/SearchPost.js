const { SlashCommandBuilder } = require('discord.js')

const searchCommand = new SlashCommandBuilder()
  .setName('search')
  .setDescription('Search for a vinted post')

module.exports = {
  data: searchCommand,
  async execute (interaction) {
    await interaction.reply('Pong!')
  }
}
